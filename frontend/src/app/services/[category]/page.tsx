import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { api, ApiError } from "@/lib/api";
import { FilterSidebar } from "@/components/services/FilterSidebar";
import { TechnicianListClient } from "@/components/services/TechnicianListClient";
import { JsonLd } from "@/components/seo/JsonLd";
import {
    SITE_URL,
    SITE_NAME,
    CATEGORIES_SEO,
    getBreadcrumbSchema,
    getServiceSchema,
} from "@/lib/seo";

type SortBy = "rating" | "price" | "experience";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ category: string }>;
}): Promise<Metadata> {
    const { category } = await params;
    const seoData = CATEGORIES_SEO[category];

    const title = seoData?.title || `خدمات ${category} | ${SITE_NAME}`;
    const description =
        seoData?.description ||
        `احجز فنيين معتمدين ومتخصصين في خدمات ${category} بالمملكة العربية السعودية بأسعار واضحة وضمان ذهبي 30 يوماً.`;
    const canonical = `/services/${category}`;
    const imageUrl = seoData?.image || "/logo.png";

    return {
        title,
        description,
        keywords: seoData?.keywords,
        alternates: {
            canonical,
        },
        openGraph: {
            title,
            description,
            url: `${SITE_URL}${canonical}`,
            type: "website",
            images: [
                {
                    url: imageUrl,
                    width: 1200,
                    height: 630,
                    alt: seoData?.nameAr ? `خدمة ${seoData.nameAr} - ${SITE_NAME}` : `${title} - ${SITE_NAME}`,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: [imageUrl],
        },
    };
}

export default async function ServicesPage({
    params,
    searchParams,
}: {
    params: Promise<{ category: string }>;
    searchParams: Promise<{ minRating?: string; maxPrice?: string; sortBy?: string }>;
}) {
    const { category } = await params;
    const query = await searchParams;

    const minRating = query.minRating ? Number(query.minRating) : undefined;
    const maxPrice = query.maxPrice ? Number(query.maxPrice) : undefined;
    const sortBy: SortBy = query.sortBy === "price" || query.sortBy === "experience" ? query.sortBy : "rating";

    let categories: Awaited<ReturnType<typeof api.getCategories>>;
    let technicians: Awaited<ReturnType<typeof api.getTechniciansByCategory>>;

    try {
        [categories, technicians] = await Promise.all([
            api.getCategories(),
            api.getTechniciansByCategory(category, { minRating, maxPrice, sortBy }),
        ]);
    } catch (err) {
        if (err instanceof ApiError && err.status === 404) notFound();
        throw err; // caught by app/error.tsx
    }

    const activeCategory = categories.find((c) => c.slug === category);
    if (!activeCategory) notFound();

    const breadcrumbs = getBreadcrumbSchema([
        { name: "الرئيسية", url: "/" },
        { name: "خدمات الصيانة", url: "/services" },
        { name: activeCategory.nameAr, url: `/services/${category}` },
    ]);

    const serviceSchema = getServiceSchema(category, activeCategory.nameAr, activeCategory.priceFrom);

    return (
        <main>
            <JsonLd data={[breadcrumbs, serviceSchema]} />
            <div className="border-b border-line bg-white px-4 py-7 sm:px-6 md:px-10 md:py-8">
                <div className="mx-auto max-w-[1360px]">
                    <nav aria-label="مسار التنقل" className="mb-2.5 text-[12.5px] text-[#8A9691]">
                        <Link href="/" className="hover:underline">الرئيسية</Link> /{" "}
                        <Link href="/services" className="hover:underline">خدمات الصيانة</Link> /{" "}
                        <b className="text-ink">{activeCategory.nameAr}</b>
                    </nav>
                    <h1 className="mb-1.5 font-heading text-[24px] font-extrabold text-ink sm:text-[28px]">
                        اختر فني {activeCategory.nameAr} الأنسب لطلبك
                    </h1>
                    <p className="text-[14px] text-[#63756F]">
                        {technicians.length} فني {activeCategory.nameAr} معتمد ومتاح اليوم بالرياض وبأنحاء المملكة
                    </p>
                </div>
            </div>

            <div className="mx-auto grid max-w-[1360px] grid-cols-1 gap-5 px-4 py-6 sm:px-6 sm:py-8 md:grid-cols-[280px_1fr] md:gap-7 md:px-10 md:py-9">
                <FilterSidebar categories={categories} activeSlug={category} />
                {technicians.length > 0 ? (
                    <TechnicianListClient technicians={technicians} categoryLabel={activeCategory.nameAr} sortBy={sortBy} />
                ) : (
                    <div className="rounded-md border border-line bg-white p-10 text-center text-[14px] text-[#8A9691]">
                        لا يوجد فنيين مطابقين لهذه الفلاتر حاليًا. جرّب تعديل خيارات التصفية.
                    </div>
                )}
            </div>
        </main>
    );
}

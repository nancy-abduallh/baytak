import type { Metadata } from "next";
import { api } from "@/lib/api";
import { CategoryCard } from "@/components/services/CategoryCard";
import { Footer } from "@/components/layout/Footer";
import { JsonLd } from "@/components/seo/JsonLd";
import {
    SITE_URL,
    SITE_NAME,
    getBreadcrumbSchema,
} from "@/lib/seo";

export const metadata: Metadata = {
    title: "خدمات الصيانة والتشغيل المنزلي بالمملكة",
    description:
        "استعرض باقات خدمات صيانة وتشغيل المنازل المعتمدة في المملكة العربية السعودية: تكييف، سباكة، كهرباء، تنظيف، دهانات، ونجارة بأسعار واضحة وفنيين مرخصين.",
    alternates: {
        canonical: "/services",
    },
    openGraph: {
        title: `خدمات الصيانة والتشغيل المنزلي بالمملكة | ${SITE_NAME}`,
        description:
            "استعرض باقات خدمات صيانة وتشغيل المنازل المعتمدة في المملكة العربية السعودية: تكييف، سباكة، كهرباء، تنظيف، دهانات، ونجارة بأسعار واضحة وفنيين مرخصين.",
        url: `${SITE_URL}/services`,
        type: "website",
        images: [
            {
                url: "/logo.png",
                width: 800,
                height: 800,
                alt: `خدمات صيانة المنازل بالمملكة - ${SITE_NAME}`,
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: `خدمات الصيانة والتشغيل المنزلي | ${SITE_NAME}`,
        description:
            "باقات صيانة معتمدة لبيتك: سباكة، كهرباء، تكييف، تنظيف، دهانات ونجارة مع فنيين مرخصين وضمان 30 يوماً.",
        images: ["/logo.png"],
    },
};

export default async function ServicesIndexPage() {
    let categories: Awaited<ReturnType<typeof api.getCategories>> = [];
    let loadError = false;

    try {
        categories = await api.getCategories();
    } catch {
        loadError = true;
    }

    const breadcrumbJsonLd = getBreadcrumbSchema([
        { name: "الرئيسية", url: "/" },
        { name: "خدمات الصيانة", url: "/services" },
    ]);

    const itemListJsonLd = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: "فئات خدمات صيانة المنازل",
        itemListElement: categories.map((cat, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: cat.nameAr,
            url: `${SITE_URL}/services/${cat.slug}`,
        })),
    };

    return (
        <main>
            <JsonLd data={[breadcrumbJsonLd, itemListJsonLd]} />
            <div className="border-b border-line bg-white px-4 py-8 sm:px-6 md:px-10 md:py-10">
                <div className="mx-auto max-w-[1360px]">
                    <nav aria-label="مسار التنقل" className="mb-2.5 text-[12.5px] text-[#8A9691]">
                        الرئيسية / <b className="text-ink">خدمات الصيانة</b>
                    </nav>
                    <h1 className="mb-1.5 font-heading text-[28px] font-extrabold text-ink">
                        اختر الخدمة اللي يحتاجها بيتك
                    </h1>
                    <p className="text-[14px] text-[#63756F]">
                        6 فئات أساسية تغطي كافة أعمال الصيانة المنزلية، بأسعار معلنة ومحددة قبل الحجز — اختر فئة الخدمة لعرض الفنيين المعتمدين.
                    </p>
                </div>
            </div>

            <div className="mx-auto max-w-[1360px] px-4 py-8 sm:px-6 sm:py-10 md:px-10 md:py-12">
                {loadError && (
                    <div className="mb-6 rounded-md border border-danger/30 bg-danger/5 px-5 py-4 text-[13.5px] font-semibold text-danger">
                        تعذر تحميل قائمة الخدمات حاليًا. تأكد من اتصال الخادم ثم أعد المحاولة.
                    </div>
                )}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-5">
                    {categories.map((cat) => (
                        <CategoryCard key={cat.id} category={cat} />
                    ))}
                </div>
            </div>

            <Footer />
        </main>
    );
}

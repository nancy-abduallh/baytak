import { notFound } from "next/navigation";
import { api } from "@/lib/api";
import { FilterSidebar } from "@/components/services/FilterSidebar";
import { TechnicianListClient } from "@/components/services/TechnicianListClient";

export default async function ServicesPage({ params }: { params: Promise<{ category: string }> }) {
    const { category } = await params;

    const [categories, technicians] = await Promise.all([
        api.getCategories(),
        api.getTechniciansByCategory(category),
    ]);

    const activeCategory = categories.find((c) => c.slug === category);
    if (!activeCategory) notFound();

    return (
        <main>
            <div className="border-b border-line bg-white px-10 py-8">
                <div className="mx-auto max-w-[1360px]">
                    <div className="mb-2.5 text-[12.5px] text-[#8A9691]">
                        الرئيسية / الخدمات / <b className="text-ink">{activeCategory.nameAr}</b>
                    </div>
                    <h2 className="mb-1.5 text-[26px] font-extrabold">اختر فنّي {activeCategory.nameAr} المناسب لك</h2>
                    <p className="text-[14px] text-[#63756F]">
                        {technicians.length} فنّي {activeCategory.nameAr} معتمد متاح اليوم في الرياض
                    </p>
                </div>
            </div>

            <div className="mx-auto grid max-w-[1360px] grid-cols-[280px_1fr] gap-7 px-10 py-9">
                <FilterSidebar categories={categories} activeSlug={category} />
                <TechnicianListClient technicians={technicians} categoryLabel={activeCategory.nameAr} />
            </div>
        </main>
    );
}
import Link from "next/link";
import { ServiceCategory } from "@/lib/types";
import { CategoryCard } from "@/components/services/CategoryCard";

export function ServicesGrid({ categories }: { categories: ServiceCategory[] }) {
    return (
        <div className="mx-auto max-w-[1360px] px-4 py-14 sm:px-6 sm:py-20 md:px-10 md:py-24">
            <div className="mb-9 flex flex-col items-start gap-5 md:mb-11 md:flex-row md:items-end md:justify-between md:gap-0">
                <div>
                    <div className="text-[13.5px] font-bold text-green-500">خدماتنا</div>
                    <h2 className="mt-2.5 font-heading text-[27px] font-extrabold leading-tight sm:text-[30px] md:text-[32px]">كل ما يحتاجه بيتك، بفريق واحد</h2>
                    <p className="mt-2 max-w-[440px] text-[15px] text-[#63756F]">ست فئات رئيسية تغطي أكثر أعطال وصيانة المنازل شيوعًا، بأسعار معلنة قبل الحجز.</p>
                </div>
                <Link href="/services" className="flex items-center gap-1.5 font-bold text-teal-700">عرض كل الخدمات ←</Link>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-5">
                {categories.map((cat) => <CategoryCard key={cat.id} category={cat} />)}
            </div>
        </div>
    );
}
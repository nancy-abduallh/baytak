import Link from "next/link";
import { ServiceCategory } from "@/lib/types";
import { CategoryCard } from "@/components/services/CategoryCard";

export function ServicesGrid({ categories }: { categories: ServiceCategory[] }) {
    return (
        <div className="mx-auto max-w-[1360px] px-10 py-24">
            <div className="mb-11 flex items-end justify-between">
                <div>
                    <div className="text-[13.5px] font-bold text-green-500">خدماتنا</div>
                    <h2 className="mt-2.5 font-heading text-[32px] font-extrabold">كل ما يحتاجه بيتك، بفريق واحد</h2>
                    <p className="mt-2 max-w-[440px] text-[15px] text-[#63756F]">ست فئات رئيسية تغطي أكثر أعطال وصيانة المنازل شيوعًا، بأسعار معلنة قبل الحجز.</p>
                </div>
                <Link href="/services" className="flex items-center gap-1.5 font-bold text-teal-700">عرض كل الخدمات ←</Link>
            </div>
            <div className="grid grid-cols-3 gap-5">
                {categories.map((cat) => <CategoryCard key={cat.id} category={cat} />)}
            </div>
        </div>
    );
}
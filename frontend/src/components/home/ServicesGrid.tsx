import Link from "next/link";
import { ServiceCategory } from "@/lib/types";
import { CATEGORY_ICONS } from "@/lib/constants";

export function ServicesGrid({ categories }: { categories: ServiceCategory[] }) {
    return (
        <div className="mx-auto max-w-[1360px] px-10 py-24">
            <div className="mb-11 flex items-end justify-between">
                <div>
                    <div className="text-[13.5px] font-bold text-green-500">خدماتنا</div>
                    <h2 className="mt-2.5 font-heading text-[32px] font-extrabold">كل ما يحتاجه بيتك، بفريق واحد</h2>
                    <p className="mt-2 max-w-[440px] text-[15px] text-[#63756F]">
                        ست فئات رئيسية تغطي أكثر أعطال وصيانة المنازل شيوعًا، بأسعار معلنة قبل الحجز.
                    </p>
                </div>
                <Link href="/services/electrical" className="flex items-center gap-1.5 font-bold text-teal-700">
                    عرض كل الخدمات ←
                </Link>
            </div>

            <div className="grid grid-cols-3 gap-5">
                {categories.map((cat) => {
                    const Icon = CATEGORY_ICONS[cat.iconKey];
                    return (
                        <Link
                            key={cat.id}
                            href={`/services/${cat.slug}`}
                            className="group rounded-lg border border-line bg-white p-7 transition hover:-translate-y-1 hover:border-transparent hover:shadow-lift"
                        >
                            <div className="mb-5 grid h-14 w-14 place-items-center rounded-2xl bg-green-100 text-teal-700">
                                {Icon && <Icon className="h-6 w-6" />}
                            </div>
                            <h3 className="mb-2 text-[18.5px] font-bold">{cat.nameAr}</h3>
                            <p className="mb-4 text-[13.8px] leading-[1.7] text-[#63756F]">{cat.description}</p>
                            <div className="flex items-center justify-between border-t border-dashed border-line pt-4 text-[13px] text-[#8A9691]">
                                يبدأ من <b className="font-bold text-ink">{cat.priceFrom} {cat.priceUnit}</b>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
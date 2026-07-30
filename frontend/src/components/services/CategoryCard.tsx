import Link from "next/link";
import { ServiceCategory } from "@/lib/types";
import { CATEGORY_ICONS } from "@/lib/constants";

export function CategoryCard({ category }: { category: ServiceCategory }) {
    const Icon = CATEGORY_ICONS[category.iconKey];
    return (
        <Link
            href={`/services/${category.slug}`}
            className="group rounded-lg border border-line bg-white p-7 transition hover:-translate-y-1 hover:border-transparent hover:shadow-lift"
        >
            <div className="mb-5 grid h-14 w-14 place-items-center rounded-2xl bg-green-100 text-teal-700">
                {Icon && <Icon className="h-6 w-6" />}
            </div>
            <h3 className="mb-2 text-[18.5px] font-bold">{category.nameAr}</h3>
            <p className="mb-4 text-[13.8px] leading-[1.7] text-[#63756F]">{category.description}</p>
            <div className="flex items-center justify-between border-t border-dashed border-line pt-4 text-[13px] text-[#8A9691]">
                يبدأ من <b className="font-bold text-ink">{category.priceFrom} {category.priceUnit}</b>
            </div>
        </Link>
    );
}
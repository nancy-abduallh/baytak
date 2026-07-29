"use client";
import Link from "next/link";
import clsx from "clsx";
import { ServiceCategory } from "@/lib/types";

export function FilterSidebar({ categories, activeSlug }: { categories: ServiceCategory[]; activeSlug: string }) {
    return (
        <aside className="sticky top-[100px] h-fit rounded-md border border-line bg-white p-6">
            <h4 className="mb-4 text-[14.5px] font-bold">فئة الخدمة</h4>
            <div className="mb-6 flex flex-wrap gap-2">
                {categories.map((cat) => (
                    <Link
                        key={cat.slug}
                        href={`/services/${cat.slug}`}
                        className={clsx(
                            "rounded-full px-3.5 py-2 text-[12.8px] font-semibold",
                            cat.slug === activeSlug ? "bg-teal-700 text-white" : "bg-sand-100 text-[#57655F]"
                        )}
                    >
                        {cat.nameAr}
                    </Link>
                ))}
            </div>

            <div className="mb-6">
                <label className="mb-2.5 block text-[13px] font-semibold text-[#57655F]">نطاق السعر (ر.س)</label>
                <input type="range" min={50} max={300} defaultValue={200} className="w-full accent-teal-700" />
                <div className="mt-2 flex justify-between text-[12.5px] text-[#8A9691]">
                    <span>٥٠</span><span>٣٠٠</span>
                </div>
            </div>

            <div className="mb-6">
                <label className="mb-2.5 block text-[13px] font-semibold text-[#57655F]">تقييم الفني</label>
                {["4.5 فأعلى", "4.0 فأعلى", "الكل"].map((r) => (
                    <label key={r} className="mb-2 flex items-center gap-2 text-[13px] text-[#57655F]">
                        <input type="radio" name="rating" className="accent-teal-700" /> ★ {r}
                    </label>
                ))}
            </div>

            <div className="mb-6">
                <label className="mb-2.5 block text-[13px] font-semibold text-[#57655F]">وقت التوفر</label>
                <div className="flex flex-wrap gap-2">
                    {["اليوم", "غدًا", "أختار موعد"].map((slot, i) => (
                        <button key={slot} className={clsx("rounded-full px-3.5 py-2 text-[12.8px] font-semibold", i === 0 ? "bg-teal-700 text-white" : "bg-sand-100 text-[#57655F]")}>
                            {slot}
                        </button>
                    ))}
                </div>
            </div>

            <button className="w-full rounded-full bg-ink py-3.5 text-[13.8px] font-bold text-white">تطبيق الفلاتر</button>
        </aside>
    );
}
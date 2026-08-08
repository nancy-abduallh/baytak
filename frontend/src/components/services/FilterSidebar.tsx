"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import clsx from "clsx";
import { ServiceCategory } from "@/lib/types";

const RATING_OPTIONS = [
    { label: "4.5 فأعلى", value: "4.5" },
    { label: "4.0 فأعلى", value: "4" },
    { label: "الكل", value: "" },
];

export function FilterSidebar({ categories, activeSlug }: { categories: ServiceCategory[]; activeSlug: string }) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [maxPrice, setMaxPrice] = useState(() => Number(searchParams.get("maxPrice") ?? 300));
    const [minRating, setMinRating] = useState(() => searchParams.get("minRating") ?? "");

    const applyFilters = () => {
        const params = new URLSearchParams(searchParams.toString());
        if (maxPrice < 300) params.set("maxPrice", String(maxPrice)); else params.delete("maxPrice");
        if (minRating) params.set("minRating", minRating); else params.delete("minRating");
        const qs = params.toString();
        router.push(`/services/${activeSlug}${qs ? `?${qs}` : ""}`);
    };

    const clearFilters = () => {
        setMaxPrice(300);
        setMinRating("");
        router.push(`/services/${activeSlug}`);
    };

    const hasActiveFilters = searchParams.has("maxPrice") || searchParams.has("minRating");

    return (
        <aside className="h-fit rounded-md border border-line bg-white p-5 lg:sticky lg:top-[100px] lg:p-6">
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
                <label className="mb-2.5 block text-[13px] font-semibold text-[#57655F]">
                    السعر الأقصى: <b className="text-ink">{maxPrice} ر.س</b>
                </label>
                <input
                    type="range"
                    min={50}
                    max={300}
                    step={10}
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full accent-teal-700"
                />
                <div className="mt-2 flex justify-between text-[12.5px] text-[#8A9691]">
                    <span>٥٠</span><span>٣٠٠</span>
                </div>
            </div>

            <div className="mb-6">
                <label className="mb-2.5 block text-[13px] font-semibold text-[#57655F]">تقييم الفني</label>
                {RATING_OPTIONS.map((opt) => (
                    <label key={opt.label} className="mb-2 flex items-center gap-2 text-[13px] text-[#57655F]">
                        <input
                            type="radio"
                            name="rating"
                            checked={minRating === opt.value}
                            onChange={() => setMinRating(opt.value)}
                            className="accent-teal-700"
                        />
                        ★ {opt.label}
                    </label>
                ))}
            </div>

            <button onClick={applyFilters} className="w-full rounded-full bg-ink py-3.5 text-[13.8px] font-bold text-white">
                تطبيق الفلاتر
            </button>
            {hasActiveFilters && (
                <button onClick={clearFilters} className="mt-2.5 w-full rounded-full border border-line py-3 text-[13px] font-semibold text-[#57655F]">
                    إعادة تعيين
                </button>
            )}
        </aside>
    );
}
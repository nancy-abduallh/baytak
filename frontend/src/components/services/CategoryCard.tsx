import Link from "next/link";
import Image from "next/image";
import { ServiceCategory } from "@/lib/types";
import { CATEGORY_ICONS } from "@/lib/constants";
import { ArrowLeft, Sparkles, ShieldCheck } from "lucide-react";

// Mapping of category slugs to clean uploaded background images (with all text removed)
const CATEGORY_BACKGROUNDS: Record<string, string> = {
    plumbing: "/images/categories/plumbing.jpg",
    electrical: "/images/categories/electrical.jpg",
    ac: "/images/categories/ac.jpg",
    carpentry: "/images/categories/carpentry.jpg",
    painting: "/images/categories/painting.jpg",
    cleaning: "/images/categories/cleaning.jpg",
};

// Professional feature tags for each category
const CATEGORY_TAGS: Record<string, string> = {
    plumbing: "صيانة وتسليك فوري",
    electrical: "فني كهرباء معتمد",
    ac: "صيانة وتعبئة فريون",
    carpentry: "أبواب ودواليب وأقفال",
    painting: "دهان وتشطيب فاخر",
    cleaning: "نظافة فندقية شاملة",
};

export function CategoryCard({ category }: { category: ServiceCategory }) {
    const Icon = CATEGORY_ICONS[category.iconKey];
    const bgImage = CATEGORY_BACKGROUNDS[category.slug];
    const isCleaning = category.slug === "cleaning";
    const tag = CATEGORY_TAGS[category.slug] || "فنيون معتمدون";

    return (
        <Link
            href={`/services/${category.slug}`}
            className="group relative flex h-full min-h-[355px] flex-col justify-between overflow-hidden rounded-2xl sm:rounded-3xl border border-[#0D3831]/80 bg-[#071E1B] p-6 shadow-[0_10px_30px_rgba(7,30,27,0.2)] transition-all duration-500 hover:-translate-y-1.5 hover:border-emerald-500/70 hover:shadow-[0_22px_48px_rgba(7,30,27,0.38)] sm:p-7"
        >
            {/* Background Layer with Obvious, Clear Images */}
            {bgImage ? (
                <div className="absolute inset-0 z-0">
                    <Image
                        src={bgImage}
                        alt={`خدمة ${category.nameAr} - منصة بيتك لخدمات الصيانة`}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover object-center brightness-[0.95] contrast-[1.05] transition-all duration-700 ease-out group-hover:scale-110 group-hover:brightness-105"
                        priority={category.id <= 3}
                    />
                    {/* Top subtle vignette: protects icon & badge legibility while keeping equipment bright & visible */}
                    <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/60 via-black/25 to-transparent" />

                    {/* Progressive bottom dark scrim: keeps text 100% crisp, readable & obvious on pure dark backdrop */}
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[68%] bg-gradient-to-t from-[#041412] from-25% via-[#041412]/95 via-65% to-transparent" />
                </div>
            ) : (
                /* Fallback styling if any image is absent */
                <div className="absolute inset-0 z-0 overflow-hidden bg-gradient-to-br from-[#0B3A32] via-[#082924] to-[#041614]">
                    <div className="absolute -top-12 -right-12 h-48 w-48 rounded-full bg-emerald-500/20 blur-3xl transition-transform duration-700 group-hover:scale-125" />
                    <div className="absolute -bottom-12 -left-12 h-48 w-48 rounded-full bg-teal-500/20 blur-3xl transition-transform duration-700 group-hover:scale-125" />
                    <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:18px_18px] opacity-60" />
                    <Sparkles className="pointer-events-none absolute top-5 left-5 h-28 w-28 rotate-12 text-emerald-400/[0.08] transition-transform duration-700 group-hover:rotate-45 group-hover:scale-110" />
                </div>
            )}

            {/* Subtle inner highlight rim for premium depth */}
            <div className="pointer-events-none absolute inset-0 z-[1] rounded-2xl ring-1 ring-inset ring-white/15 transition-all duration-500 group-hover:ring-emerald-400/40 sm:rounded-3xl" />

            {/* Card Content (Relative z-10 for perfect legibility over backgrounds) */}
            <div className="relative z-10 flex h-full flex-col justify-between">
                <div>
                    {/* Top Bar: Icon Box & Category Badge */}
                    <div className="flex items-center justify-between">
                        <div
                            className={`inline-flex h-12 w-12 items-center justify-center rounded-xl border shadow-md transition-all duration-300 group-hover:scale-110 ${
                                isCleaning
                                    ? "border-emerald-400/40 bg-gradient-to-br from-emerald-500 to-teal-700 text-white shadow-emerald-900/40"
                                    : "border-white/25 bg-black/30 text-emerald-300 backdrop-blur-md group-hover:border-emerald-500 group-hover:bg-emerald-600 group-hover:text-white"
                            }`}
                        >
                            {Icon && <Icon className="h-6 w-6 transition-transform group-hover:rotate-6" />}
                        </div>

                        <div className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/50 px-3 py-1 text-[11.5px] font-bold text-emerald-200 backdrop-blur-md shadow-sm">
                            {isCleaning ? (
                                <Sparkles className="h-3 w-3 text-emerald-400" />
                            ) : (
                                <ShieldCheck className="h-3 w-3 text-emerald-400" />
                            )}
                            <span>{tag}</span>
                        </div>
                    </div>

                    {/* Category Title with high-contrast text */}
                    <h3 className="mt-5 font-heading text-[22px] font-extrabold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.7)] transition-colors duration-300 group-hover:text-emerald-300 sm:text-[23px]">
                        {category.nameAr}
                    </h3>

                    {/* Description with high contrast and readable line-height */}
                    <p className="mt-2.5 text-[13.5px] font-medium leading-relaxed text-[#D2E6DF] drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)] line-clamp-3">
                        {category.description}
                    </p>
                </div>

                {/* Price and CTA footer */}
                <div className="mt-6 flex items-center justify-between border-t border-white/20 pt-4">
                    <div className="flex flex-col">
                        <span className="text-[11.5px] font-medium text-[#A3C4BA] drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">تبدأ الأسعار من</span>
                        <div className="flex items-baseline gap-1 mt-0.5">
                            <span className="font-heading text-[19px] font-black text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.7)] sm:text-[20px]">
                                {category.priceFrom}
                            </span>
                            <span className="text-xs font-bold text-emerald-400 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
                                {category.priceUnit}
                            </span>
                        </div>
                    </div>

                    <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-4 py-2 text-[12.5px] font-bold text-white shadow-[0_4px_16px_rgba(16,185,129,0.4)] transition-all duration-300 group-hover:bg-emerald-500 group-hover:shadow-[0_6px_22px_rgba(16,185,129,0.55)]">
                        <span>حجز فوري</span>
                        <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-1" />
                    </div>
                </div>
            </div>
        </Link>
    );
}

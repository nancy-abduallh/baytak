"use client";
import Link from "next/link";
import { ServiceCategory } from "@/lib/types";
import { CategoryCard } from "@/components/services/CategoryCard";
import { ArrowLeft, Sparkles } from "lucide-react";

export function ServicesGrid({ categories }: { categories: ServiceCategory[] }) {
    return (
        <section className="relative bg-[#F7F5EE] pt-8 pb-14 sm:pt-10 sm:pb-18 lg:pt-12 lg:pb-20">
            <div className="relative mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-10">
                {/* Section Header */}
                <div className="mb-10 flex flex-col items-start gap-4 sm:mb-12 md:flex-row md:items-end md:justify-between">
                    <div>
                        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3.5 py-1.5 text-[12.5px] font-bold text-emerald-700">
                            <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
                            خدمات الصيانة المعتمدة
                        </div>
                        <h2 className="mt-3 font-heading text-[26px] font-extrabold text-ink sm:text-[32px] md:text-[36px]">
                            كل ما يحتاجه بيتك، بفريق فني معتمد
                        </h2>
                        <p className="mt-2 max-w-[520px] text-[14.5px] leading-relaxed text-[#63756F]">
                            6 باقات أساسية تغطي كافة احتياجات صيانة المنازل والمنشآت بالمملكة، بأسعار واضحة ومحددة قبل تأكيد حجزك.
                        </p>
                    </div>

                    <Link
                        href="/services"
                        className="group inline-flex items-center gap-2 rounded-full border border-teal-800/20 bg-white px-5 py-2.5 text-[13.5px] font-bold text-teal-900 shadow-sm transition-all hover:border-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 hover:shadow-md"
                    >
                        <span>تصفّح جميع الخدمات</span>
                        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                    </Link>
                </div>

                {/* Grid of Service Categories */}
                <div className="grid grid-cols-1 items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
                    {categories.map((cat) => (
                        <div key={cat.id} className="h-full">
                            <CategoryCard category={cat} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

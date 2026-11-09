"use client";
import { BadgeCheck, ShieldCheck, Tag, Headphones } from "lucide-react";

const TRUST_FEATURES = [
    {
        icon: BadgeCheck,
        title: "فنيين موثوقين ومعتمدين",
        desc: "فحص أمني ومهني شامل لكل فني مع اعتماد السجل والشهادات والخبرة الميدانية بالمملكة.",
        iconBg: "bg-emerald-50 text-emerald-600 border-emerald-100",
        badge: "مرخصين نظاميًا",
    },
    {
        icon: ShieldCheck,
        title: "ضمان ذهبي 30 يومًا",
        desc: "ضمان حقيقي يشمل إعادة الصيانة مجانًا بالكامل في حال وجود أي ملاحظة على جودة التنفيذ.",
        iconBg: "bg-amber-50 text-amber-600 border-amber-100",
        badge: "ضمان معتمد",
    },
    {
        icon: Tag,
        title: "أسعار واضحة ومحددة",
        desc: "تسعيرة معلنة مسبقًا بدون أي رسوم خفية أو مفاجآت بعد إتمام أعمال الصيانة المنزلية.",
        iconBg: "bg-sky-50 text-sky-600 border-sky-100",
        badge: "تسعيرة شفافة",
    },
    {
        icon: Headphones,
        title: "خدمة عملاء 24/7",
        desc: "فريق دعم سعودي متخصص على مدار الساعة لمتابعة طلبك وضمان رضاك التام عن الخدمة.",
        iconBg: "bg-teal-50 text-teal-700 border-teal-100",
        badge: "دعم مستمر",
    },
];

export function TrustBar() {
    return (
        <section className="relative bg-[#F7F5EE] py-14 sm:py-18 lg:py-22">
            <div className="mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-10">
                {/* Header */}
                <div className="mb-10 text-center sm:mb-14">
                    <div className="inline-flex items-center gap-2 rounded-full border border-gold-500/20 bg-gold-100/70 px-4 py-1.5 text-[12.5px] font-bold text-gold-500">
                        <span className="h-2 w-2 rounded-full bg-gold-500" />
                        لماذا يفضل العملاء منصة بيتك؟
                    </div>
                    <h2 className="mt-4 font-heading text-[26px] font-extrabold text-ink sm:text-[32px] md:text-[36px]">
                        ثقتك وراحة بالك أولويتنا المطلقة
                    </h2>
                    <p className="mx-auto mt-2.5 max-w-[500px] text-[14.5px] leading-relaxed text-[#63756F]">
                        معايير صارمة وضمانات رسمية نلتزم بها لتقديم خدمة صيانة ترتقي لتطلعاتك وتلبي أعلى المعايير.
                    </p>
                </div>

                {/* Features Cards Grid */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
                    {TRUST_FEATURES.map((item) => {
                        const Icon = item.icon;
                        return (
                            <div
                                key={item.title}
                                className="group relative flex flex-col justify-between rounded-2xl border border-[#E5DFD3] bg-white p-6 shadow-[0_4px_20px_rgba(18,48,46,0.05)] transition-all duration-300 hover:-translate-y-1.5 hover:border-emerald-500/30 hover:shadow-[0_16px_36px_rgba(18,48,46,0.1)] sm:p-7"
                            >
                                <div>
                                    <div className="mb-5 flex items-center justify-between">
                                        <div className={`grid h-12 w-12 place-items-center rounded-xl border ${item.iconBg} shadow-sm transition-transform duration-300 group-hover:scale-110`}>
                                            <Icon className="h-6 w-6" />
                                        </div>
                                        <span className="rounded-full bg-[#F7F5EE] px-2.5 py-1 text-[11px] font-bold text-[#63756F]">
                                            {item.badge}
                                        </span>
                                    </div>

                                    <h3 className="mb-2 font-heading text-[16.5px] font-bold text-ink sm:text-[17.5px]">
                                        {item.title}
                                    </h3>

                                    <p className="text-[13px] leading-relaxed text-[#63756F]">
                                        {item.desc}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

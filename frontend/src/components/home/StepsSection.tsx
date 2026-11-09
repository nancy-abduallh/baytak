"use client";
import { Search, Calendar, UserCheck, CheckCircle2 } from "lucide-react";

const STEPS = [
    {
        num: "١",
        stepNumber: "01",
        title: "اختر الخدمة المطلوبة",
        desc: "حدد نوع العطل أو خدمة الصيانة المناسبة لبيتك من قائمة خدماتنا المتنوعة.",
        icon: Search,
    },
    {
        num: "٢",
        stepNumber: "02",
        title: "حدد الموعد المناسب",
        desc: "اختر اليوم والوقت الأنسب لجدولك اليومي، صباحًا أو مساءً في الوقت اللي يريحك.",
        icon: Calendar,
    },
    {
        num: "٣",
        stepNumber: "03",
        title: "زيارة الفني المعتمد",
        desc: "يوصلك أقرب فني مرخص ومفحوص أمنيًا بأحدث المعدات مع التزام تام بالوقت.",
        icon: UserCheck,
    },
    {
        num: "٤",
        stepNumber: "04",
        title: "استلم الشغل مع الضمان",
        desc: "افحص العمل واستلم فاتورتك الإلكترونية مع ضمان ذهبي 30 يومًا على الخدمة.",
        icon: CheckCircle2,
    },
];

export function StepsSection() {
    return (
        <section id="how-it-works" className="relative bg-[#F7F5EE] py-6 sm:py-10">
            <div className="mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-10">
                <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#071E1B] via-[#0E2F2A] to-[#123B37] px-6 py-12 text-white shadow-[0_24px_60px_-15px_rgba(7,30,27,0.4)] sm:rounded-[36px] sm:px-10 sm:py-16 lg:px-14 lg:py-20">
                    {/* Ambient subtle glow */}
                    <div
                        className="pointer-events-none absolute -top-24 end-0 h-[360px] w-[360px] rounded-full opacity-20 blur-[120px]"
                        style={{ background: "radial-gradient(circle, rgba(76,154,106,0.6) 0%, transparent 70%)" }}
                    />
                    <div
                        className="pointer-events-none absolute -bottom-24 start-0 h-[360px] w-[360px] rounded-full opacity-15 blur-[120px]"
                        style={{ background: "radial-gradient(circle, rgba(191,138,52,0.5) 0%, transparent 70%)" }}
                    />

                    {/* Section Header */}
                    <div className="relative mb-14 text-center">
                        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-500/10 px-4 py-1.5 text-[12.5px] font-bold text-emerald-300">
                            <span className="h-2 w-2 rounded-full bg-emerald-400" />
                            كيف يشتغل بيتك؟
                        </div>
                        <h2 className="mt-4 font-heading text-[26px] font-extrabold text-white sm:text-[32px] md:text-[38px]">
                            من طلب الخدمة لين يكتمل شغلك في{" "}
                            <span className="bg-gradient-to-r from-emerald-400 via-green-300 to-emerald-400 bg-clip-text text-transparent">
                                4 خطوات ميسرة
                            </span>
                        </h2>
                        <p className="mx-auto mt-3 max-w-[520px] text-[14.5px] leading-relaxed text-[#B8D4CB]">
                            تجربة سهلة ومرنة تضمن لك متابعة طلبك من البداية وحتى التسليم بكل شفافية ووضوح.
                        </p>
                    </div>

                    {/* Steps Grid */}
                    <div className="relative grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
                        {/* Connecting line on desktop */}
                        <div className="absolute top-10 end-[12%] start-[12%] hidden h-[2px] bg-gradient-to-r from-emerald-500/10 via-emerald-400/30 to-emerald-500/10 lg:block" />

                        {STEPS.map((step, i) => {
                            const IconComponent = step.icon;
                            return (
                                <div
                                    key={step.stepNumber}
                                    className="group relative flex flex-col items-center text-center"
                                >
                                    {/* Icon & Step Number */}
                                    <div className="relative z-10 mb-5 flex h-20 w-20 items-center justify-center rounded-2xl border border-white/15 bg-white/[0.08] text-emerald-400 shadow-[0_8px_24px_rgba(0,0,0,0.3)] backdrop-blur-md transition-all duration-300 group-hover:scale-105 group-hover:border-emerald-400/40 group-hover:bg-emerald-500/15">
                                        <IconComponent className="h-8 w-8 text-emerald-400" />
                                        <span className="absolute -top-2.5 -end-2.5 grid h-7 w-7 place-items-center rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 font-heading text-[12px] font-black text-teal-950 shadow-md">
                                            {step.num}
                                        </span>
                                    </div>

                                    {/* Step Title */}
                                    <h3 className="mb-2 font-heading text-[17px] font-bold text-white sm:text-[18px]">
                                        {step.title}
                                    </h3>

                                    {/* Step Description */}
                                    <p className="max-w-[260px] text-[13.5px] leading-relaxed text-[#B8D4CB]">
                                        {step.desc}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}

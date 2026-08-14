const STEPS = [
    { num: "١", title: "اختر الخدمة", desc: "حدد نوع العطل أو الصيانة من قائمة الخدمات المتاحة." },
    { num: "٢", title: "حدد الموعد", desc: "اختر التاريخ والوقت الأنسب لك، صباحًا أو مساءً." },
    { num: "٣", title: "يصلك فني معتمد", desc: "نرسل لك أقرب فني متاح بالتقييم والسعر المناسبين." },
    { num: "٤", title: "تقييم وإنجاز", desc: "أكد جودة العمل وقيّم تجربتك لمساعدة غيرك." },
];

export function StepsSection() {
    return (
        <div id="how-it-works" className="mx-auto max-w-[1360px] px-4 sm:px-6 md:px-10">
            <div className="relative overflow-hidden rounded-[24px] bg-teal-900 px-5 py-10 sm:rounded-[28px] sm:px-8 sm:py-12 md:rounded-[32px] md:px-14 md:py-16">
                <div className="mb-11">
                    <div className="text-[13.5px] font-bold text-green-500">آلية العمل</div>
                    <h2 className="mt-2.5 font-heading text-[27px] font-extrabold leading-tight text-white sm:text-[30px] md:text-[32px]">من الطلب إلى الإنجاز في ٤ خطوات</h2>
                    <p className="mt-2 max-w-[440px] text-[15px] text-[#AFC9C0]">تسلسل واضح يمنحك رؤية كاملة لحالة طلبك من اللحظة الأولى.</p>
                </div>

                <div className="relative grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4 md:gap-0">
                    <div className="absolute end-[12%] start-[12%] top-[27px] hidden h-px bg-[repeating-linear-gradient(90deg,rgba(255,255,255,.3)_0_8px,transparent_8px_16px)] md:block" />
                    {STEPS.map((step, i) => (
                        <div key={step.num} className="relative px-0 sm:px-4">
                            {/* mobile-only dashed connector: runs from the bottom of this circle
                                through the row gap to the top of the next circle */}
                            {i < STEPS.length - 1 && (
                                <div className="absolute start-[26px] top-[54px] bottom-[-2rem] w-px bg-[repeating-linear-gradient(180deg,rgba(255,255,255,.35)_0_8px,transparent_8px_16px)] sm:hidden" />
                            )}

                            <div className="flex items-start gap-4 sm:block">
                                <div className="relative z-10 grid h-[54px] w-[54px] flex-none place-items-center rounded-full bg-green-500 font-heading text-lg font-extrabold text-white shadow-[0_0_0_8px_#123B37] sm:mb-6">
                                    {step.num}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h4 className="flex h-[54px] items-center text-[16.5px] font-bold text-white sm:mb-2 sm:h-auto sm:block">
                                        {step.title}
                                    </h4>
                                    <p className="mt-1 text-[13.5px] leading-[1.75] text-[#AFC9C0] sm:mt-0">{step.desc}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
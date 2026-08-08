import clsx from "clsx";
import { ArrowLeft, Droplet, Zap, Snowflake, Hammer, PaintRoller, Sparkles, Home as HomeIcon } from "lucide-react";
import { Button } from "@/components/ui/Button";

const HUB_RADIUS = 190;

const HUB_NODES = [
    { icon: Droplet, label: "سباكة", angle: -90 },
    { icon: Zap, label: "كهرباء", angle: -30 },
    { icon: Snowflake, label: "تكييف", angle: 30 },
    { icon: Hammer, label: "نجارة", angle: 90 },
    { icon: PaintRoller, label: "دهانات", angle: 150 },
    { icon: Sparkles, label: "تنظيف", angle: 210 },
];

export function Hero() {
    return (
        <section
            className="relative overflow-hidden px-5 pt-[54px] lg:px-10 lg:pt-[76px]"
            style={{
                background:
                    "linear-gradient(180deg, var(--color-teal-900) 0%, var(--color-teal-800) 62%, var(--color-sand-50) 62%)",
            }}
        >
            <div className="mx-auto grid max-w-[1360px] grid-cols-1 items-center gap-10 lg:grid-cols-[1.05fr_.95fr]">
                <div>
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[.08] px-4 py-1.5 text-[12.5px] font-semibold text-gold-100 lg:text-[13px]">
                        <span className="h-1.5 w-1.5 rounded-full bg-green-500" /> فنيون معتمدون في أقل من ٦٠ دقيقة
                    </span>

                    <h1 className="my-5 max-w-[620px] font-heading text-[30px] font-extrabold leading-[1.28] text-white sm:text-[36px] lg:text-[47px]">
                        كل خدمات صيانة <span className="text-green-500">منزلك</span><br />في مكان واحد وبثقة
                    </h1>

                    <p className="mb-8 max-w-[520px] text-[14.5px] leading-[1.85] text-[#CFE1DA] lg:text-[17px]">
                        من إصلاح تسريب مفاجئ إلى تجديد كامل — اختر الخدمة، حدد الموعد، وفني معتمد يصلك في الوقت المحدد.
                        بلا وسطاء، وبلا مفاجآت في السعر.
                    </p>

                    <div className="mb-11 flex flex-wrap gap-3.5">
                        <Button href="/services/electrical" variant="primary">
                            اطلب خدمة الآن <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <Button href="#how-it-works" variant="outline">شاهد كيف يعمل التطبيق</Button>
                    </div>

                    <div className="flex w-full flex-nowrap justify-end text-right lg:justify-start lg:text-left">
                        <Stat
                            value="2,400"
                            symbol="+"
                            symbolPosition="before"
                            label="فني معتمد بالمملكة"
                        />
                        <Stat
                            value="4.9"
                            symbol="★"
                            symbolPosition="after"
                            label="تقييم متوسط للخدمة"
                        />
                        <Stat
                            value="24/7"
                            label="دعم فني وطلبات طارئة"
                            last
                        />
                    </div>
                </div>

                <ServiceHub />
            </div>
        </section>
    );
}

function Stat({
    value,
    symbol,
    symbolPosition = "after",
    label,
    last,
}: {
    value: string;
    symbol?: string;
    symbolPosition?: "before" | "after";
    label: string;
    last?: boolean;
}) {
    return (
        <div
            className={clsx(
                "ms-4 ps-4 border-s border-white/20",
                "lg:ms-8 lg:ps-8 lg:border-ink/10",
                last && "ms-0 border-none ps-0"
            )}
        >
            <div className="flex items-baseline gap-0.5 font-heading text-xl font-extrabold text-white lg:text-ink lg:text-2xl">
                {symbol && symbolPosition === "before" && (
                    <span className="text-gold-500">{symbol}</span>
                )}

                <span>{value}</span>

                {symbol && symbolPosition === "after" && (
                    <span className="text-gold-500">{symbol}</span>
                )}
            </div>

            <div className="mt-1 text-[11px] font-medium leading-tight text-white/80 lg:text-[12.5px] lg:text-[#63756F]">
                {label}
            </div>
        </div>
    );
}

function ServiceHub() {
    return (
        <div
            className="
                relative z-10 mx-auto flex
                h-[360px] w-full max-w-[360px]
                items-center justify-center
                sm:h-[420px] sm:w-[420px]
                lg:h-[520px] lg:w-full lg:max-w-none
            "
        >
            <div className="absolute h-[300px] w-[300px] scale-[.84] rounded-full border border-dashed border-white/15 sm:scale-100 lg:h-[430px] lg:w-[430px]" />

            <div className="absolute h-[220px] w-[220px] scale-[.84] rounded-full border border-dashed border-white/15 sm:scale-100 lg:h-[320px] lg:w-[320px]" />

            <div className="relative z-10 grid h-[92px] w-[92px] scale-[.84] place-items-center rounded-full bg-[radial-gradient(circle_at_35%_30%,#6BB889,#4C9A6A_60%,#1E6B5C_100%)] shadow-[0_20px_50px_rgba(0,0,0,.35)] sm:scale-100 lg:h-[132px] lg:w-[132px]">
                <HomeIcon className="h-8 w-8 text-white lg:h-11 lg:w-11" />
            </div>

            <div className="absolute inset-0 scale-[.7] sm:scale-[.82] lg:scale-100">
                {HUB_NODES.map(({ icon: Icon, label, angle }) => {
                    const rad = (angle * Math.PI) / 180;
                    const x = Math.cos(rad) * HUB_RADIUS;
                    const y = Math.sin(rad) * HUB_RADIUS;

                    return (
                        <div
                            key={label}
                            className="absolute z-10 flex h-[88px] w-[88px] flex-col items-center justify-center gap-1.5 rounded-lg bg-white shadow-lift"
                            style={{
                                left: `calc(50% + ${x}px)`,
                                top: `calc(50% + ${y}px)`,
                                transform: "translate(-50%, -50%)",
                            }}
                        >
                            <Icon className="h-6 w-6 text-teal-700" />
                            <span className="text-[11px] font-bold text-ink">
                                {label}
                            </span>
                        </div>
                    );
                })}
            </div>

            <div className="absolute end-0 top-4 z-10 flex scale-90 items-center gap-2.5 rounded-2xl bg-white px-4 py-3 text-[12.5px] font-bold shadow-lift sm:scale-100 lg:start-auto lg:end-1.5 lg:top-6">
                <span className="h-2 w-2 rounded-full bg-green-500" />
                فني في الطريق إليك
            </div>

            <div className="absolute end-0 bottom-6 z-10 scale-90 rounded-2xl bg-white px-4 py-3 text-[12.5px] font-bold shadow-lift sm:scale-100 lg:start-auto lg:end-0 lg:bottom-9">
                ✓ تم تأكيد الحجز · #1010
            </div>
        </div>
    );
}
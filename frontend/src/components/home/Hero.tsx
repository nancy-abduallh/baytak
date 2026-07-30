import clsx from "clsx";
import { ArrowLeft, Droplet, Zap, Snowflake, Hammer, PaintRoller, Sparkles, Home as HomeIcon } from "lucide-react";
import { Button } from "@/components/ui/Button";

const HUB_RADIUS = 190; // px — distance of each node's center from the hub center

const HUB_NODES = [
    { icon: Droplet, label: "سباكة", angle: -90 },   // top
    { icon: Zap, label: "كهرباء", angle: -30 },       // upper-right
    { icon: Snowflake, label: "تكييف", angle: 30 },    // lower-right
    { icon: Hammer, label: "نجارة", angle: 90 },       // bottom
    { icon: PaintRoller, label: "دهانات", angle: 150 }, // lower-left
    { icon: Sparkles, label: "تنظيف", angle: 210 },     // upper-left
];

export function Hero() {
    return (
        <section
            className="relative overflow-hidden px-10 pt-[76px]"
            style={{
                background:
                    "linear-gradient(180deg, var(--color-teal-900) 0%, var(--color-teal-800) 62%, var(--color-sand-50) 62%)",
            }}
        >
            <div className="mx-auto grid max-w-[1360px] grid-cols-[1.05fr_.95fr] items-center gap-10">
                <div>
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[.08] px-4 py-1.5 text-[13px] font-semibold text-gold-100">
                        <span className="h-1.5 w-1.5 rounded-full bg-green-500" /> فنيون معتمدون في أقل من ٦٠ دقيقة
                    </span>

                    <h1 className="my-5 max-w-[620px] font-heading text-[47px] font-extrabold leading-[1.28] text-white">
                        كل خدمات صيانة <span className="text-green-500">منزلك</span><br />في مكان واحد وبثقة
                    </h1>

                    <p className="mb-8 max-w-[520px] text-[17px] leading-[1.85] text-[#CFE1DA]">
                        من إصلاح تسريب مفاجئ إلى تجديد كامل — اختر الخدمة، حدد الموعد، وفني معتمد يصلك في الوقت المحدد.
                        بلا وسطاء، وبلا مفاجآت في السعر.
                    </p>

                    <div className="mb-11 flex gap-3.5">
                        <Button href="/services/electrical" variant="primary">
                            اطلب خدمة الآن <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <Button href="#how-it-works" variant="outline">شاهد كيف يعمل التطبيق</Button>
                    </div>

                    <div className="flex">
                        <Stat value="2,400" symbol="+" symbolPosition="before" label="فني معتمد بالمملكة" />
                        <Stat value="4.9" symbol="★" symbolPosition="after" label="تقييم متوسط للخدمة" />
                        <Stat value="24/7" label="دعم فني وطلبات طارئة" last />
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
        <div className={clsx("ms-8 ps-8 border-s border-ink/10", last && "ms-0 border-none ps-0")}>
            <div className="flex items-baseline gap-0.5 font-heading text-2xl font-extrabold text-ink">
                {symbol && symbolPosition === "before" && <span className="text-gold-500">{symbol}</span>}
                <span>{value}</span>
                {symbol && symbolPosition === "after" && <span className="text-gold-500">{symbol}</span>}
            </div>
            <div className="mt-1 text-[12.5px] font-medium text-[#63756F]">{label}</div>
        </div>
    );
}

function ServiceHub() {
    return (
        <div className="relative flex h-[520px] items-center justify-center">
            <div className="absolute h-[430px] w-[430px] rounded-full border border-dashed border-white/15" />
            <div className="absolute h-[320px] w-[320px] rounded-full border border-dashed border-white/15" />

            <div className="relative z-10 grid h-[132px] w-[132px] place-items-center rounded-full bg-[radial-gradient(circle_at_35%_30%,#6BB889,#4C9A6A_60%,#1E6B5C_100%)] shadow-[0_20px_50px_rgba(0,0,0,.35)]">
                <HomeIcon className="h-11 w-11 text-white" />
            </div>

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
                        <span className="text-[11px] font-bold text-ink">{label}</span>
                    </div>
                );
            })}

            <div className="absolute end-1.5 top-6 z-10 flex items-center gap-2.5 rounded-2xl bg-white px-4 py-3 text-[12.5px] font-bold shadow-lift">
                <span className="h-2 w-2 rounded-full bg-green-500" /> فني في الطريق إليك
            </div>
            <div className="absolute bottom-9 end-0 z-10 rounded-2xl bg-white px-4 py-3 text-[12.5px] font-bold shadow-lift">
                ✓ تم تأكيد الحجز · #1010
            </div>
        </div>
    );
}
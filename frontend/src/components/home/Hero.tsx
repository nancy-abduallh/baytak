"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import {
    ArrowLeft,
    ChevronLeft,
    ChevronRight,
    Droplet,
    Zap,
    Snowflake,
    PaintRoller,
    Sparkles,
    BadgeCheck,
    ShieldCheck,
    Clock,
    Flame,
    Play,
    Pause,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

interface SlideItem {
    id: string;
    title: string;
    subtitle: string;
    category: string;
    href: string;
    badge: string;
    price: string;
    image: string;
    icon: typeof Snowflake;
    accentColor: string;
}

const SLIDES: SlideItem[] = [
    {
        id: "ac",
        title: "صيانة وغسيل المكيفات",
        subtitle: "غسيل بالضغط العالي، تعبئة فريون أصلي، فك وتركيب بأعلى كفاءة لراحة بيتك",
        category: "تكييف",
        href: "/services/ac",
        badge: "الأكثر طلبًا في الصيف",
        price: "تبدأ من 120 ر.س",
        image: "/images/hero/ac_v2.jpg",
        icon: Snowflake,
        accentColor: "#38BDF8",
    },
    {
        id: "electrical",
        title: "تمديدات وفحص الكهرباء",
        subtitle: "إصلاح أعطال الالتماس المفاجئ، تركيب الإنارة والأفياش والقواطع بأمان تام",
        category: "كهرباء",
        href: "/services/electrical",
        badge: "فحص أمان متكامل للسلامة",
        price: "تبدأ من 100 ر.س",
        image: "/images/hero/electrical_v2.jpg",
        icon: Zap,
        accentColor: "#FBBF24",
    },
    {
        id: "plumbing",
        title: "كشف التسريبات والسباكة",
        subtitle: "أجهزة كشف إلكترونية دقيقة بدون تكسير، تسليك انسدادات، وصيانة السخانات",
        category: "الصيانة",
        href: "/services/plumbing",
        badge: "كشف دقيق بدون تكسير",
        price: "تبدأ من 80 ر.س",
        image: "/images/hero/plumbing_v2.jpg",
        icon: Droplet,
        accentColor: "#34D399",
    },
    {
        id: "painting",
        title: "الدهانات والتشطيبات الحديثة",
        subtitle: "دهانات داخلية وخارجية بأجود الخامات، بديل خشب ورخام، تشطيب احترافي وسريع",
        category: "دهانات",
        href: "/services/painting",
        badge: "ضمان على جودة الألوان",
        price: "تبدأ من 1.2 ر.س/م²",
        image: "/images/hero/painting_v2.jpg",
        icon: PaintRoller,
        accentColor: "#A78BFA",
    },
    {
        id: "cleaning",
        title: "تنظيف الفلل والمنازل الشامل",
        subtitle: "تنظيف عميق بعد التشطيب، غسيل مجالس وكنب وسجاد وخزانات مياه بالبخار",
        category: "تنظيف",
        href: "/services/cleaning",
        badge: "معدات تعقيم متطورة",
        price: "تبدأ من 150 ر.س",
        image: "/images/hero/cleaning_v2.jpg",
        icon: Sparkles,
        accentColor: "#2DD4BF",
    },
];

const QUICK_LINKS = [
    { label: "صيانة مكيفات", href: "/services/ac" },
    { label: "كشف تسريبات", href: "/services/plumbing" },
    { label: "أعطال كهرباء", href: "/services/electrical" },
    { label: "نظافة فلل", href: "/services/cleaning" },
];

const SLIDE_DURATION = 5000;

export function Hero() {
    return (
        <section className="relative overflow-hidden bg-gradient-to-b from-[#071E1B] via-[#0D2B27] to-[#123B37] px-4 pt-2 pb-6 text-white sm:px-6 sm:pt-4 sm:pb-8 lg:px-10 lg:pt-5 lg:pb-10">
            {/* Ambient luxury lighting accents */}
            <div
                className="pointer-events-none absolute -top-32 end-0 h-[500px] w-[500px] rounded-full opacity-25 blur-[130px] animate-pulse-glow"
                style={{ background: "radial-gradient(circle, rgba(76,154,106,0.6) 0%, transparent 70%)" }}
            />
            <div
                className="pointer-events-none absolute top-1/2 start-0 h-[400px] w-[400px] -translate-y-1/2 rounded-full opacity-15 blur-[140px]"
                style={{ background: "radial-gradient(circle, rgba(191,138,52,0.5) 0%, transparent 70%)" }}
            />
            <div
                className="pointer-events-none absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: `radial-gradient(rgba(255,255,255,0.5) 1px, transparent 1px)`,
                    backgroundSize: "28px 28px",
                }}
            />

            <div className="relative mx-auto grid max-w-[1360px] grid-cols-1 items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
                {/* Right Column: Text Information */}
                <div className="z-10">
                    <div className="inline-flex items-center gap-2.5 rounded-full border border-emerald-400/25 bg-white/[0.08] px-4 py-2 text-[12.5px] font-semibold text-emerald-300 backdrop-blur-md">
                        <span className="relative flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                        </span>
                        فنيين معتمدين ومرخصين خلال أقل من 60 دقيقة
                    </div>

                    <h1 className="mt-5 mb-4 font-heading text-[30px] font-extrabold leading-[1.3] text-white sm:text-[40px] lg:text-[48px]">
                        كل خدمات صيانة{" "}
                        <span className="bg-gradient-to-r from-emerald-400 via-green-300 to-emerald-400 bg-clip-text text-transparent">
                            بيتك
                        </span>
                        <br />
                        في منصة واحدة وبثقة تامة
                    </h1>

                    <p className="mb-6 max-w-[540px] text-[15px] leading-[1.9] text-[#B8D4CB] sm:text-[16px]">
                        من تصليح أي عطل طارئ إلى الصيانة الدورية الشاملة — اختر الخدمة، وحدد موعدك، وفني معتمد يجيك لين باب بيتك في الوقت المحدد. بدون وسطاء، وبأسعار واضحة ومضمونة.
                    </p>

                    {/* Quick service selector pills */}
                    <div className="mb-7 flex flex-wrap items-center gap-2">
                        <span className="flex items-center gap-1 text-[12px] font-semibold text-emerald-300/85">
                            <Flame className="h-3.5 w-3.5 text-gold-500" /> الأكثر طلبًا:
                        </span>
                        {QUICK_LINKS.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="rounded-full border border-white/10 bg-white/[0.06] px-3.5 py-1 text-[12px] font-medium text-white/90 backdrop-blur-sm transition-all hover:border-emerald-400/40 hover:bg-emerald-500/15 hover:text-white"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* CTA Actions */}
                    <div className="mb-10 flex flex-wrap items-center gap-3.5">
                        <Button
                            href="/services"
                            variant="primary"
                            className="group shadow-[0_12px_28px_-6px_rgba(76,154,106,0.5)] transition-all hover:scale-[1.02]"
                        >
                            احجز خدمتك الحين{" "}
                            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                        </Button>
                        <Button
                            href="#how-it-works"
                            variant="outline"
                            className="border-white/20 bg-white/[0.05] text-white backdrop-blur-md hover:bg-white/[0.12]"
                        >
                            تعرّف على آلية العمل
                        </Button>
                    </div>

                    {/* Trust Metrics Bar */}
                    <div className="grid grid-cols-3 gap-3 border-t border-white/10 pt-7 sm:gap-6">
                        <StatItem value="+2,400" label="فني معتمد في أنحاء المملكة" />
                        <StatItem value="4.9" symbol="★" label="متوسط تقييم العملاء" />
                        <StatItem value="24/7" label="خدمة عملاء على مدار الساعة" last />
                    </div>
                </div>

                {/* Left Column: Image Slider Showcase */}
                <div className="relative z-10 w-full pt-0 pb-0 sm:pt-1 sm:pb-1">
                    <HeroSlider slides={SLIDES} />
                </div>
            </div>
        </section>
    );
}

function StatItem({
    value,
    symbol,
    label,
    last = false,
}: {
    value: string;
    symbol?: string;
    label: string;
    last?: boolean;
}) {
    return (
        <div className={clsx("pe-2 sm:pe-4", !last && "border-e border-white/10")}>
            <div className="flex items-center gap-1 font-heading text-xl font-extrabold text-white sm:text-2xl">
                <span>{value}</span>
                {symbol && <span className="text-gold-500">{symbol}</span>}
            </div>
            <p className="mt-1 text-[11px] font-medium leading-relaxed text-[#8AADA0] sm:text-[12px]">
                {label}
            </p>
        </div>
    );
}

function HeroSlider({ slides }: { slides: SlideItem[] }) {
    const [idx, setIdx] = useState(0);
    const [paused, setPaused] = useState(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const slide = slides[idx];

    const goTo = useCallback(
        (i: number) => {
            setIdx(i);
        },
        []
    );

    useEffect(() => {
        if (paused) return;
        timerRef.current = setInterval(() => {
            setIdx((prev) => (prev + 1) % slides.length);
        }, SLIDE_DURATION);

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [paused, slides.length]);

    const prevSlide = () => goTo((idx - 1 + slides.length) % slides.length);
    const nextSlide = () => goTo((idx + 1) % slides.length);

    return (
        <div
            className="group/slider relative mx-auto max-w-[560px] lg:max-w-none"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
        >
            {/* Top Status Badge: Technician on the way (Completely above slider card) */}
            <div className="mb-3.5 flex justify-start">
                <div className="inline-flex items-center gap-2.5 rounded-2xl border border-white/20 bg-[#071E1B]/95 px-4 py-2.5 shadow-[0_16px_36px_rgba(0,0,0,0.5)] backdrop-blur-xl animate-float">
                    <div className="grid h-9 w-9 flex-none place-items-center rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-teal-950 shadow-[0_4px_12px_rgba(52,211,153,0.35)]">
                        <BadgeCheck className="h-4.5 w-4.5" />
                    </div>
                    <div>
                        <div className="flex items-center gap-1.5">
                            <span className="relative flex h-2 w-2">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                            </span>
                            <span className="text-[12px] font-bold text-white">الفني في طريقه لك</span>
                        </div>
                        <div className="flex items-center gap-1 text-[10.5px] text-[#8AADA0]">
                            <Clock className="h-3 w-3 text-gold-500" /> يصلك خلال 20 دقيقة
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Slider Card with Ambient Glow */}
            <div className="relative">
                {/* Ambient Slider Glow */}
                <div
                    className="pointer-events-none absolute -inset-2 rounded-[34px] opacity-25 blur-2xl transition-colors duration-700"
                    style={{ backgroundColor: slide.accentColor }}
                />

                {/* Main Slider Card */}
                <div className="relative overflow-hidden rounded-[26px] border border-white/20 bg-[#071E1B]/80 shadow-[0_30px_70px_-15px_rgba(0,0,0,0.65)] backdrop-blur-xl sm:rounded-[32px]">
                {/* Image Container */}
                <div className="relative h-[340px] w-full sm:h-[400px] lg:h-[430px]">
                    {slides.map((s, i) => {
                        const isActive = i === idx;
                        return (
                            <div
                                key={s.id}
                                className={clsx(
                                    "absolute inset-0 transition-all duration-700 ease-out",
                                    isActive
                                        ? "scale-100 opacity-100"
                                        : "scale-105 opacity-0 pointer-events-none"
                                )}
                            >
                                <Image
                                    src={s.image}
                                    alt={s.title}
                                    fill
                                    sizes="(max-width: 768px) 100vw, 560px"
                                    className="object-cover object-center brightness-[0.88] contrast-[1.05]"
                                    priority={i === 0}
                                />
                                {/* Contrast gradients */}
                                <div className="absolute inset-0 bg-gradient-to-t from-[#071E1B] via-[#071E1B]/45 to-transparent" />
                                <div className="absolute inset-0 bg-gradient-to-r from-[#071E1B]/35 via-transparent to-transparent" />
                            </div>
                        );
                    })}

                    {/* Navigation Controls (Top End) */}
                    <div className="absolute top-4 end-4 z-20 flex items-center gap-1.5">
                        <button
                            onClick={prevSlide}
                            aria-label="الخدمة السابقة"
                            className="grid h-8 w-8 place-items-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur-md transition-all hover:scale-105 hover:bg-black/60"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </button>
                        <button
                            onClick={nextSlide}
                            aria-label="الخدمة التالية"
                            className="grid h-8 w-8 place-items-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur-md transition-all hover:scale-105 hover:bg-black/60"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </button>
                        <button
                            onClick={() => setPaused((p) => !p)}
                            aria-label={paused ? "تشغيل تلقائي" : "إيقاف مؤقت"}
                            className="grid h-8 w-8 place-items-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur-md transition-all hover:scale-105 hover:bg-black/60"
                        >
                            {paused ? <Play className="h-3 w-3" /> : <Pause className="h-3 w-3" />}
                        </button>
                        <span className="ms-1 rounded-full border border-white/15 bg-black/40 px-2.5 py-1 text-[11px] font-bold text-white/80 tabular-nums backdrop-blur-md">
                            {idx + 1} / {slides.length}
                        </span>
                    </div>

                    {/* Slide Information Overlay (Bottom) */}
                    <div className="absolute inset-x-0 bottom-0 z-20 p-5 sm:p-7">
                        <div className="mb-2 flex flex-wrap items-center gap-2">
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-500/20 px-3 py-1 text-[11px] font-bold text-emerald-300 backdrop-blur-md">
                                <slide.icon className="h-3.5 w-3.5" />
                                {slide.category}
                            </span>
                            <span className="rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold text-white/90 backdrop-blur-md">
                                {slide.badge}
                            </span>
                        </div>

                        <h3 className="font-heading text-xl font-black text-white sm:text-2xl">
                            {slide.title}
                        </h3>

                        <p className="mt-1 line-clamp-1 text-[12.5px] leading-relaxed text-[#CFE1DA] sm:text-[13.5px]">
                            {slide.subtitle}
                        </p>

                        <div className="mt-4 flex items-center justify-between border-t border-white/15 pt-3.5">
                            <div>
                                <span className="block text-[10.5px] font-medium text-white/70">سعر الخدمة التقديري</span>
                                <span className="font-heading text-sm font-extrabold text-gold-400 sm:text-base">
                                    {slide.price}
                                </span>
                            </div>

                            <Link
                                href={slide.href}
                                className="group/btn inline-flex items-center gap-1.5 rounded-full bg-emerald-500 px-4 py-2 text-[12px] font-bold text-teal-950 transition-all hover:bg-emerald-400 hover:shadow-[0_8px_20px_-4px_rgba(52,211,153,0.6)]"
                            >
                                اطلب الآن
                                <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover/btn:-translate-x-1" />
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Bottom Category Selector Bar */}
                <div className="border-t border-white/10 bg-[#051614]/90 px-3 py-2.5 backdrop-blur-xl sm:px-5">
                    <div className="grid grid-cols-5 gap-1 sm:gap-2">
                        {slides.map((s, i) => {
                            const isCurrent = i === idx;
                            return (
                                <button
                                    key={s.id}
                                    onClick={() => goTo(i)}
                                    className={clsx(
                                        "group/tab flex flex-col items-center gap-1 rounded-xl py-2 px-1 text-center transition-all",
                                        isCurrent
                                            ? "bg-white/15 text-white shadow-sm"
                                            : "text-white/50 hover:bg-white/5 hover:text-white/80"
                                    )}
                                >
                                    <div className="h-1 w-full overflow-hidden rounded-full bg-white/10">
                                        <div
                                            className={clsx(
                                                "h-full rounded-full transition-all duration-300",
                                                isCurrent ? "w-full bg-emerald-400" : "w-0"
                                            )}
                                        />
                                    </div>
                                    <span className="mt-0.5 text-[10.5px] font-bold sm:text-[11.5px]">
                                        {s.category}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>

            {/* Bottom Status Badge: Golden Warranty (Completely below slider card) */}
            <div className="mt-3.5 flex justify-end">
                <div className="inline-flex items-center gap-2.5 rounded-2xl border border-white/20 bg-[#071E1B]/95 px-4 py-2.5 shadow-[0_16px_36px_rgba(0,0,0,0.5)] backdrop-blur-xl animate-float-slow">
                    <div className="grid h-9 w-9 flex-none place-items-center rounded-xl bg-gradient-to-br from-gold-500 to-amber-600 text-white shadow-[0_4px_12px_rgba(191,138,52,0.35)]">
                        <ShieldCheck className="h-4.5 w-4.5" />
                    </div>
                    <div className="leading-tight">
                        <div className="flex items-center gap-1.5 text-[12px] font-bold text-white">
                            <span>ضمان ذهبي 30 يومًا</span>
                            <span className="rounded bg-gold-500/25 px-1 py-0.5 text-[9px] font-bold text-gold-400">معتمد</span>
                        </div>
                        <p className="text-[10.5px] text-[#8AADA0]">إعادة صيانة مجانية عند أي ملاحظة</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

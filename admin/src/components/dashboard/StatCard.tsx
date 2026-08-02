import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import clsx from "clsx";

type Tone = "teal" | "gold" | "green" | "danger" | "blue" | "purple";

const TONE: Record<Tone, { grad: string; glow: string }> = {
    teal: { grad: "linear-gradient(135deg,#1E6B5C,#2F8F79)", glow: "rgba(30,107,92,.38)" },
    gold: { grad: "linear-gradient(135deg,#BF8A34,#E4B15C)", glow: "rgba(191,138,52,.38)" },
    green: { grad: "linear-gradient(135deg,#4C9A6A,#6BC28A)", glow: "rgba(76,154,106,.38)" },
    danger: { grad: "linear-gradient(135deg,#B24B3C,#D97060)", glow: "rgba(178,75,60,.38)" },
    blue: { grad: "linear-gradient(135deg,#2F6FED,#5B8DF7)", glow: "rgba(47,111,237,.34)" },
    purple: { grad: "linear-gradient(135deg,#8B5CF6,#A78BFA)", glow: "rgba(139,92,246,.34)" },
};

export function StatCard({
    icon: Icon, label, value, tone = "teal", trend,
}: {
    icon: LucideIcon;
    label: string;
    value: string | number;
    tone?: Tone;
    trend?: { value: number };
}) {
    const t = TONE[tone];
    const positive = (trend?.value ?? 0) >= 0;

    return (
        <div
            className="card-elevated card-accent-top group relative p-5"
            style={{ ["--accent-gradient" as any]: t.grad }}
        >
            <div
                className="pointer-events-none absolute -left-6 -top-6 h-28 w-28 rounded-full opacity-[.07] blur-2xl transition-opacity duration-300 group-hover:opacity-[.16]"
                style={{ background: t.grad }}
            />

            <div className="relative flex items-start justify-between">
                <div
                    className="icon-badge-glow grid h-12 w-12 place-items-center rounded-2xl text-white"
                    style={{ background: t.grad, ["--glow-color" as any]: t.glow }}
                >
                    <Icon className="h-[22px] w-[22px]" />
                </div>

                {trend && (
                    <span
                        className={clsx(
                            "flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold",
                            positive ? "bg-green-100 text-green-600" : "bg-danger/10 text-danger",
                        )}
                    >
                        {positive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                        {Math.abs(trend.value)}%
                    </span>
                )}
            </div>

            <div className="relative mt-4 font-heading text-[26px] font-extrabold leading-none text-ink">
                {value}
            </div>
            <div className="relative mt-2 text-[12.5px] font-medium text-[#63756F]">{label}</div>
        </div>
    );
}
type PillTone = "teal900" | "teal700" | "green500" | "gold500" | "sand100" | "blue500" | "purple500";

const TONE: Record<PillTone, { bg: string; text: string }> = {
    teal900: { bg: "linear-gradient(135deg,#0F332F,#175249)", text: "#FFFFFF" },
    teal700: { bg: "linear-gradient(135deg,#175249,#2F8F79)", text: "#FFFFFF" },
    green500: { bg: "linear-gradient(135deg,#3E8961,#6BC28A)", text: "#FFFFFF" },
    gold500: { bg: "linear-gradient(135deg,#BF8A34,#D9A757)", text: "#FFFFFF" },
    sand100: { bg: "linear-gradient(135deg,#E7DEC4,#EFEAE0)", text: "#3E4B45" },
    blue500: { bg: "linear-gradient(135deg,#2757C4,#4C86F0)", text: "#FFFFFF" },
    purple500: { bg: "linear-gradient(135deg,#6D3FD1,#9B7CF3)", text: "#FFFFFF" },
};

export function MetricPill({
    label,
    value,
    tone = "teal700",
}: {
    label: string;
    value: string | number;
    tone?: PillTone;
}) {
    const t = TONE[tone];

    return (
        <div className="flex min-w-fit flex-1 flex-col items-center gap-3 text-center">
            <span className="whitespace-nowrap text-[12.5px] font-extrabold text-ink">{label}</span>
            <div
                className="flex h-[56px] w-full max-w-[190px] items-center justify-center rounded-full px-5 shadow-[0_12px_24px_-8px_rgba(18,48,46,.35)] transition-transform duration-200 hover:-translate-y-0.5"
                style={{ background: t.bg, color: t.text }}
            >
                <span className="whitespace-nowrap font-heading text-[17px] font-extrabold leading-none">{value}</span>
            </div>
        </div>
    );
}
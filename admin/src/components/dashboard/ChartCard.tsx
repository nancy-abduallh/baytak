import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";

type Tone = "teal" | "gold" | "green" | "blue" | "purple";

const GRAD: Record<Tone, string> = {
    teal: "linear-gradient(90deg,#1E6B5C,#4C9A6A)",
    gold: "linear-gradient(90deg,#BF8A34,#E4B15C)",
    green: "linear-gradient(90deg,#4C9A6A,#6BC28A)",
    blue: "linear-gradient(90deg,#2F6FED,#5B8DF7)",
    purple: "linear-gradient(90deg,#8B5CF6,#A78BFA)",
};

export function ChartCard({
    title, description, action, children, className = "", icon: Icon, tone = "teal",
}: {
    title: string;
    description?: string;
    action?: ReactNode;
    children: ReactNode;
    className?: string;
    icon?: LucideIcon;
    tone?: Tone;
}) {
    const grad = GRAD[tone];

    return (
        <div className={`card-elevated card-accent-top p-6 ${className}`} style={{ ["--accent-gradient" as any]: grad }}>
            <div className="mb-5 flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                    {Icon && (
                        <span
                            className="mt-0.5 grid h-9 w-9 flex-none place-items-center rounded-xl text-white"
                            style={{ background: grad }}
                        >
                            <Icon className="h-4 w-4" />
                        </span>
                    )}
                    <div>
                        <h3 className="font-heading text-[15px] font-extrabold text-ink">{title}</h3>
                        {description && <p className="mt-0.5 text-[12.5px] text-[#63756F]">{description}</p>}
                    </div>
                </div>
                {action}
            </div>
            {children}
        </div>
    );
}
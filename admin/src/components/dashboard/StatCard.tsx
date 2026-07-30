import { LucideIcon } from "lucide-react";
import clsx from "clsx";

export function StatCard({
    icon: Icon, label, value, tone = "teal",
}: {
    icon: LucideIcon;
    label: string;
    value: string | number;
    tone?: "teal" | "gold" | "danger" | "green";
}) {
    const toneClasses = {
        teal: "bg-green-100 text-teal-700",
        gold: "bg-gold-100 text-gold-500",
        danger: "bg-danger/10 text-danger",
        green: "bg-green-100 text-green-500",
    }[tone];

    return (
        <div className="rounded-md border border-line bg-white p-5">
            <div className={clsx("mb-3 grid h-11 w-11 place-items-center rounded-xl", toneClasses)}>
                <Icon className="h-5 w-5" />
            </div>
            <div className="font-heading text-2xl font-extrabold text-ink">{value}</div>
            <div className="mt-1 text-[12.5px] text-[#63756F]">{label}</div>
        </div>
    );
}
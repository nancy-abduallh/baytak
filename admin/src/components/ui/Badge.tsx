import clsx from "clsx";
import { OrderStatus } from "@/lib/types";

const LABEL: Record<OrderStatus, string> = {
    pending: "جديد",
    confirmed: "مؤكد",
    in_progress: "قيد التنفيذ",
    completed: "مكتمل",
    cancelled: "ملغي",
};

const STYLE: Record<OrderStatus, { bg: string; text: string; dot: string }> = {
    pending: { bg: "bg-blue-500/10", text: "text-blue-500", dot: "bg-blue-500" },
    confirmed: { bg: "bg-[#E6EEF2]", text: "text-[#3B6B7D]", dot: "bg-[#3B6B7D]" },
    in_progress: { bg: "bg-gold-100", text: "text-[#8A6417]", dot: "bg-gold-500" },
    completed: { bg: "bg-green-100", text: "text-teal-800", dot: "bg-green-500" },
    cancelled: { bg: "bg-danger/10", text: "text-danger", dot: "bg-danger" },
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
    const s = STYLE[status];
    return (
        <span className={clsx("inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-bold", s.bg, s.text)}>
            <span className={clsx("h-1.5 w-1.5 rounded-full", s.dot)} />
            {LABEL[status]}
        </span>
    );
}

export function BoolBadge({ value, trueLabel, falseLabel }: { value: boolean; trueLabel: string; falseLabel: string }) {
    return (
        <span
            className={clsx(
                "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-bold",
                value ? "bg-green-100 text-teal-800" : "bg-danger/10 text-danger",
            )}
        >
            <span className={clsx("h-1.5 w-1.5 rounded-full", value ? "bg-green-500" : "bg-danger")} />
            {value ? trueLabel : falseLabel}
        </span>
    );
}
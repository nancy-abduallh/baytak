import clsx from "clsx";
import { OrderStatus } from "@/lib/types";

const LABEL: Record<OrderStatus, string> = {
    pending: "جديد",
    confirmed: "مؤكد",
    in_progress: "قيد التنفيذ",
    completed: "مكتمل",
    cancelled: "ملغي",
};

const STYLE: Record<OrderStatus, string> = {
    pending: "bg-[#E6EEF2] text-[#3B6B7D]",
    confirmed: "bg-[#E6EEF2] text-[#3B6B7D]",
    in_progress: "bg-gold-100 text-[#8A6417]",
    completed: "bg-green-100 text-teal-800",
    cancelled: "bg-danger/10 text-danger",
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
    return <span className={clsx("whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-bold", STYLE[status])}>{LABEL[status]}</span>;
}

export function BoolBadge({ value, trueLabel, falseLabel }: { value: boolean; trueLabel: string; falseLabel: string }) {
    return (
        <span className={clsx(
            "whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-bold",
            value ? "bg-green-100 text-teal-800" : "bg-danger/10 text-danger"
        )}>
            {value ? trueLabel : falseLabel}
        </span>
    );
}
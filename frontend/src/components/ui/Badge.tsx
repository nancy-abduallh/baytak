import clsx from "clsx";
import { OrderStatus } from "@/lib/types";
import { ORDER_STATUS_LABEL, ORDER_STATUS_STYLE } from "@/lib/constants";

export function StatusBadge({ status }: { status: OrderStatus }) {
    return (
        <span className={clsx("whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-bold", ORDER_STATUS_STYLE[status])}>
            {ORDER_STATUS_LABEL[status]}
        </span>
    );
}
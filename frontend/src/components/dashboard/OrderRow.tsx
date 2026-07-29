import clsx from "clsx";
import { Droplet, ChevronLeft } from "lucide-react";
import { Order } from "@/lib/types";
import { CATEGORY_ICONS } from "@/lib/constants";
import { StatusBadge } from "@/components/ui/Badge";

export function OrderRow({ order, selected, onSelect }: { order: Order; selected: boolean; onSelect: () => void }) {
    const Icon = CATEGORY_ICONS[order.categoryIconKey] ?? Droplet;

    return (
        <button
            onClick={onSelect}
            className={clsx(
                "mb-3 grid w-full grid-cols-[52px_1fr_auto_auto_auto] items-center gap-4 rounded-md border bg-white p-5 text-start",
                selected ? "border-teal-700 shadow-[0_0_0_3px_#E6F2E9]" : "border-line"
            )}
        >
            <div className="grid h-[52px] w-[52px] place-items-center rounded-md bg-sand-100 text-teal-700">
                <Icon className="h-6 w-6" />
            </div>
            <div>
                <h4 className="mb-1 text-[15px] font-bold">{order.categoryLabel} — طلب {order.orderNumber}</h4>
                <p className="text-[12.5px] text-[#8A9691]">
                    {order.description} · <b className="text-[#57655F]">الفني: {order.technician?.fullName ?? "لم يُعيّن بعد"}</b>
                </p>
            </div>
            <StatusBadge status={order.status} />
            <div className="font-heading text-base font-extrabold">{order.amount} ر.س</div>
            <ChevronLeft className="h-[18px] w-[18px] text-[#B7C1BC]" />
        </button>
    );
}
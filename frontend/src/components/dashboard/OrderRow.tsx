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
                "mb-3 grid w-full grid-cols-[44px_1fr] items-center gap-3 rounded-md border bg-white p-4 text-start sm:grid-cols-[52px_1fr] sm:gap-4 sm:p-5 lg:grid-cols-[52px_1fr_auto_auto_auto]",
                selected ? "border-teal-700 shadow-[0_0_0_3px_#E6F2E9]" : "border-line"
            )}
        >
            <div className="grid h-[44px] w-[44px] place-items-center rounded-md bg-sand-100 text-teal-700 sm:h-[52px] sm:w-[52px]">
                <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <div className="min-w-0">
                <h4 className="mb-1 truncate text-[14px] font-bold sm:text-[15px]">{order.categoryLabel} — طلب {order.orderNumber}</h4>
                <p className="truncate text-[12px] text-[#8A9691] sm:text-[12.5px]">
                    {order.description} · <b className="text-[#57655F]">الفني: {order.technician?.fullName ?? "لم يُعيّن بعد"}</b>
                </p>
            </div>
            <div className="col-span-2 flex flex-wrap items-center justify-between gap-3 pt-1 lg:col-span-1 lg:contents">
                <StatusBadge status={order.status} />
                <div className="font-heading text-base font-extrabold">{order.amount} ر.س</div>
                <ChevronLeft className="hidden h-[18px] w-[18px] text-[#B7C1BC] lg:block" />
            </div>
        </button>
    );
}
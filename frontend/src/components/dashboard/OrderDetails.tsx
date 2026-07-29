import { Order } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { ORDER_STATUS_LABEL } from "@/lib/constants";

export function OrderDetails({ order }: { order: Order }) {
    return (
        <div className="mt-6 rounded-md border border-line bg-white p-6">
            <h4 className="mb-4 text-[15px] font-bold">تفاصيل الطلب {order.orderNumber}</h4>
            <div className="mb-4 grid grid-cols-4 gap-5 border-b border-dashed border-line pb-5 text-[13.5px] text-[#57655F]">
                <Field label="رقم الطلب" value={order.orderNumber} />
                <Field label="حالة الطلب" value={ORDER_STATUS_LABEL[order.status]} />
                <Field label="الفني" value={order.technician?.fullName ?? "—"} />
                <Field label="العنوان" value={order.address} />
            </div>
            <p className="mb-4 text-[13.5px] text-[#57655F]">{order.description}</p>
            <Button variant="dark">تواصل مع الفني</Button>
        </div>
    );
}

function Field({ label, value }: { label: string; value: string }) {
    return (
        <div>
            <p className="mb-1.5 text-[#8A9691]">{label}</p>
            <b className="text-ink">{value}</b>
        </div>
    );
}
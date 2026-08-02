"use client";
import { useEffect, useState } from "react";
import { Info } from "lucide-react";
import { adminApi } from "@/lib/api";
import { AdminOrderRow, OrderStatus } from "@/lib/types";
import { AdminTopbar } from "@/components/layout/AdminTopbar";
import { DataTable, Column } from "@/components/ui/DataTable";
import { OrderStatusBadge } from "@/components/ui/Badge";

const MOCK_ORDERS: AdminOrderRow[] = [
    { id: 1010, orderNumber: "#1010", customerName: "أحمد محمد", technicianName: "محمد أحمد", categoryLabel: "كهرباء", status: "in_progress", amount: 200, scheduledDate: "2026-07-30", createdAt: "2026-07-28" },
    { id: 1000, orderNumber: "#1000", customerName: "سارة العتيبي", technicianName: "سعيد القرني", categoryLabel: "سباكة", status: "completed", amount: 150, scheduledDate: "2026-07-20", createdAt: "2026-07-18" },
    { id: 999, orderNumber: "#0999", customerName: "خالد الدوسري", technicianName: "عادل الشهري", categoryLabel: "تكييف", status: "pending", amount: 210, scheduledDate: "2026-08-01", createdAt: "2026-07-29" },
];

const STATUS_FILTERS: { key: OrderStatus | "all"; label: string }[] = [
    { key: "all", label: "الكل" },
    { key: "pending", label: "جديد" },
    { key: "confirmed", label: "مؤكد" },
    { key: "in_progress", label: "قيد التنفيذ" },
    { key: "completed", label: "مكتمل" },
    { key: "cancelled", label: "ملغي" },
];

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<AdminOrderRow[]>([]);
    const [filter, setFilter] = useState<OrderStatus | "all">("all");
    const [isMock, setIsMock] = useState(false);

    useEffect(() => {
        adminApi.getOrders()
            .then(setOrders)
            .catch(() => { setOrders(MOCK_ORDERS); setIsMock(true); });
    }, []);

    const filtered = filter === "all" ? orders : orders.filter((o) => o.status === filter);

    const columns: Column<AdminOrderRow>[] = [
        { header: "رقم الطلب", render: (o) => <b>{o.orderNumber}</b> },
        { header: "العميل", render: (o) => o.customerName },
        { header: "الفني", render: (o) => o.technicianName ?? <span className="text-muted">لم يُعيّن</span> }, { header: "الخدمة", render: (o) => o.categoryLabel },
        { header: "الحالة", render: (o) => <OrderStatusBadge status={o.status} /> },
        { header: "المبلغ", render: (o) => <b>{o.amount} ر.س</b> },
        { header: "الموعد", render: (o) => o.scheduledDate },
    ];

    return (
        <div>
            <AdminTopbar title="الطلبات" description="متابعة وإدارة جميع طلبات الخدمة على المنصة" />

            {isMock && (
                <div className="mb-6 flex items-center gap-2 rounded-md border border-gold-500/30 bg-gold-100/50 px-5 py-3 text-[13px] font-semibold text-[#8A6417]">
                    <Info className="h-4 w-4 flex-none" />
                    يتم عرض بيانات تجريبية — نقطة /admin/orders غير مبنية على الخادم الخلفي بعد.
                </div>
            )}

            <div className="card-elevated mb-5 flex w-fit gap-1.5 p-1.5">
                {STATUS_FILTERS.map((s) => (
                    <button
                        key={s.key}
                        onClick={() => setFilter(s.key)}
                        className={`rounded-full px-4 py-2.5 text-[13px] font-semibold transition-all ${filter === s.key ? "text-white shadow-[0_8px_18px_-6px_rgba(18,48,46,.45)]" : "text-[#57655F] hover:bg-sand-50"
                            }`}
                        style={filter === s.key ? { background: "linear-gradient(135deg,#12302E,#1E6B5C)" } : undefined}
                    >
                        {s.label}
                    </button>
                ))}
            </div>

            <DataTable columns={columns} rows={filtered} emptyLabel="لا توجد طلبات مطابقة" />
        </div>
    );
}
"use client";
import { useEffect, useMemo, useState } from "react";
import { Info, Pencil, Trash2 } from "lucide-react";
import { adminApi, ApiError } from "@/lib/api";
import { AdminOrderRow, OrderStatus } from "@/lib/types";
import { useAdminAuthStore } from "@/lib/stores/admin-auth-store";
import { hasPermission } from "@/lib/permissions";
import { AdminTopbar } from "@/components/layout/AdminTopbar";
import { DataTable, Column } from "@/components/ui/DataTable";
import { OrderStatusBadge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { SelectField, TextareaField } from "@/components/ui/FormField";

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

// Mirrors the backend's ALLOWED_TRANSITIONS map (orders.service.ts) so the
// dropdown never offers a transition the API would reject.
const ALLOWED_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
    pending: ["confirmed", "cancelled"],
    confirmed: ["in_progress", "cancelled"],
    in_progress: ["completed", "cancelled"],
    completed: [],
    cancelled: [],
};

const STATUS_LABELS: Record<OrderStatus, string> = {
    pending: "جديد", confirmed: "مؤكد", in_progress: "قيد التنفيذ", completed: "مكتمل", cancelled: "ملغي",
};

export default function AdminOrdersPage() {
    const admin = useAdminAuthStore((s) => s.admin);
    const canUpdateStatus = hasPermission(admin, "orders.update_status");
    const canDelete = hasPermission(admin, "orders.delete");

    const [orders, setOrders] = useState<AdminOrderRow[]>([]);
    const [filter, setFilter] = useState<OrderStatus | "all">("all");
    const [isMock, setIsMock] = useState(false);

    const [statusTarget, setStatusTarget] = useState<AdminOrderRow | null>(null);
    const [nextStatus, setNextStatus] = useState<OrderStatus | "">("");
    const [statusNote, setStatusNote] = useState("");
    const [statusError, setStatusError] = useState<string | null>(null);
    const [savingStatus, setSavingStatus] = useState(false);

    const [deleteTarget, setDeleteTarget] = useState<AdminOrderRow | null>(null);
    const [deleteError, setDeleteError] = useState<string | null>(null);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        adminApi.getOrders()
            .then(setOrders)
            .catch(() => { setOrders(MOCK_ORDERS); setIsMock(true); });
    }, []);

    const filtered = filter === "all" ? orders : orders.filter((o) => o.status === filter);

    const openStatusModal = (row: AdminOrderRow) => {
        setStatusTarget(row);
        const options = ALLOWED_TRANSITIONS[row.status];
        setNextStatus(options[0] ?? "");
        setStatusNote("");
        setStatusError(null);
    };

    const submitStatus = async () => {
        if (!statusTarget || !nextStatus) return;
        setStatusError(null);
        setSavingStatus(true);
        try {
            const updated = isMock
                ? { ...statusTarget, status: nextStatus as OrderStatus }
                : await adminApi.updateOrderStatus(statusTarget.id, nextStatus as OrderStatus, statusNote || undefined);
            setOrders((prev) => prev.map((o) => (o.id === statusTarget.id ? updated : o)));
            setStatusTarget(null);
        } catch (err) {
            setStatusError(err instanceof ApiError ? err.message : "تعذر تحديث حالة الطلب");
        } finally {
            setSavingStatus(false);
        }
    };

    const confirmDelete = async () => {
        if (!deleteTarget) return;
        setDeleteError(null);
        setDeleting(true);
        try {
            if (!isMock) await adminApi.deleteOrder(deleteTarget.id);
            setOrders((prev) => prev.filter((o) => o.id !== deleteTarget.id));
            setDeleteTarget(null);
        } catch (err) {
            setDeleteError(err instanceof ApiError ? err.message : "تعذر حذف الطلب");
        } finally {
            setDeleting(false);
        }
    };

    const columns: Column<AdminOrderRow>[] = useMemo(() => {
        const base: Column<AdminOrderRow>[] = [
            { header: "رقم الطلب", render: (o) => <b>{o.orderNumber}</b> },
            { header: "العميل", render: (o) => o.customerName },
            { header: "الفني", render: (o) => o.technicianName ?? <span className="text-muted">لم يُعيّن</span> },
            { header: "الخدمة", render: (o) => o.categoryLabel },
            { header: "الحالة", render: (o) => <OrderStatusBadge status={o.status} /> },
            { header: "المبلغ", render: (o) => <b>{o.amount} ر.س</b> },
            { header: "الموعد", render: (o) => o.scheduledDate },
        ];

        if (canUpdateStatus || canDelete) {
            base.push({
                header: "إجراءات",
                render: (o) => (
                    <div className="flex flex-wrap items-center gap-1.5">
                        {canUpdateStatus && ALLOWED_TRANSITIONS[o.status].length > 0 && (
                            <button
                                onClick={() => openStatusModal(o)}
                                title="تعديل الحالة"
                                className="grid h-8 w-8 place-items-center rounded-full bg-sand-100 text-[#57655F] transition-transform hover:scale-110 hover:bg-sand-50"
                            >
                                <Pencil className="h-3.5 w-3.5" />
                            </button>
                        )}
                        {canDelete && (
                            <button
                                onClick={() => { setDeleteTarget(o); setDeleteError(null); }}
                                title="حذف الطلب"
                                className="grid h-8 w-8 place-items-center rounded-full bg-danger/10 text-danger transition-transform hover:scale-110 hover:bg-danger/20"
                            >
                                <Trash2 className="h-3.5 w-3.5" />
                            </button>
                        )}
                    </div>
                ),
            });
        }

        return base;
    }, [canUpdateStatus, canDelete]);

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

            <Modal
                open={!!statusTarget}
                onClose={() => { if (!savingStatus) setStatusTarget(null); }}
                title="تعديل حالة الطلب"
                description={statusTarget ? `الطلب ${statusTarget.orderNumber} — الحالة الحالية: ${STATUS_LABELS[statusTarget.status]}` : undefined}
                width="460px"
            >
                {statusError && <div className="mb-4 rounded-md bg-danger/10 px-4 py-3 text-[13px] font-semibold text-danger">{statusError}</div>}

                {statusTarget && ALLOWED_TRANSITIONS[statusTarget.status].length === 0 ? (
                    <p className="text-[13px] text-muted">لا توجد حالة تالية متاحة لهذا الطلب.</p>
                ) : (
                    <>
                        <SelectField
                            label="الحالة الجديدة"
                            value={nextStatus}
                            onChange={(e) => setNextStatus(e.target.value as OrderStatus)}
                        >
                            {statusTarget && ALLOWED_TRANSITIONS[statusTarget.status].map((s) => (
                                <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                            ))}
                        </SelectField>
                        <TextareaField
                            label="ملاحظة (اختياري)"
                            rows={3}
                            value={statusNote}
                            onChange={(e) => setStatusNote(e.target.value)}
                            placeholder="سيتم إضافتها لسجل حالة الطلب"
                        />
                    </>
                )}

                <div className="mt-2 flex justify-end gap-3">
                    <button
                        onClick={() => setStatusTarget(null)}
                        className="rounded-full border border-line px-5 py-2.5 text-[13px] font-semibold text-[#57655F] transition hover:bg-sand-50"
                    >
                        إلغاء
                    </button>
                    <button
                        onClick={submitStatus}
                        disabled={savingStatus || !nextStatus}
                        className="rounded-full px-6 py-2.5 text-[13px] font-bold text-white shadow-[0_10px_22px_-8px_rgba(18,48,46,.45)] transition-transform hover:scale-[1.03] disabled:opacity-60 disabled:hover:scale-100"
                        style={{ background: "linear-gradient(135deg,#2F8F79,#1E6B5C)" }}
                    >
                        {savingStatus ? "جارِ الحفظ..." : "تحديث الحالة"}
                    </button>
                </div>
            </Modal>

            <ConfirmDialog
                open={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                onConfirm={confirmDelete}
                title="حذف الطلب"
                description={deleteTarget ? `هل أنت متأكد من حذف الطلب "${deleteTarget.orderNumber}"؟ سيتم حذف كل سجلاته وصوره وتقييمه المرتبط به.` : undefined}
                confirmLabel="حذف نهائيًا"
                busy={deleting}
            />
            {deleteError && (
                <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-danger px-5 py-2.5 text-[13px] font-semibold text-white shadow-lift">
                    {deleteError}
                </div>
            )}
        </div>
    );
}

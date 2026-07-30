"use client";
import { useEffect, useState } from "react";
import { adminApi } from "@/lib/api";
import { AdminUserRow } from "@/lib/types";
import { AdminTopbar } from "@/components/layout/AdminTopbar";
import { DataTable, Column } from "@/components/ui/DataTable";
import { BoolBadge } from "@/components/ui/Badge";

const MOCK_USERS: AdminUserRow[] = [
    { id: 1, fullName: "أحمد محمد", phone: "0501112222", email: "ahmad@example.com", city: "الرياض", ordersCount: 5, createdAt: "2026-02-11", isBlocked: false },
    { id: 2, fullName: "سارة العتيبي", phone: "0503334444", email: null, city: "جدة", ordersCount: 2, createdAt: "2026-05-03", isBlocked: false },
];

export default function AdminUsersPage() {
    const [users, setUsers] = useState<AdminUserRow[]>([]);
    const [isMock, setIsMock] = useState(false);
    const [busyId, setBusyId] = useState<number | null>(null);

    useEffect(() => {
        adminApi.getUsers()
            .then(setUsers)
            .catch(() => { setUsers(MOCK_USERS); setIsMock(true); });
    }, []);

    const toggleBlocked = async (row: AdminUserRow) => {
        setBusyId(row.id);
        try {
            const updated = isMock
                ? { ...row, isBlocked: !row.isBlocked }
                : await adminApi.setUserBlocked(row.id, !row.isBlocked);
            setUsers((prev) => prev.map((u) => (u.id === row.id ? updated : u)));
        } finally {
            setBusyId(null);
        }
    };

    const columns: Column<AdminUserRow>[] = [
        { header: "الاسم", render: (u) => <b>{u.fullName}</b> },
        { header: "الجوال", render: (u) => <span dir="ltr">{u.phone}</span> },
        { header: "البريد الإلكتروني", render: (u) => u.email ?? "—" },
        { header: "المدينة", render: (u) => u.city ?? "—" },
        { header: "عدد الطلبات", render: (u) => u.ordersCount },
        { header: "تاريخ التسجيل", render: (u) => u.createdAt },
        { header: "الحالة", render: (u) => <BoolBadge value={!u.isBlocked} trueLabel="نشط" falseLabel="محظور" /> },
        {
            header: "إجراء",
            render: (u) => (
                <button
                    onClick={() => toggleBlocked(u)}
                    disabled={busyId === u.id}
                    className={`rounded-full px-3.5 py-2 text-xs font-bold disabled:opacity-50 ${u.isBlocked ? "bg-teal-700 text-white" : "bg-danger/10 text-danger"
                        }`}
                >
                    {u.isBlocked ? "إلغاء الحظر" : "حظر المستخدم"}
                </button>
            ),
        },
    ];

    return (
        <div>
            <AdminTopbar title="المستخدمون" description="إدارة حسابات العملاء المسجلين على المنصة" />
            {isMock && (
                <div className="mb-6 rounded-md border border-gold-500/30 bg-gold-100/50 px-5 py-3 text-[13px] font-semibold text-[#8A6417]">
                    يتم عرض بيانات تجريبية — نقطة /admin/users غير مبنية على الخادم الخلفي بعد.
                </div>
            )}
            <DataTable columns={columns} rows={users} emptyLabel="لا يوجد مستخدمون" />
        </div>
    );
}
"use client";
import { useEffect, useState } from "react";
import { Check, X } from "lucide-react";
import { adminApi } from "@/lib/api";
import { AdminTechnicianRow } from "@/lib/types";
import { AdminTopbar } from "@/components/layout/AdminTopbar";
import { DataTable, Column } from "@/components/ui/DataTable";
import { BoolBadge } from "@/components/ui/Badge";

const MOCK_TECHS: AdminTechnicianRow[] = [
    { id: 1, fullName: "محمد أحمد", phone: "0501234567", categoryLabel: "كهرباء", city: "الرياض", district: "النرجس", isVerified: true, isActive: true, averageRating: 4.8, reviewCount: 210, completedOrders: 340 },
    { id: 2, fullName: "خالد النعيمي", phone: "0559876543", categoryLabel: "كهرباء", city: "الرياض", district: "الربيع", isVerified: false, isActive: true, averageRating: 4.6, reviewCount: 98, completedOrders: 120 },
];

export default function AdminTechniciansPage() {
    const [techs, setTechs] = useState<AdminTechnicianRow[]>([]);
    const [isMock, setIsMock] = useState(false);
    const [busyId, setBusyId] = useState<number | null>(null);

    useEffect(() => {
        adminApi.getTechnicians()
            .then(setTechs)
            .catch(() => { setTechs(MOCK_TECHS); setIsMock(true); });
    }, []);

    const toggleVerified = async (row: AdminTechnicianRow) => {
        setBusyId(row.id);
        try {
            const updated = isMock
                ? { ...row, isVerified: !row.isVerified }
                : await adminApi.setTechnicianVerified(row.id, !row.isVerified);
            setTechs((prev) => prev.map((t) => (t.id === row.id ? updated : t)));
        } finally {
            setBusyId(null);
        }
    };

    const columns: Column<AdminTechnicianRow>[] = [
        { header: "الفني", render: (t) => <b>{t.fullName}</b> },
        { header: "الجوال", render: (t) => <span dir="ltr">{t.phone}</span> },
        { header: "التخصص", render: (t) => t.categoryLabel },
        { header: "المدينة/الحي", render: (t) => `${t.city} - ${t.district}` },
        { header: "التقييم", render: (t) => `★ ${t.averageRating} (${t.reviewCount})` },
        { header: "الطلبات المكتملة", render: (t) => t.completedOrders },
        { header: "التحقق", render: (t) => <BoolBadge value={t.isVerified} trueLabel="موثّق" falseLabel="بانتظار التحقق" /> },
        {
            header: "إجراء",
            render: (t) => (
                <button
                    onClick={() => toggleVerified(t)}
                    disabled={busyId === t.id}
                    className={`flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-bold disabled:opacity-50 ${t.isVerified ? "bg-danger/10 text-danger" : "bg-teal-700 text-white"
                        }`}
                >
                    {t.isVerified ? <><X className="h-3.5 w-3.5" /> إلغاء التحقق</> : <><Check className="h-3.5 w-3.5" /> توثيق</>}
                </button>
            ),
        },
    ];

    return (
        <div>
            <AdminTopbar title="الفنيون" description="إدارة الفنيين المسجلين وحالات التحقق من هويّاتهم" />
            {isMock && (
                <div className="mb-6 rounded-md border border-gold-500/30 bg-gold-100/50 px-5 py-3 text-[13px] font-semibold text-[#8A6417]">
                    يتم عرض بيانات تجريبية — نقطة /admin/technicians غير مبنية على الخادم الخلفي بعد.
                </div>
            )}
            <DataTable columns={columns} rows={techs} emptyLabel="لا يوجد فنيون مسجلون" />
        </div>
    );
}
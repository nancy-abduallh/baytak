"use client";
import { useEffect, useState } from "react";
import { adminApi } from "@/lib/api";
import { AdminCategoryRow } from "@/lib/types";
import { AdminTopbar } from "@/components/layout/AdminTopbar";
import { DataTable, Column } from "@/components/ui/DataTable";
import { BoolBadge } from "@/components/ui/Badge";

const MOCK_CATEGORIES: AdminCategoryRow[] = [
    { id: 1, nameAr: "سباكة", slug: "plumbing", priceFrom: 80, priceUnit: "ر.س", technicianCount: 42, isActive: true },
    { id: 2, nameAr: "كهرباء", slug: "electrical", priceFrom: 100, priceUnit: "ر.س", technicianCount: 51, isActive: true },
    { id: 3, nameAr: "تكييف", slug: "ac", priceFrom: 120, priceUnit: "ر.س", technicianCount: 38, isActive: true },
];

export default function AdminCategoriesPage() {
    const [categories, setCategories] = useState<AdminCategoryRow[]>([]);
    const [isMock, setIsMock] = useState(false);

    useEffect(() => {
        adminApi.getCategories()
            .then(setCategories)
            .catch(() => { setCategories(MOCK_CATEGORIES); setIsMock(true); });
    }, []);

    const columns: Column<AdminCategoryRow>[] = [
        { header: "الفئة", render: (c) => <b>{c.nameAr}</b> },
        { header: "المعرّف (slug)", render: (c) => <span dir="ltr" className="text-[#8A9691]">{c.slug}</span> },
        { header: "السعر المعلن", render: (c) => `${c.priceFrom} ${c.priceUnit}` },
        { header: "عدد الفنيين", render: (c) => c.technicianCount },
        { header: "الحالة", render: (c) => <BoolBadge value={c.isActive} trueLabel="مفعّلة" falseLabel="متوقفة" /> },
    ];

    return (
        <div>
            <AdminTopbar title="فئات الخدمة" description="إدارة الفئات الرئيسية المعروضة للعملاء وأسعارها المعلنة" />
            {isMock && (
                <div className="mb-6 rounded-md border border-gold-500/30 bg-gold-100/50 px-5 py-3 text-[13px] font-semibold text-[#8A6417]">
                    يتم عرض بيانات تجريبية — نقطة /admin/categories غير مبنية على الخادم الخلفي بعد.
                </div>
            )}
            <DataTable columns={columns} rows={categories} emptyLabel="لا توجد فئات" />
        </div>
    );
}
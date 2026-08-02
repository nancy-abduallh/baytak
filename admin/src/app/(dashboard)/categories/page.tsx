"use client";
import { useEffect, useState } from "react";
import { Pencil, Trash2, Plus } from "lucide-react";
import { adminApi, ApiError } from "@/lib/api";
import { AdminCategoryRow, CreateCategoryPayload } from "@/lib/types";
import { AdminTopbar } from "@/components/layout/AdminTopbar";
import { DataTable, Column } from "@/components/ui/DataTable";
import { BoolBadge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { TextField, TextareaField, CheckboxField } from "@/components/ui/FormField";

const MOCK_CATEGORIES: AdminCategoryRow[] = [
    { id: 1, nameAr: "سباكة", slug: "plumbing", description: "أعمال السباكة وتسليك المواسير", iconKey: "plumbing", priceFrom: 80, priceUnit: "ر.س", sortOrder: 1, technicianCount: 42, isActive: true },
    { id: 2, nameAr: "كهرباء", slug: "electrical", description: "أعمال الكهرباء والتمديدات", iconKey: "electrical", priceFrom: 100, priceUnit: "ر.س", sortOrder: 2, technicianCount: 51, isActive: true },
    { id: 3, nameAr: "تكييف", slug: "ac", description: "صيانة وتركيب المكيفات", iconKey: "ac", priceFrom: 120, priceUnit: "ر.س", sortOrder: 3, technicianCount: 38, isActive: true },
];

const emptyForm: CreateCategoryPayload = {
    nameAr: "", slug: "", description: "", iconKey: "", priceFrom: 0, priceUnit: "ر.س", sortOrder: 0, isActive: true,
};

function slugify(value: string) {
    return value
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-");
}

export default function AdminCategoriesPage() {
    const [categories, setCategories] = useState<AdminCategoryRow[]>([]);
    const [isMock, setIsMock] = useState(false);

    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState<AdminCategoryRow | null>(null);
    const [form, setForm] = useState<CreateCategoryPayload>(emptyForm);
    const [slugTouched, setSlugTouched] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);

    const [deleteTarget, setDeleteTarget] = useState<AdminCategoryRow | null>(null);
    const [deleteError, setDeleteError] = useState<string | null>(null);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        adminApi.getCategories()
            .then(setCategories)
            .catch(() => { setCategories(MOCK_CATEGORIES); setIsMock(true); });
    }, []);

    const openCreate = () => {
        setEditing(null);
        setForm(emptyForm);
        setSlugTouched(false);
        setFormError(null);
        setModalOpen(true);
    };

    const openEdit = (row: AdminCategoryRow) => {
        setEditing(row);
        setForm({
            nameAr: row.nameAr, slug: row.slug, description: row.description ?? "",
            iconKey: row.iconKey, priceFrom: row.priceFrom, priceUnit: row.priceUnit,
            sortOrder: row.sortOrder, isActive: row.isActive,
        });
        setSlugTouched(true);
        setFormError(null);
        setModalOpen(true);
    };

    const closeModal = () => { if (!saving) setModalOpen(false); };

    const onNameChange = (value: string) => {
        setForm((prev) => ({ ...prev, nameAr: value, slug: slugTouched ? prev.slug : slugify(value) }));
    };

    const submitForm = async () => {
        setFormError(null);
        if (!form.nameAr.trim() || !form.slug.trim() || !form.iconKey.trim()) {
            setFormError("يرجى تعبئة اسم الفئة والمعرّف والأيقونة");
            return;
        }
        if (!/^[a-z0-9-]+$/.test(form.slug)) {
            setFormError("المعرّف (slug) يجب أن يحتوي على أحرف إنجليزية صغيرة وأرقام وشرطات فقط");
            return;
        }

        setSaving(true);
        try {
            if (isMock) {
                if (editing) {
                    setCategories((prev) => prev.map((c) => (c.id === editing.id ? { ...c, ...form, description: form.description || null } : c)));
                } else {
                    const newRow: AdminCategoryRow = {
                        id: Math.max(0, ...categories.map((c) => c.id)) + 1,
                        nameAr: form.nameAr, slug: form.slug, description: form.description || null,
                        iconKey: form.iconKey, priceFrom: form.priceFrom, priceUnit: form.priceUnit ?? "ر.س",
                        sortOrder: form.sortOrder ?? 0, technicianCount: 0, isActive: form.isActive ?? true,
                    };
                    setCategories((prev) => [...prev, newRow]);
                }
            } else if (editing) {
                const updated = await adminApi.updateCategory(editing.id, form);
                setCategories((prev) => prev.map((c) => (c.id === editing.id ? updated : c)));
            } else {
                const created = await adminApi.createCategory(form);
                setCategories((prev) => [...prev, created]);
            }
            setModalOpen(false);
        } catch (err) {
            setFormError(err instanceof ApiError ? err.message : "تعذر حفظ بيانات الفئة");
        } finally {
            setSaving(false);
        }
    };

    const confirmDelete = async () => {
        if (!deleteTarget) return;
        setDeleteError(null);
        setDeleting(true);
        try {
            if (!isMock) await adminApi.deleteCategory(deleteTarget.id);
            setCategories((prev) => prev.filter((c) => c.id !== deleteTarget.id));
            setDeleteTarget(null);
        } catch (err) {
            setDeleteError(err instanceof ApiError ? err.message : "تعذر حذف الفئة");
        } finally {
            setDeleting(false);
        }
    };

    const columns: Column<AdminCategoryRow>[] = [
        { header: "الفئة", render: (c) => <b>{c.nameAr}</b> },
        { header: "المعرّف (slug)", render: (c) => <span dir="ltr" className="text-[#8A9691]">{c.slug}</span> },
        { header: "السعر المعلن", render: (c) => `${c.priceFrom} ${c.priceUnit}` },
        { header: "الترتيب", render: (c) => c.sortOrder },
        { header: "عدد الفنيين", render: (c) => c.technicianCount },
        { header: "الحالة", render: (c) => <BoolBadge value={c.isActive} trueLabel="مفعّلة" falseLabel="متوقفة" /> },
        {
            header: "إجراءات",
            render: (c) => (
                <div className="flex items-center gap-1.5">
                    <button
                        onClick={() => openEdit(c)}
                        title="تعديل"
                        className="grid h-8 w-8 place-items-center rounded-full bg-sand-100 text-[#57655F] hover:bg-sand-50"
                    >
                        <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                        onClick={() => { setDeleteTarget(c); setDeleteError(null); }}
                        title="حذف"
                        className="grid h-8 w-8 place-items-center rounded-full bg-danger/10 text-danger hover:bg-danger/20"
                    >
                        <Trash2 className="h-3.5 w-3.5" />
                    </button>
                </div>
            ),
        },
    ];

    return (
        <div>
            <AdminTopbar title="فئات الخدمة" description="إدارة الفئات الرئيسية المعروضة للعملاء وأسعارها المعلنة" />

            {isMock && (
                <div className="mb-6 rounded-md border border-gold-500/30 bg-gold-100/50 px-5 py-3 text-[13px] font-semibold text-[#8A6417]">
                    يتم عرض بيانات تجريبية — تعذر الاتصال بنقطة /admin/categories على الخادم الخلفي.
                </div>
            )}

            <div className="mb-5 flex justify-end">
                <button
                    onClick={openCreate}
                    className="flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-[13px] font-bold text-white hover:bg-teal-900"
                >
                    <Plus className="h-4 w-4" /> إضافة فئة
                </button>
            </div>

            <DataTable columns={columns} rows={categories} emptyLabel="لا توجد فئات" />

            <Modal
                open={modalOpen}
                onClose={closeModal}
                title={editing ? "تعديل الفئة" : "إضافة فئة جديدة"}
                description={editing ? `تعديل: ${editing.nameAr}` : "أضف فئة خدمة جديدة لتظهر للعملاء في الموقع"}
            >
                {formError && <div className="mb-4 rounded-md bg-danger/10 px-4 py-3 text-[13px] font-semibold text-danger">{formError}</div>}

                <div className="grid grid-cols-2 gap-x-4">
                    <TextField label="اسم الفئة" value={form.nameAr} onChange={(e) => onNameChange(e.target.value)} />
                    <TextField
                        label="المعرّف (slug)"
                        dir="ltr"
                        value={form.slug}
                        onChange={(e) => { setSlugTouched(true); setForm({ ...form, slug: e.target.value }); }}
                    />
                    <TextField label="مفتاح الأيقونة" value={form.iconKey} onChange={(e) => setForm({ ...form, iconKey: e.target.value })} placeholder="مثال: plumbing" />
                    <TextField label="ترتيب العرض" type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })} />
                    <TextField label="السعر يبدأ من" type="number" min={0} value={form.priceFrom} onChange={(e) => setForm({ ...form, priceFrom: Number(e.target.value) })} />
                    <TextField label="وحدة السعر" value={form.priceUnit} onChange={(e) => setForm({ ...form, priceUnit: e.target.value })} />
                </div>

                <TextareaField
                    label="الوصف (اختياري)"
                    rows={3}
                    value={form.description ?? ""}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                />

                <CheckboxField
                    label="الفئة مفعّلة وتظهر للعملاء"
                    checked={form.isActive ?? true}
                    onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                />

                <div className="mt-2 flex justify-end gap-3">
                    <button onClick={closeModal} className="rounded-full border border-line px-5 py-2.5 text-[13px] font-semibold text-[#57655F] hover:bg-sand-50">
                        إلغاء
                    </button>
                    <button
                        onClick={submitForm}
                        disabled={saving}
                        className="rounded-full bg-teal-700 px-6 py-2.5 text-[13px] font-bold text-white hover:bg-teal-800 disabled:opacity-60"
                    >
                        {saving ? "جارِ الحفظ..." : editing ? "حفظ التعديلات" : "إضافة الفئة"}
                    </button>
                </div>
            </Modal>

            <ConfirmDialog
                open={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                onConfirm={confirmDelete}
                title="حذف الفئة"
                description={deleteTarget ? `هل أنت متأكد من حذف فئة "${deleteTarget.nameAr}"؟` : undefined}
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
"use client";
import { useEffect, useMemo, useState } from "react";
import { Check, X, Pencil, Trash2, Plus, Search, Ban, PlayCircle, Info } from "lucide-react";
import { adminApi, ApiError } from "@/lib/api";
import { AdminCategoryRow, AdminTechnicianRow, CreateTechnicianPayload, UpdateTechnicianPayload } from "@/lib/types";
import { AdminTopbar } from "@/components/layout/AdminTopbar";
import { DataTable, Column } from "@/components/ui/DataTable";
import { BoolBadge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { TextField, SelectField } from "@/components/ui/FormField";

const MOCK_CATEGORIES: AdminCategoryRow[] = [
    { id: 1, nameAr: "سباكة", slug: "plumbing", description: null, iconKey: "plumbing", priceFrom: 80, priceUnit: "ر.س", sortOrder: 1, technicianCount: 42, isActive: true },
    { id: 2, nameAr: "كهرباء", slug: "electrical", description: null, iconKey: "electrical", priceFrom: 100, priceUnit: "ر.س", sortOrder: 2, technicianCount: 51, isActive: true },
    { id: 3, nameAr: "تكييف", slug: "ac", description: null, iconKey: "ac", priceFrom: 120, priceUnit: "ر.س", sortOrder: 3, technicianCount: 38, isActive: true },
];

const MOCK_TECHS: AdminTechnicianRow[] = [
    { id: 1, fullName: "محمد أحمد", phone: "0501234567", email: "mohammed@example.com", categoryLabel: "كهرباء", primaryCategoryId: 2, city: "الرياض", district: "النرجس", yearsExperience: 6, priceFrom: 100, isVerified: true, isActive: true, averageRating: 4.8, reviewCount: 210, completedOrders: 340 },
    { id: 2, fullName: "خالد النعيمي", phone: "0559876543", email: null, categoryLabel: "كهرباء", primaryCategoryId: 2, city: "الرياض", district: "الربيع", yearsExperience: 3, priceFrom: 90, isVerified: false, isActive: true, averageRating: 4.6, reviewCount: 98, completedOrders: 120 },
];

const emptyForm: CreateTechnicianPayload = {
    fullName: "", phone: "", email: "", password: "", primaryCategoryId: 0,
    yearsExperience: 0, city: "", district: "", priceFrom: 0, isVerified: false, isActive: true,
};

export default function AdminTechniciansPage() {
    const [techs, setTechs] = useState<AdminTechnicianRow[]>([]);
    const [categories, setCategories] = useState<AdminCategoryRow[]>([]);
    const [isMock, setIsMock] = useState(false);
    const [busyId, setBusyId] = useState<number | null>(null);
    const [search, setSearch] = useState("");

    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState<AdminTechnicianRow | null>(null);
    const [form, setForm] = useState<CreateTechnicianPayload>(emptyForm);
    const [formError, setFormError] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);

    const [deleteTarget, setDeleteTarget] = useState<AdminTechnicianRow | null>(null);
    const [deleteError, setDeleteError] = useState<string | null>(null);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        Promise.all([adminApi.getTechnicians(), adminApi.getCategories()])
            .then(([t, c]) => { setTechs(t); setCategories(c); })
            .catch(() => { setTechs(MOCK_TECHS); setCategories(MOCK_CATEGORIES); setIsMock(true); });
    }, []);

    const filtered = useMemo(() => {
        const q = search.trim();
        if (!q) return techs;
        return techs.filter((t) => t.fullName.includes(q) || t.phone.includes(q) || t.categoryLabel.includes(q));
    }, [techs, search]);

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

    const toggleActive = async (row: AdminTechnicianRow) => {
        setBusyId(row.id);
        try {
            const updated = isMock
                ? { ...row, isActive: !row.isActive }
                : await adminApi.setTechnicianActive(row.id, !row.isActive);
            setTechs((prev) => prev.map((t) => (t.id === row.id ? updated : t)));
        } finally {
            setBusyId(null);
        }
    };

    const openCreate = () => {
        setEditing(null);
        setForm({ ...emptyForm, primaryCategoryId: categories[0]?.id ?? 0 });
        setFormError(null);
        setModalOpen(true);
    };

    const openEdit = (row: AdminTechnicianRow) => {
        setEditing(row);
        setForm({
            fullName: row.fullName, phone: row.phone, email: row.email ?? "", password: "",
            primaryCategoryId: row.primaryCategoryId, yearsExperience: row.yearsExperience,
            city: row.city, district: row.district, priceFrom: row.priceFrom,
            isVerified: row.isVerified, isActive: row.isActive,
        });
        setFormError(null);
        setModalOpen(true);
    };

    const closeModal = () => { if (!saving) setModalOpen(false); };

    const submitForm = async () => {
        setFormError(null);
        if (!form.fullName.trim() || !form.phone.trim() || !form.city.trim() || !form.district.trim()) {
            setFormError("يرجى تعبئة كافة الحقول المطلوبة");
            return;
        }
        if (!editing && form.password.length < 8) {
            setFormError("كلمة المرور يجب ألا تقل عن 8 أحرف");
            return;
        }

        setSaving(true);
        try {
            if (isMock) {
                if (editing) {
                    setTechs((prev) => prev.map((t) => (t.id === editing.id
                        ? { ...t, ...form, email: form.email || null, categoryLabel: categories.find((c) => c.id === form.primaryCategoryId)?.nameAr ?? t.categoryLabel }
                        : t)));
                } else {
                    const newRow: AdminTechnicianRow = {
                        id: Math.max(0, ...techs.map((t) => t.id)) + 1,
                        fullName: form.fullName, phone: form.phone, email: form.email || null,
                        categoryLabel: categories.find((c) => c.id === form.primaryCategoryId)?.nameAr ?? "",
                        primaryCategoryId: form.primaryCategoryId, city: form.city, district: form.district,
                        yearsExperience: form.yearsExperience ?? 0, priceFrom: form.priceFrom,
                        isVerified: form.isVerified ?? false, isActive: form.isActive ?? true,
                        averageRating: 0, reviewCount: 0, completedOrders: 0,
                    };
                    setTechs((prev) => [newRow, ...prev]);
                }
            } else if (editing) {
                const payload: UpdateTechnicianPayload = { ...form };
                if (!payload.password) delete payload.password;
                const updated = await adminApi.updateTechnician(editing.id, payload);
                setTechs((prev) => prev.map((t) => (t.id === editing.id ? updated : t)));
            } else {
                const created = await adminApi.createTechnician(form);
                setTechs((prev) => [created, ...prev]);
            }
            setModalOpen(false);
        } catch (err) {
            setFormError(err instanceof ApiError ? err.message : "تعذر حفظ بيانات الفني");
        } finally {
            setSaving(false);
        }
    };

    const confirmDelete = async () => {
        if (!deleteTarget) return;
        setDeleteError(null);
        setDeleting(true);
        try {
            if (!isMock) await adminApi.deleteTechnician(deleteTarget.id);
            setTechs((prev) => prev.filter((t) => t.id !== deleteTarget.id));
            setDeleteTarget(null);
        } catch (err) {
            setDeleteError(err instanceof ApiError ? err.message : "تعذر حذف الفني");
        } finally {
            setDeleting(false);
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
        { header: "الحالة", render: (t) => <BoolBadge value={t.isActive} trueLabel="نشط" falseLabel="موقوف" /> },
        {
            header: "إجراءات",
            render: (t) => (
                <div className="flex flex-wrap items-center gap-1.5">
                    <button
                        onClick={() => toggleVerified(t)}
                        disabled={busyId === t.id}
                        title={t.isVerified ? "إلغاء التحقق" : "توثيق"}
                        className={`grid h-8 w-8 place-items-center rounded-full text-white transition-transform hover:scale-110 disabled:opacity-50 disabled:hover:scale-100 ${t.isVerified ? "bg-gradient-to-br from-[#D97060] to-[#B24B3C]" : "bg-gradient-to-br from-[#2F8F79] to-[#1E6B5C]"
                            }`}
                    >
                        {t.isVerified ? <X className="h-3.5 w-3.5" /> : <Check className="h-3.5 w-3.5" />}
                    </button>
                    <button
                        onClick={() => toggleActive(t)}
                        disabled={busyId === t.id}
                        title={t.isActive ? "إيقاف الحساب" : "تفعيل الحساب"}
                        className={`grid h-8 w-8 place-items-center rounded-full text-white transition-transform hover:scale-110 disabled:opacity-50 disabled:hover:scale-100 ${t.isActive ? "bg-gradient-to-br from-[#E4B15C] to-[#BF8A34]" : "bg-gradient-to-br from-[#6BC28A] to-[#4C9A6A]"
                            }`}
                    >
                        {t.isActive ? <Ban className="h-3.5 w-3.5" /> : <PlayCircle className="h-3.5 w-3.5" />}
                    </button>
                    <button
                        onClick={() => openEdit(t)}
                        title="تعديل"
                        className="grid h-8 w-8 place-items-center rounded-full bg-sand-100 text-[#57655F] transition-transform hover:scale-110 hover:bg-sand-50"
                    >
                        <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                        onClick={() => { setDeleteTarget(t); setDeleteError(null); }}
                        title="حذف"
                        className="grid h-8 w-8 place-items-center rounded-full bg-danger/10 text-danger transition-transform hover:scale-110 hover:bg-danger/20"
                    >
                        <Trash2 className="h-3.5 w-3.5" />
                    </button>
                </div>
            ),
        },
    ];

    return (
        <div>
            <AdminTopbar title="الفنيون" description="إدارة الفنيين المسجلين وحالات التحقق من هويّاتهم" />

            {isMock && (
                <div className="mb-6 flex items-center gap-2 rounded-md border border-gold-500/30 bg-gold-100/50 px-5 py-3 text-[13px] font-semibold text-[#8A6417]">
                    <Info className="h-4 w-4 flex-none" />
                    يتم عرض بيانات تجريبية — تعذر الاتصال بالخادم الخلفي للفنيين والفئات.
                </div>
            )}

            <div className="mb-5 flex items-center justify-between gap-3">
                <div className="flex w-[300px] items-center gap-2 rounded-full border border-line bg-white px-4 py-2.5 shadow-sm transition-shadow focus-within:border-teal-700 focus-within:shadow-[0_0_0_4px_rgba(30,107,92,.12)]">
                    <Search className="h-4 w-4 text-[#8A9691]" />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="ابحث بالاسم أو الجوال أو التخصص"
                        className="w-full text-[13px] outline-none"
                    />
                </div>
                <button
                    onClick={openCreate}
                    className="flex items-center gap-2 rounded-full px-5 py-2.5 text-[13px] font-bold text-white shadow-[0_10px_24px_-8px_rgba(18,48,46,.5)] transition-transform hover:scale-[1.03]"
                    style={{ background: "linear-gradient(135deg,#12302E,#1E6B5C)" }}
                >
                    <Plus className="h-4 w-4" /> إضافة فني
                </button>
            </div>

            <DataTable columns={columns} rows={filtered} emptyLabel="لا يوجد فنيون مسجلون" />

            <Modal
                open={modalOpen}
                onClose={closeModal}
                title={editing ? "تعديل بيانات الفني" : "إضافة فني جديد"}
                description={editing ? `تعديل حساب: ${editing.fullName}` : "سيتمكن الفني من الدخول بالجوال وكلمة المرور بعد الإنشاء"}
            >
                {formError && <div className="mb-4 rounded-md bg-danger/10 px-4 py-3 text-[13px] font-semibold text-danger">{formError}</div>}

                <div className="grid grid-cols-2 gap-x-4">
                    <TextField label="الاسم الكامل" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
                    <TextField label="رقم الجوال" dir="ltr" placeholder="05XXXXXXXX" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                    <TextField label="البريد الإلكتروني (اختياري)" dir="ltr" value={form.email ?? ""} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                    <TextField
                        label={editing ? "كلمة مرور جديدة (اختياري)" : "كلمة المرور"}
                        type="password"
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        placeholder={editing ? "اتركه فارغًا للإبقاء على كلمة المرور الحالية" : "٨ أحرف على الأقل"}
                    />
                    <SelectField
                        label="التخصص الرئيسي"
                        value={form.primaryCategoryId}
                        onChange={(e) => setForm({ ...form, primaryCategoryId: Number(e.target.value) })}
                    >
                        {categories.map((c) => <option key={c.id} value={c.id}>{c.nameAr}</option>)}
                    </SelectField>
                    <TextField
                        label="سنوات الخبرة"
                        type="number" min={0}
                        value={form.yearsExperience}
                        onChange={(e) => setForm({ ...form, yearsExperience: Number(e.target.value) })}
                    />
                    <TextField label="المدينة" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
                    <TextField label="الحي" value={form.district} onChange={(e) => setForm({ ...form, district: e.target.value })} />
                    <TextField
                        label="السعر المعلن (ر.س)"
                        type="number" min={0}
                        value={form.priceFrom}
                        onChange={(e) => setForm({ ...form, priceFrom: Number(e.target.value) })}
                    />
                </div>

                <div className="mt-2 flex justify-end gap-3">
                    <button onClick={closeModal} className="rounded-full border border-line px-5 py-2.5 text-[13px] font-semibold text-[#57655F] transition hover:bg-sand-50">
                        إلغاء
                    </button>
                    <button
                        onClick={submitForm}
                        disabled={saving}
                        className="rounded-full px-6 py-2.5 text-[13px] font-bold text-white shadow-[0_10px_22px_-8px_rgba(18,48,46,.45)] transition-transform hover:scale-[1.03] disabled:opacity-60 disabled:hover:scale-100"
                        style={{ background: "linear-gradient(135deg,#2F8F79,#1E6B5C)" }}
                    >
                        {saving ? "جارِ الحفظ..." : editing ? "حفظ التعديلات" : "إضافة الفني"}
                    </button>
                </div>
            </Modal>

            <ConfirmDialog
                open={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                onConfirm={confirmDelete}
                title="حذف الفني"
                description={deleteTarget ? `هل أنت متأكد من حذف "${deleteTarget.fullName}"؟` : undefined}
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
"use client";
import { useEffect, useMemo, useState } from "react";
import { Pencil, Trash2, Plus, Search, Info, ShieldOff } from "lucide-react";
import { adminApi, ApiError } from "@/lib/api";
import { AdminRow, CreateAdminPayload, UpdateAdminPayload, PermissionKey } from "@/lib/types";
import { useAdminAuthStore } from "@/lib/stores/admin-auth-store";
import { ALL_PERMISSIONS, PERMISSION_LABELS, ROLE_LABELS, DEFAULT_PERMISSIONS_BY_ROLE, hasPermission } from "@/lib/permissions";
import { AdminTopbar } from "@/components/layout/AdminTopbar";
import { DataTable, Column } from "@/components/ui/DataTable";
import { BoolBadge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { TextField, SelectField, CheckboxField } from "@/components/ui/FormField";

const MOCK_ADMINS: AdminRow[] = [
    { id: 1, fullName: "مدير النظام", email: "admin@baytak.sa", role: "super_admin", permissions: [...ALL_PERMISSIONS], isActive: true, createdAt: "2026-01-01" },
    { id: 2, fullName: "نورة العتيبي", email: "noura.ops@baytak.sa", role: "operations", permissions: DEFAULT_PERMISSIONS_BY_ROLE.operations, isActive: true, createdAt: "2026-03-12" },
];

const ROLE_OPTIONS: AdminRow["role"][] = ["super_admin", "operations", "support", "finance"];

const emptyForm: CreateAdminPayload = {
    fullName: "", email: "", password: "", role: "operations",
    permissions: DEFAULT_PERMISSIONS_BY_ROLE.operations, isActive: true,
};

export default function AdminAdminsPage() {
    const currentAdmin = useAdminAuthStore((s) => s.admin);
    const canManage = hasPermission(currentAdmin, "admins.manage");

    const [admins, setAdmins] = useState<AdminRow[]>([]);
    const [isMock, setIsMock] = useState(false);
    const [search, setSearch] = useState("");

    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState<AdminRow | null>(null);
    const [form, setForm] = useState<CreateAdminPayload>(emptyForm);
    const [formError, setFormError] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);

    const [deleteTarget, setDeleteTarget] = useState<AdminRow | null>(null);
    const [deleteError, setDeleteError] = useState<string | null>(null);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        if (!canManage) return;
        adminApi.getAdmins()
            .then(setAdmins)
            .catch(() => { setAdmins(MOCK_ADMINS); setIsMock(true); });
    }, [canManage]);

    const filtered = useMemo(() => {
        const q = search.trim();
        if (!q) return admins;
        return admins.filter((a) => a.fullName.includes(q) || a.email.includes(q));
    }, [admins, search]);

    if (!canManage) {
        return (
            <div>
                <AdminTopbar title="إدارة المشرفين" description="التحكم بحسابات فريق العمليات وصلاحياتهم" />
                <div className="card-elevated flex flex-col items-center gap-3 p-14 text-center">
                    <ShieldOff className="h-8 w-8 text-danger" />
                    <p className="text-[13.5px] font-semibold text-[#57655F]">
                        لا تملك صلاحية الوصول إلى إدارة المشرفين — تواصل مع المدير العام إن كنت بحاجة لهذه الصلاحية.
                    </p>
                </div>
            </div>
        );
    }

    const openCreate = () => {
        setEditing(null);
        setForm(emptyForm);
        setFormError(null);
        setModalOpen(true);
    };

    const openEdit = (row: AdminRow) => {
        setEditing(row);
        setForm({
            fullName: row.fullName, email: row.email, password: "",
            role: row.role, permissions: row.permissions, isActive: row.isActive,
        });
        setFormError(null);
        setModalOpen(true);
    };

    const closeModal = () => { if (!saving) setModalOpen(false); };

    const onRoleChange = (role: AdminRow["role"]) => {
        setForm((f) => ({
            ...f,
            role,
            permissions: role === "super_admin" ? [] : DEFAULT_PERMISSIONS_BY_ROLE[role],
        }));
    };

    const togglePermission = (perm: PermissionKey) => {
        setForm((f) => ({
            ...f,
            permissions: f.permissions.includes(perm)
                ? f.permissions.filter((p) => p !== perm)
                : [...f.permissions, perm],
        }));
    };

    const submitForm = async () => {
        setFormError(null);
        if (!form.fullName.trim() || !form.email.trim()) {
            setFormError("يرجى تعبئة الاسم والبريد الإلكتروني");
            return;
        }
        if (form.role === "super_admin" && currentAdmin?.role !== "super_admin") {
            setFormError("فقط المدير العام يمكنه منح صلاحية مدير عام");
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
                    setAdmins((prev) => prev.map((a) => (a.id === editing.id ? { ...a, ...form } : a)));
                } else {
                    const newRow: AdminRow = {
                        id: Math.max(0, ...admins.map((a) => a.id)) + 1,
                        fullName: form.fullName, email: form.email, role: form.role,
                        permissions: form.permissions, isActive: form.isActive ?? true,
                        createdAt: new Date().toISOString().slice(0, 10),
                    };
                    setAdmins((prev) => [...prev, newRow]);
                }
            } else if (editing) {
                const payload: UpdateAdminPayload = { ...form };
                if (!payload.password) delete payload.password;
                const updated = await adminApi.updateAdmin(editing.id, payload);
                setAdmins((prev) => prev.map((a) => (a.id === editing.id ? updated : a)));
            } else {
                const created = await adminApi.createAdmin(form);
                setAdmins((prev) => [...prev, created]);
            }
            setModalOpen(false);
        } catch (err) {
            setFormError(err instanceof ApiError ? err.message : "تعذر حفظ بيانات المشرف");
        } finally {
            setSaving(false);
        }
    };

    const confirmDelete = async () => {
        if (!deleteTarget) return;
        setDeleteError(null);
        setDeleting(true);
        try {
            if (!isMock) await adminApi.deleteAdmin(deleteTarget.id);
            setAdmins((prev) => prev.filter((a) => a.id !== deleteTarget.id));
            setDeleteTarget(null);
        } catch (err) {
            setDeleteError(err instanceof ApiError ? err.message : "تعذر حذف حساب المشرف");
        } finally {
            setDeleting(false);
        }
    };

    const columns: Column<AdminRow>[] = [
        { header: "المشرف", render: (a) => <b>{a.fullName}</b> },
        { header: "البريد الإلكتروني", render: (a) => <span dir="ltr">{a.email}</span> },
        { header: "الدور", render: (a) => ROLE_LABELS[a.role] },
        {
            header: "الصلاحيات",
            render: (a) => a.role === "super_admin"
                ? <span className="text-[12.5px] font-semibold text-teal-800">جميع الصلاحيات</span>
                : (
                    <div className="flex flex-wrap gap-1">
                        {a.permissions.length === 0 && <span className="text-muted">—</span>}
                        {a.permissions.slice(0, 2).map((p) => (
                            <span key={p} className="rounded-full bg-sand-100 px-2.5 py-1 text-[11px] font-semibold text-[#57655F]">
                                {PERMISSION_LABELS[p]}
                            </span>
                        ))}
                        {a.permissions.length > 2 && (
                            <span className="rounded-full bg-sand-100 px-2.5 py-1 text-[11px] font-semibold text-[#57655F]">
                                +{a.permissions.length - 2}
                            </span>
                        )}
                    </div>
                ),
        },
        { header: "الحالة", render: (a) => <BoolBadge value={a.isActive} trueLabel="نشط" falseLabel="موقوف" /> },
        { header: "تاريخ الإنشاء", render: (a) => a.createdAt },
        {
            header: "إجراءات",
            render: (a) => {
                const isSelf = a.id === currentAdmin?.id;
                const canTouch = a.role !== "super_admin" || currentAdmin?.role === "super_admin";
                if (!canTouch) return <span className="text-[12px] text-muted">محمي</span>;
                return (
                    <div className="flex flex-wrap items-center gap-1.5">
                        <button
                            onClick={() => openEdit(a)}
                            title="تعديل"
                            className="grid h-8 w-8 place-items-center rounded-full bg-sand-100 text-[#57655F] transition-transform hover:scale-110 hover:bg-sand-50"
                        >
                            <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                            onClick={() => { if (!isSelf) { setDeleteTarget(a); setDeleteError(null); } }}
                            disabled={isSelf}
                            title={isSelf ? "لا يمكنك حذف حسابك الخاص" : "حذف"}
                            className="grid h-8 w-8 place-items-center rounded-full bg-danger/10 text-danger transition-transform hover:scale-110 hover:bg-danger/20 disabled:opacity-40 disabled:hover:scale-100"
                        >
                            <Trash2 className="h-3.5 w-3.5" />
                        </button>
                    </div>
                );
            },
        },
    ];

    return (
        <div>
            <AdminTopbar title="إدارة المشرفين" description="إضافة حسابات مشرفين جدد وتحديد أدوارهم وصلاحياتهم داخل لوحة التحكم" />

            {isMock && (
                <div className="mb-6 flex items-center gap-2 rounded-md border border-gold-500/30 bg-gold-100/50 px-5 py-3 text-[13px] font-semibold text-[#8A6417]">
                    <Info className="h-4 w-4 flex-none" />
                    يتم عرض بيانات تجريبية — تعذر الاتصال بالخادم الخلفي لإدارة المشرفين.
                </div>
            )}

            <div className="mb-5 flex items-center justify-between gap-3">
                <div className="flex w-[300px] items-center gap-2 rounded-full border border-line bg-white px-4 py-2.5 shadow-sm transition-shadow focus-within:border-teal-700 focus-within:shadow-[0_0_0_4px_rgba(30,107,92,.12)]">
                    <Search className="h-4 w-4 text-muted" />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="ابحث بالاسم أو البريد الإلكتروني"
                        className="w-full text-[13px] outline-none"
                    />
                </div>
                <button
                    onClick={openCreate}
                    className="flex items-center gap-2 rounded-full px-5 py-2.5 text-[13px] font-bold text-white shadow-[0_10px_24px_-8px_rgba(18,48,46,.5)] transition-transform hover:scale-[1.03]"
                    style={{ background: "linear-gradient(135deg,#12302E,#1E6B5C)" }}
                >
                    <Plus className="h-4 w-4" /> إضافة مشرف
                </button>
            </div>

            <DataTable columns={columns} rows={filtered} emptyLabel="لا يوجد مشرفون مسجلون" />

            <Modal
                open={modalOpen}
                onClose={closeModal}
                title={editing ? "تعديل بيانات المشرف" : "إضافة مشرف جديد"}
                description={editing ? `تعديل حساب: ${editing.fullName}` : "سيتمكن المشرف من الدخول للوحة التحكم بالبريد وكلمة المرور بعد الإنشاء"}
                width="640px"
            >
                {formError && <div className="mb-4 rounded-md bg-danger/10 px-4 py-3 text-[13px] font-semibold text-danger">{formError}</div>}

                <div className="grid grid-cols-2 gap-x-4">
                    <TextField label="الاسم الكامل" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
                    <TextField label="البريد الإلكتروني" dir="ltr" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                    <TextField
                        label={editing ? "كلمة مرور جديدة (اختياري)" : "كلمة المرور"}
                        type="password"
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        placeholder={editing ? "اتركه فارغًا للإبقاء على كلمة المرور الحالية" : "٨ أحرف على الأقل"}
                    />
                    <SelectField
                        label="الدور"
                        value={form.role}
                        onChange={(e) => onRoleChange(e.target.value as AdminRow["role"])}
                    >
                        {ROLE_OPTIONS.filter((r) => r !== "super_admin" || currentAdmin?.role === "super_admin").map((r) => (
                            <option key={r} value={r}>{ROLE_LABELS[r]}</option>
                        ))}
                    </SelectField>
                </div>

                <CheckboxField
                    label="الحساب نشط"
                    checked={form.isActive ?? true}
                    onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                />

                {form.role === "super_admin" ? (
                    <div className="mb-2 rounded-xl bg-sand-50 p-4 text-[12.5px] font-semibold text-[#57655F]">
                        حسابات المدير العام تملك جميع الصلاحيات تلقائيًا، ولا حاجة لتحديدها يدويًا.
                    </div>
                ) : (
                    <div className="mb-2">
                        <label className="mb-2 block text-[13px] font-semibold text-[#57655F]">الصلاحيات</label>
                        <div className="grid grid-cols-2 gap-2 rounded-xl border border-line p-4">
                            {ALL_PERMISSIONS.map((perm) => (
                                <label key={perm} className="flex items-center gap-2.5 text-[12.5px] font-semibold text-[#57655F]">
                                    <input
                                        type="checkbox"
                                        className="h-4 w-4 rounded border-line accent-teal-700"
                                        checked={form.permissions.includes(perm)}
                                        onChange={() => togglePermission(perm)}
                                    />
                                    {PERMISSION_LABELS[perm]}
                                </label>
                            ))}
                        </div>
                    </div>
                )}

                <div className="mt-4 flex justify-end gap-3">
                    <button onClick={closeModal} className="rounded-full border border-line px-5 py-2.5 text-[13px] font-semibold text-[#57655F] transition hover:bg-sand-50">
                        إلغاء
                    </button>
                    <button
                        onClick={submitForm}
                        disabled={saving}
                        className="rounded-full px-6 py-2.5 text-[13px] font-bold text-white shadow-[0_10px_22px_-8px_rgba(18,48,46,.45)] transition-transform hover:scale-[1.03] disabled:opacity-60 disabled:hover:scale-100"
                        style={{ background: "linear-gradient(135deg,#2F8F79,#1E6B5C)" }}
                    >
                        {saving ? "جارِ الحفظ..." : editing ? "حفظ التعديلات" : "إضافة المشرف"}
                    </button>
                </div>
            </Modal>

            <ConfirmDialog
                open={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                onConfirm={confirmDelete}
                title="حذف حساب المشرف"
                description={deleteTarget ? `هل أنت متأكد من حذف حساب "${deleteTarget.fullName}"؟` : undefined}
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

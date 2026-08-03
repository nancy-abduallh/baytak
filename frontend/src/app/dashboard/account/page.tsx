"use client";
import { FormEvent, ReactNode, useEffect, useState } from "react";
import { MapPin, Mail, Phone, Plus, Pencil, Trash2, User as UserIcon } from "lucide-react";
import { useAuthStore } from "@/lib/stores/auth-store";
import { api, ApiError } from "@/lib/api";
import { Address } from "@/lib/types";
import { Button } from "@/components/ui/Button";

export default function AccountPage() {
    const user = useAuthStore((s) => s.user);
    const [addresses, setAddresses] = useState<Address[] | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);

    const loadAddresses = () => {
        api.getMyAddresses().then(setAddresses).catch((err) => setError(err instanceof ApiError ? err.message : "تعذر تحميل العناوين"));
    };

    useEffect(() => { loadAddresses(); }, []);

    if (!user) return null;

    return (
        <div>
            <h2 className="mb-5 text-2xl font-extrabold">حسابي</h2>

            <ProfileCard />

            <div className="rounded-md border border-line bg-white p-6">
                <div className="mb-4 flex items-center justify-between">
                    <h4 className="text-[15px] font-bold">عناويني</h4>
                    <button
                        onClick={() => { setEditingId(null); setShowAddForm((v) => !v); }}
                        className="flex items-center gap-1.5 text-[13px] font-bold text-teal-700"
                    >
                        <Plus className="h-4 w-4" /> إضافة عنوان
                    </button>
                </div>

                {showAddForm && (
                    <AddressForm
                        onCancel={() => setShowAddForm(false)}
                        onSaved={() => { setShowAddForm(false); loadAddresses(); }}
                    />
                )}
                {error && <p className="text-[13px] text-danger">{error}</p>}
                {!addresses && !error && <p className="text-[13px] text-[#8A9691]">جارِ التحميل...</p>}
                {addresses?.length === 0 && <p className="text-[13px] text-[#8A9691]">لا توجد عناوين محفوظة بعد.</p>}

                <div className="space-y-3">
                    {addresses?.map((addr) =>
                        editingId === addr.id ? (
                            <AddressForm
                                key={addr.id}
                                initial={addr}
                                onCancel={() => setEditingId(null)}
                                onSaved={() => { setEditingId(null); loadAddresses(); }}
                            />
                        ) : (
                            <div key={addr.id} className="flex items-center justify-between rounded-md border border-line px-4 py-3">
                                <div>
                                    <p className="flex items-center gap-2 text-[13.5px] font-bold">
                                        {addr.label}
                                        {addr.isDefault && <span className="rounded-full bg-green-100 px-2.5 py-1 text-[11px] font-bold text-teal-800">افتراضي</span>}
                                    </p>
                                    <p className="text-[12.5px] text-[#8A9691]">{addr.city} - {addr.district}{addr.street ? ` - ${addr.street}` : ""}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => { setShowAddForm(false); setEditingId(addr.id); }}
                                        className="flex items-center gap-1 text-[12.5px] font-semibold text-[#57655F] hover:text-teal-700"
                                    >
                                        <Pencil className="h-3.5 w-3.5" /> تعديل
                                    </button>
                                    <DeleteAddressButton
                                        addressId={addr.id}
                                        onDeleted={loadAddresses}
                                    />
                                </div>
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    );
}

function ProfileCard() {
    const user = useAuthStore((s) => s.user);
    const updateUser = useAuthStore((s) => s.updateUser);
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState({
        fullName: user?.fullName ?? "",
        phone: user?.phone ?? "",
        email: user?.email ?? "",
        city: user?.city ?? "",
        district: user?.district ?? "",
    });
    const [submitting, setSubmitting] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    if (!user) return null;

    const startEditing = () => {
        setForm({
            fullName: user.fullName,
            phone: user.phone,
            email: user.email ?? "",
            city: user.city ?? "",
            district: user.district ?? "",
        });
        setFormError(null);
        setSuccess(false);
        setEditing(true);
    };

    const submit = async (e: FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setFormError(null);
        try {
            const updated = await api.updateProfile({
                fullName: form.fullName,
                phone: form.phone,
                email: form.email || undefined,
                city: form.city || undefined,
                district: form.district || undefined,
            });
            updateUser(updated);
            setEditing(false);
            setSuccess(true);
        } catch (err) {
            setFormError(err instanceof ApiError ? err.message : "تعذر حفظ التعديلات");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="mb-6 rounded-md border border-line bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
                <h4 className="text-[15px] font-bold">البيانات الشخصية</h4>
                {!editing && (
                    <button onClick={startEditing} className="flex items-center gap-1.5 text-[13px] font-bold text-teal-700">
                        <Pencil className="h-3.5 w-3.5" /> تعديل البيانات
                    </button>
                )}
            </div>

            {success && !editing && (
                <p className="mb-4 rounded-md bg-green-100 px-4 py-3 text-[12.5px] font-semibold text-teal-800">تم حفظ التعديلات بنجاح.</p>
            )}

            {editing ? (
                <form onSubmit={submit} className="grid grid-cols-2 gap-3">
                    {formError && <p className="col-span-2 text-[12.5px] text-danger">{formError}</p>}
                    <LabeledInput
                        label="الاسم الكامل"
                        icon={<UserIcon className="h-4 w-4" />}
                        value={form.fullName}
                        onChange={(v) => setForm({ ...form, fullName: v })}
                    />
                    <LabeledInput
                        label="رقم الجوال"
                        icon={<Phone className="h-4 w-4" />}
                        value={form.phone}
                        onChange={(v) => setForm({ ...form, phone: v })}
                        placeholder="05xxxxxxxx"
                    />
                    <LabeledInput
                        label="البريد الإلكتروني"
                        icon={<Mail className="h-4 w-4" />}
                        value={form.email}
                        onChange={(v) => setForm({ ...form, email: v })}
                        type="email"
                    />
                    <LabeledInput
                        label="المدينة"
                        icon={<MapPin className="h-4 w-4" />}
                        value={form.city}
                        onChange={(v) => setForm({ ...form, city: v })}
                    />
                    <LabeledInput
                        label="الحي"
                        icon={<MapPin className="h-4 w-4" />}
                        value={form.district}
                        onChange={(v) => setForm({ ...form, district: v })}
                    />
                    <div className="col-span-2 flex items-center gap-3 pt-1">
                        <Button type="submit" variant="dark">{submitting ? "جارِ الحفظ..." : "حفظ التعديلات"}</Button>
                        <button type="button" onClick={() => setEditing(false)} className="text-[13px] font-semibold text-[#57655F]">إلغاء</button>
                    </div>
                </form>
            ) : (
                <div className="grid grid-cols-3 gap-5 text-[13.5px]">
                    <Field icon={<UserIcon className="h-4 w-4" />} label="الاسم الكامل" value={user.fullName} />
                    <Field icon={<Phone className="h-4 w-4" />} label="رقم الجوال" value={user.phone} />
                    <Field icon={<Mail className="h-4 w-4" />} label="البريد الإلكتروني" value={user.email ?? "—"} />
                    <Field icon={<MapPin className="h-4 w-4" />} label="المدينة" value={user.city ?? "—"} />
                    <Field icon={<MapPin className="h-4 w-4" />} label="الحي" value={user.district ?? "—"} />
                </div>
            )}
        </div>
    );
}

function Field({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
    return (
        <div>
            <p className="mb-1.5 flex items-center gap-1.5 text-[#8A9691]">{icon} {label}</p>
            <p className="font-bold text-ink">{value}</p>
        </div>
    );
}

function LabeledInput({
    label, icon, value, onChange, type = "text", placeholder,
}: {
    label: string; icon: ReactNode; value: string; onChange: (v: string) => void; type?: string; placeholder?: string;
}) {
    return (
        <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-[12.5px] font-semibold text-[#57655F]">{icon} {label}</label>
            <input
                type={type}
                value={value}
                placeholder={placeholder}
                onChange={(e) => onChange(e.target.value)}
                className="w-full rounded-md border border-line px-3 py-2.5 text-[13px]"
            />
        </div>
    );
}

function AddressForm({
    initial, onCancel, onSaved,
}: {
    initial?: Address; onCancel: () => void; onSaved: () => void;
}) {
    const [form, setForm] = useState({
        label: initial?.label ?? "المنزل",
        city: initial?.city ?? "الرياض",
        district: initial?.district ?? "",
        street: initial?.street ?? "",
        isDefault: initial?.isDefault ?? false,
    });
    const [submitting, setSubmitting] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);

    const submit = async (e: FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setFormError(null);
        try {
            if (initial) {
                await api.updateAddress(initial.id, form);
            } else {
                await api.createAddress(form);
            }
            onSaved();
        } catch (err) {
            setFormError(err instanceof ApiError ? err.message : "تعذر حفظ العنوان");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={submit} className="mb-5 grid grid-cols-2 gap-3 rounded-md bg-sand-50 p-4">
            {formError && <p className="col-span-2 text-[12.5px] text-danger">{formError}</p>}
            <input value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} placeholder="مثال: المنزل" className="rounded-md border border-line px-3 py-2 text-[13px]" />
            <input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="المدينة" className="rounded-md border border-line px-3 py-2 text-[13px]" />
            <input value={form.district} onChange={(e) => setForm({ ...form, district: e.target.value })} placeholder="الحي" className="rounded-md border border-line px-3 py-2 text-[13px]" />
            <input value={form.street} onChange={(e) => setForm({ ...form, street: e.target.value })} placeholder="الشارع (اختياري)" className="rounded-md border border-line px-3 py-2 text-[13px]" />
            <label className="col-span-2 flex items-center gap-2 text-[12.5px] font-semibold text-[#57655F]">
                <input type="checkbox" checked={form.isDefault} onChange={(e) => setForm({ ...form, isDefault: e.target.checked })} className="accent-teal-700" />
                اجعله العنوان الافتراضي
            </label>
            <div className="col-span-2 flex items-center gap-3">
                <Button type="submit" variant="dark" className="justify-center">{submitting ? "جارِ الحفظ..." : "حفظ العنوان"}</Button>
                <button type="button" onClick={onCancel} className="text-[13px] font-semibold text-[#57655F]">إلغاء</button>
            </div>
        </form>
    );
}

function DeleteAddressButton({ addressId, onDeleted }: { addressId: number; onDeleted: () => void }) {
    const [confirming, setConfirming] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (confirming) {
        return (
            <div className="flex items-center gap-2 text-[12.5px]">
                <span className="text-danger">{error ?? "تأكيد الحذف؟"}</span>
                <button
                    onClick={async () => {
                        setDeleting(true);
                        try {
                            await api.deleteAddress(addressId);
                            onDeleted();
                        } catch (err) {
                            setError(err instanceof ApiError ? err.message : "تعذر حذف العنوان");
                        } finally {
                            setDeleting(false);
                            setConfirming(false);
                        }
                    }}
                    className="font-bold text-danger"
                    disabled={deleting}
                >
                    نعم، احذف
                </button>
                <button onClick={() => setConfirming(false)} className="font-semibold text-[#57655F]">تراجع</button>
            </div>
        );
    }

    return (
        <button onClick={() => setConfirming(true)} className="flex items-center gap-1 text-[12.5px] font-semibold text-danger hover:opacity-80">
            <Trash2 className="h-3.5 w-3.5" /> حذف
        </button>
    );
}
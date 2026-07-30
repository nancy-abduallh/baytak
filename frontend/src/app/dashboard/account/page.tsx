"use client";
import { FormEvent, ReactNode, useEffect, useState } from "react";
import { MapPin, Mail, Phone, Plus } from "lucide-react";
import { useAuthStore } from "@/lib/stores/auth-store";
import { api, ApiError } from "@/lib/api";
import { Address } from "@/lib/types";
import { Button } from "@/components/ui/Button";

export default function AccountPage() {
    const user = useAuthStore((s) => s.user);
    const [addresses, setAddresses] = useState<Address[] | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);

    const loadAddresses = () => {
        api.getMyAddresses().then(setAddresses).catch((err) => setError(err instanceof ApiError ? err.message : "تعذر تحميل العناوين"));
    };

    useEffect(() => { loadAddresses(); }, []);

    if (!user) return null;

    return (
        <div>
            <h2 className="mb-5 text-2xl font-extrabold">حسابي</h2>

            <div className="mb-6 rounded-md border border-line bg-white p-6">
                <h4 className="mb-4 text-[15px] font-bold">البيانات الشخصية</h4>
                <div className="grid grid-cols-3 gap-5 text-[13.5px]">
                    <Field icon={<Phone className="h-4 w-4" />} label="رقم الجوال" value={user.phone} />
                    <Field icon={<Mail className="h-4 w-4" />} label="البريد الإلكتروني" value={user.email ?? "—"} />
                    <Field icon={<MapPin className="h-4 w-4" />} label="المدينة" value={user.city ?? "—"} />
                </div>
            </div>

            <div className="rounded-md border border-line bg-white p-6">
                <div className="mb-4 flex items-center justify-between">
                    <h4 className="text-[15px] font-bold">عناويني</h4>
                    <button onClick={() => setShowForm((v) => !v)} className="flex items-center gap-1.5 text-[13px] font-bold text-teal-700">
                        <Plus className="h-4 w-4" /> إضافة عنوان
                    </button>
                </div>

                {showForm && <AddAddressForm onCreated={() => { setShowForm(false); loadAddresses(); }} />}
                {error && <p className="text-[13px] text-danger">{error}</p>}
                {!addresses && !error && <p className="text-[13px] text-[#8A9691]">جارِ التحميل...</p>}
                {addresses?.length === 0 && <p className="text-[13px] text-[#8A9691]">لا توجد عناوين محفوظة بعد.</p>}

                <div className="space-y-3">
                    {addresses?.map((addr) => (
                        <div key={addr.id} className="flex items-center justify-between rounded-md border border-line px-4 py-3">
                            <div>
                                <p className="text-[13.5px] font-bold">{addr.label}</p>
                                <p className="text-[12.5px] text-[#8A9691]">{addr.city} - {addr.district}{addr.street ? ` - ${addr.street}` : ""}</p>
                            </div>
                            {addr.isDefault && <span className="rounded-full bg-green-100 px-2.5 py-1 text-[11px] font-bold text-teal-800">افتراضي</span>}
                        </div>
                    ))}
                </div>
            </div>
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

function AddAddressForm({ onCreated }: { onCreated: () => void }) {
    const [form, setForm] = useState({ label: "المنزل", city: "الرياض", district: "", street: "" });
    const [submitting, setSubmitting] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);

    const submit = async (e: FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setFormError(null);
        try {
            await api.createAddress(form);
            onCreated();
        } catch (err) {
            setFormError(err instanceof ApiError ? err.message : "تعذر إضافة العنوان");
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
            <Button type="submit" variant="dark" className="col-span-2 justify-center">{submitting ? "جارِ الحفظ..." : "حفظ العنوان"}</Button>
        </form>
    );
}
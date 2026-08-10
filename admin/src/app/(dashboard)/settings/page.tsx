"use client";
import { useEffect, useState } from "react";
import { Phone, Share2, FileText, ShieldOff } from "lucide-react";
import { adminApi, ApiError } from "@/lib/api";
import { SiteSettings, UpdateSiteSettingsPayload } from "@/lib/types";
import { useAdminAuthStore } from "@/lib/stores/admin-auth-store";
import { hasPermission } from "@/lib/permissions";
import { AdminTopbar } from "@/components/layout/AdminTopbar";
import { TextField, TextareaField } from "@/components/ui/FormField";

const emptyForm: UpdateSiteSettingsPayload = {
    siteName: "",
    footerDescription: "",
    availabilityNote: "",
    contactPhone: "",
    contactWhatsapp: "",
    contactEmail: "",
    websiteUrl: "",
    address: "",
    workingHours: "",
    facebookUrl: "",
    twitterUrl: "",
    instagramUrl: "",
    tiktokUrl: "",
    copyrightText: "",
};

function toForm(settings: SiteSettings): UpdateSiteSettingsPayload {
    return {
        siteName: settings.siteName ?? "",
        footerDescription: settings.footerDescription ?? "",
        availabilityNote: settings.availabilityNote ?? "",
        contactPhone: settings.contactPhone ?? "",
        contactWhatsapp: settings.contactWhatsapp ?? "",
        contactEmail: settings.contactEmail ?? "",
        websiteUrl: settings.websiteUrl ?? "",
        address: settings.address ?? "",
        workingHours: settings.workingHours ?? "",
        facebookUrl: settings.facebookUrl ?? "",
        twitterUrl: settings.twitterUrl ?? "",
        instagramUrl: settings.instagramUrl ?? "",
        tiktokUrl: settings.tiktokUrl ?? "",
        copyrightText: settings.copyrightText ?? "",
    };
}

export default function AdminSettingsPage() {
    const currentAdmin = useAdminAuthStore((s) => s.admin);
    const canManage = hasPermission(currentAdmin, "settings.manage");

    const [form, setForm] = useState<UpdateSiteSettingsPayload>(emptyForm);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState<string | null>(null);

    const [saving, setSaving] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);
    const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

    useEffect(() => {
        if (!canManage) return;
        adminApi.getSiteSettings()
            .then((settings) => setForm(toForm(settings)))
            .catch((err) => setLoadError(err instanceof ApiError ? err.message : "تعذر تحميل إعدادات الموقع"))
            .finally(() => setLoading(false));
    }, [canManage]);

    const field = (key: keyof UpdateSiteSettingsPayload) => ({
        value: form[key] ?? "",
        onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
            setForm((f) => ({ ...f, [key]: e.target.value })),
    });

    const save = async () => {
        setSaveError(null);
        setSaveSuccess(null);
        setSaving(true);
        try {
            const updated = await adminApi.updateSiteSettings(form);
            setForm(toForm(updated));
            setSaveSuccess("تم حفظ إعدادات الموقع بنجاح");
        } catch (err) {
            setSaveError(err instanceof ApiError ? err.message : "تعذر حفظ إعدادات الموقع");
        } finally {
            setSaving(false);
        }
    };

    if (!canManage) {
        return (
            <div>
                <AdminTopbar title="إعدادات الموقع" description="تعديل بيانات التواصل والمعلومات العامة المعروضة للمستخدمين" />
                <div className="card-elevated flex flex-col items-center gap-3 p-14 text-center">
                    <ShieldOff className="h-8 w-8 text-danger" />
                    <p className="text-[13.5px] font-semibold text-[#57655F]">
                        لا تملك صلاحية الوصول إلى إعدادات الموقع — تواصل مع المدير العام إن كنت بحاجة لهذه الصلاحية.
                    </p>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div>
                <AdminTopbar title="إعدادات الموقع" description="تعديل بيانات التواصل والمعلومات العامة المعروضة للمستخدمين" />
                <div className="card-elevated p-14 text-center text-[13.5px] text-muted">جارِ تحميل الإعدادات...</div>
            </div>
        );
    }

    return (
        <div>
            <AdminTopbar title="إعدادات الموقع" description="تعديل بيانات التواصل والروابط والنصوص المعروضة في الواجهة الأمامية للمستخدمين" />

            {loadError && <div className="mb-6 rounded-md bg-danger/10 px-4 py-3 text-[13px] font-semibold text-danger">{loadError}</div>}
            {saveError && <div className="mb-6 rounded-md bg-danger/10 px-4 py-3 text-[13px] font-semibold text-danger">{saveError}</div>}
            {saveSuccess && <div className="mb-6 rounded-md bg-green-100 px-4 py-3 text-[13px] font-semibold text-teal-800">{saveSuccess}</div>}

            <div className="grid gap-6 lg:grid-cols-2">
                <div className="card-elevated card-accent-top p-7">
                    <div className="mb-5 flex items-center gap-2.5">
                        <span
                            className="grid h-9 w-9 place-items-center rounded-xl text-white"
                            style={{ background: "linear-gradient(135deg,#4C9A6A,#1E6B5C)" }}
                        >
                            <Phone className="h-4.5 w-4.5" />
                        </span>
                        <h2 className="font-heading text-lg font-extrabold text-ink">تواصل معنا</h2>
                    </div>

                    <TextField label="رقم الهاتف" dir="ltr" placeholder="9200 12345" {...field("contactPhone")} />
                    <TextField label="رقم واتساب" dir="ltr" placeholder="+966 5xxxxxxxx" {...field("contactWhatsapp")} />
                    <TextField label="البريد الإلكتروني" dir="ltr" placeholder="info@baytak.sa" {...field("contactEmail")} />
                    <TextField label="الموقع الإلكتروني" dir="ltr" placeholder="www.baytak.sa" {...field("websiteUrl")} />
                    <TextField label="العنوان" placeholder="الرياض، المملكة العربية السعودية" {...field("address")} />
                    <TextField label="ساعات العمل" placeholder="السبت – الخميس، 9 صباحًا – 9 مساءً" {...field("workingHours")} />
                </div>

                <div className="card-elevated card-accent-top p-7">
                    <div className="mb-5 flex items-center gap-2.5">
                        <span
                            className="grid h-9 w-9 place-items-center rounded-xl text-white"
                            style={{ background: "linear-gradient(135deg,#BF8A34,#E4B15C)" }}
                        >
                            <Share2 className="h-4.5 w-4.5" />
                        </span>
                        <h2 className="font-heading text-lg font-extrabold text-ink">روابط التواصل الاجتماعي</h2>
                    </div>

                    <TextField label="فيسبوك" dir="ltr" placeholder="https://facebook.com/baytak" {...field("facebookUrl")} />
                    <TextField label="تويتر (X)" dir="ltr" placeholder="https://x.com/baytak" {...field("twitterUrl")} />
                    <TextField label="انستغرام" dir="ltr" placeholder="https://instagram.com/baytak" {...field("instagramUrl")} />
                    <TextField label="تيك توك" dir="ltr" placeholder="https://tiktok.com/@baytak" {...field("tiktokUrl")} />
                </div>

                <div className="card-elevated card-accent-top p-7 lg:col-span-2">
                    <div className="mb-5 flex items-center gap-2.5">
                        <span
                            className="grid h-9 w-9 place-items-center rounded-xl text-white"
                            style={{ background: "linear-gradient(135deg,#2F8F79,#1E6B5C)" }}
                        >
                            <FileText className="h-4.5 w-4.5" />
                        </span>
                        <h2 className="font-heading text-lg font-extrabold text-ink">نصوص عامة</h2>
                    </div>

                    <div className="grid gap-x-6 lg:grid-cols-2">
                        <TextField label="اسم الموقع" {...field("siteName")} />
                        <TextField label="ملاحظة التوفر" placeholder="متوفر في جميع مناطق المملكة" {...field("availabilityNote")} />
                    </div>
                    <TextareaField label="وصف الموقع (يظهر أسفل الشعار في التذييل)" rows={3} {...field("footerDescription")} />
                    <TextField label="نص حقوق النشر" placeholder="© 2026 بيتك. جميع الحقوق محفوظة." {...field("copyrightText")} />

                    <button
                        onClick={save}
                        disabled={saving}
                        className="mt-2 rounded-full px-6 py-2.5 text-[13px] font-bold text-white shadow-[0_10px_22px_-8px_rgba(18,48,46,.45)] transition-transform hover:scale-[1.03] disabled:opacity-60 disabled:hover:scale-100"
                        style={{ background: "linear-gradient(135deg,#2F8F79,#1E6B5C)" }}
                    >
                        {saving ? "جارِ الحفظ..." : "حفظ التعديلات"}
                    </button>
                </div>
            </div>
        </div>
    );
}
"use client";
import { useState } from "react";
import { UserCircle2, KeyRound } from "lucide-react";
import { adminApi, ApiError } from "@/lib/api";
import { useAdminAuthStore } from "@/lib/stores/admin-auth-store";
import { ROLE_LABELS, PERMISSION_LABELS } from "@/lib/permissions";
import { AdminTopbar } from "@/components/layout/AdminTopbar";
import { TextField } from "@/components/ui/FormField";

export default function AdminAccountPage() {
    const { admin, accessToken, setSession } = useAdminAuthStore();

    const [fullName, setFullName] = useState(admin?.fullName ?? "");
    const [profileError, setProfileError] = useState<string | null>(null);
    const [profileSuccess, setProfileSuccess] = useState<string | null>(null);
    const [savingProfile, setSavingProfile] = useState(false);

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
    const [savingPassword, setSavingPassword] = useState(false);

    if (!admin) return null;

    const saveProfile = async () => {
        setProfileError(null);
        setProfileSuccess(null);
        if (!fullName.trim()) {
            setProfileError("يرجى إدخال الاسم الكامل");
            return;
        }
        setSavingProfile(true);
        try {
            const updated = await adminApi.updateMe({ fullName });
            setSession(accessToken!, { ...admin, fullName: updated.fullName });
            setProfileSuccess("تم تحديث بياناتك بنجاح");
        } catch (err) {
            setProfileError(err instanceof ApiError ? err.message : "تعذر تحديث بياناتك");
        } finally {
            setSavingProfile(false);
        }
    };

    const savePassword = async () => {
        setPasswordError(null);
        setPasswordSuccess(null);
        if (newPassword.length < 8) {
            setPasswordError("كلمة المرور الجديدة يجب ألا تقل عن 8 أحرف");
            return;
        }
        if (newPassword !== confirmPassword) {
            setPasswordError("كلمة المرور الجديدة وتأكيدها غير متطابقين");
            return;
        }
        setSavingPassword(true);
        try {
            await adminApi.updateMe({ currentPassword, newPassword });
            setPasswordSuccess("تم تغيير كلمة المرور بنجاح");
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (err) {
            setPasswordError(err instanceof ApiError ? err.message : "تعذر تغيير كلمة المرور — تحقق من كلمة المرور الحالية");
        } finally {
            setSavingPassword(false);
        }
    };

    return (
        <div>
            <AdminTopbar title="حسابي" description="تعديل بياناتك الشخصية وكلمة المرور الخاصة بك" />

            <div className="grid gap-6 lg:grid-cols-2">
                <div className="card-elevated card-accent-top p-7">
                    <div className="mb-5 flex items-center gap-2.5">
                        <span
                            className="grid h-9 w-9 place-items-center rounded-xl text-white"
                            style={{ background: "linear-gradient(135deg,#4C9A6A,#1E6B5C)" }}
                        >
                            <UserCircle2 className="h-4.5 w-4.5" />
                        </span>
                        <h2 className="font-heading text-lg font-extrabold text-ink">البيانات الشخصية</h2>
                    </div>

                    {profileError && <div className="mb-4 rounded-md bg-danger/10 px-4 py-3 text-[13px] font-semibold text-danger">{profileError}</div>}
                    {profileSuccess && <div className="mb-4 rounded-md bg-green-100 px-4 py-3 text-[13px] font-semibold text-teal-800">{profileSuccess}</div>}

                    <TextField label="الاسم الكامل" value={fullName} onChange={(e) => setFullName(e.target.value)} />
                    <TextField label="البريد الإلكتروني" dir="ltr" value={admin.email} disabled className="opacity-60" />

                    <div className="mb-4 rounded-xl bg-sand-50 p-4 text-[12.5px] text-[#57655F]">
                        <div className="mb-1 font-semibold text-ink">{ROLE_LABELS[admin.role]}</div>
                        {admin.role === "super_admin" ? (
                            <span>لديك جميع الصلاحيات في لوحة التحكم.</span>
                        ) : admin.permissions.length ? (
                            <span>الصلاحيات: {admin.permissions.map((p) => PERMISSION_LABELS[p]).join("، ")}</span>
                        ) : (
                            <span>لم يتم منحك أي صلاحيات إضافية بعد — تواصل مع المدير العام.</span>
                        )}
                    </div>

                    <button
                        onClick={saveProfile}
                        disabled={savingProfile}
                        className="rounded-full px-6 py-2.5 text-[13px] font-bold text-white shadow-[0_10px_22px_-8px_rgba(18,48,46,.45)] transition-transform hover:scale-[1.03] disabled:opacity-60 disabled:hover:scale-100"
                        style={{ background: "linear-gradient(135deg,#2F8F79,#1E6B5C)" }}
                    >
                        {savingProfile ? "جارِ الحفظ..." : "حفظ التعديلات"}
                    </button>
                </div>

                <div className="card-elevated card-accent-top p-7">
                    <div className="mb-5 flex items-center gap-2.5">
                        <span
                            className="grid h-9 w-9 place-items-center rounded-xl text-white"
                            style={{ background: "linear-gradient(135deg,#BF8A34,#E4B15C)" }}
                        >
                            <KeyRound className="h-4.5 w-4.5" />
                        </span>
                        <h2 className="font-heading text-lg font-extrabold text-ink">تغيير كلمة المرور</h2>
                    </div>

                    {passwordError && <div className="mb-4 rounded-md bg-danger/10 px-4 py-3 text-[13px] font-semibold text-danger">{passwordError}</div>}
                    {passwordSuccess && <div className="mb-4 rounded-md bg-green-100 px-4 py-3 text-[13px] font-semibold text-teal-800">{passwordSuccess}</div>}

                    <TextField label="كلمة المرور الحالية" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
                    <TextField label="كلمة المرور الجديدة" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="٨ أحرف على الأقل" />
                    <TextField label="تأكيد كلمة المرور الجديدة" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />

                    <button
                        onClick={savePassword}
                        disabled={savingPassword}
                        className="rounded-full px-6 py-2.5 text-[13px] font-bold text-white shadow-[0_10px_22px_-8px_rgba(18,48,46,.45)] transition-transform hover:scale-[1.03] disabled:opacity-60 disabled:hover:scale-100"
                        style={{ background: "linear-gradient(135deg,#2F8F79,#1E6B5C)" }}
                    >
                        {savingPassword ? "جارِ الحفظ..." : "تغيير كلمة المرور"}
                    </button>
                </div>
            </div>
        </div>
    );
}

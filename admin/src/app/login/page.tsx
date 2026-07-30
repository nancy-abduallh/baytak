"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ShieldCheck, Mail, Lock } from "lucide-react";
import { adminApi, ApiError } from "@/lib/api";
import { useAdminAuthStore } from "@/lib/stores/admin-auth-store";

const schema = z.object({
    email: z.string().email("أدخل بريدًا إلكترونيًا صحيحًا"),
    password: z.string().min(8, "كلمة المرور يجب ألا تقل عن 8 أحرف"),
});
type FormValues = z.infer<typeof schema>;

export default function AdminLoginPage() {
    const router = useRouter();
    const setSession = useAdminAuthStore((s) => s.setSession);
    const [serverError, setServerError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({ resolver: zodResolver(schema) });

    const onSubmit = async (values: FormValues) => {
        setServerError(null);
        setSubmitting(true);
        try {
            const { accessToken, admin } = await adminApi.login(values);
            setSession(accessToken, admin);
            router.replace("/");
        } catch (err) {
            setServerError(err instanceof ApiError ? err.message : "تعذر تسجيل الدخول، تحقق من البيانات");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <main className="mx-auto flex min-h-screen max-w-[420px] flex-col justify-center px-6">
            <div className="mb-8 text-center">
                <span className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-teal-900">
                    <ShieldCheck className="h-6 w-6 text-green-500" />
                </span>
                <h1 className="font-heading text-2xl font-extrabold">لوحة تحكم بيتك</h1>
                <p className="mt-1.5 text-[13.5px] text-[#63756F]">هذه اللوحة مخصصة لفريق العمليات — للعملاء الرجاء زيارة الموقع الرئيسي</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="rounded-md border border-line bg-white p-7 shadow-card">
                {serverError && <div className="mb-5 rounded-md bg-danger/10 px-4 py-3 text-[13px] font-semibold text-danger">{serverError}</div>}

                <label className="mb-1.5 block text-[13px] font-semibold text-[#57655F]">البريد الإلكتروني</label>
                <div className="mb-1 flex items-center gap-2 rounded-md border border-line px-3.5 py-3">
                    <Mail className="h-4 w-4 text-[#8A9691]" />
                    <input {...register("email")} placeholder="admin@baytak.sa" className="w-full text-sm outline-none" dir="ltr" />
                </div>
                {errors.email && <p className="mb-3 text-[12px] text-danger">{errors.email.message}</p>}

                <label className="mb-1.5 mt-4 block text-[13px] font-semibold text-[#57655F]">كلمة المرور</label>
                <div className="mb-1 flex items-center gap-2 rounded-md border border-line px-3.5 py-3">
                    <Lock className="h-4 w-4 text-[#8A9691]" />
                    <input {...register("password")} type="password" placeholder="••••••••" className="w-full text-sm outline-none" />
                </div>
                {errors.password && <p className="mb-3 text-[12px] text-danger">{errors.password.message}</p>}

                <button
                    type="submit"
                    className="mt-5 w-full rounded-full bg-ink py-3.5 text-[14px] font-bold text-white transition hover:bg-teal-900 disabled:opacity-60"
                    disabled={submitting}
                >
                    {submitting ? "جارِ الدخول..." : "تسجيل الدخول"}
                </button>
            </form>

            <p className="mt-6 text-center text-[12px] text-[#8A9691]">
                هذا الدخول محصور بفريق بيتك الإداري فقط · جميع محاولات الدخول مسجّلة
            </p>
        </main>
    );
}
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ShieldCheck, Mail, Lock, Sparkles } from "lucide-react";
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
        <main className="grid min-h-screen lg:grid-cols-2">
            {/* Brand panel */}
            <div
                className="relative hidden flex-col justify-between overflow-hidden p-12 text-white lg:flex"
                style={{ background: "linear-gradient(200deg,#0F332F 0%,#123B37 45%,#175249 100%)" }}
            >
                <div
                    className="pointer-events-none absolute inset-0 opacity-50"
                    style={{
                        background:
                            "radial-gradient(circle at 90% 10%, rgba(76,154,106,.3), transparent 45%), radial-gradient(circle at 10% 90%, rgba(191,138,52,.2), transparent 45%)",
                    }}
                />
                <div className="relative flex items-center gap-3">
                    <span
                        className="icon-badge-glow grid h-11 w-11 place-items-center rounded-2xl"
                        style={{ background: "linear-gradient(135deg,#4C9A6A,#1E6B5C)", ["--glow-color" as any]: "rgba(76,154,106,.5)" }}
                    >
                        <ShieldCheck className="h-5 w-5 text-white" />
                    </span>
                    <span className="font-heading text-lg font-extrabold">بيتك</span>
                </div>

                <div className="relative">
                    <div className="mb-3 flex items-center gap-2 text-[12px] font-bold text-[#9FC2B7]">
                        <Sparkles className="h-3.5 w-3.5" /> لوحة التحكم الإدارية
                    </div>
                    <h1 className="font-heading text-[32px] font-extrabold leading-tight">
                        كل بياناتك التشغيلية،
                        <br /> في مكان واحد أنيق.
                    </h1>
                    <p className="mt-4 max-w-sm text-[13.5px] leading-relaxed text-[#BFD8D0]">
                        تابع الطلبات والفنيين والإيرادات لحظة بلحظة، واتخذ قرارات أسرع باستخدام لوحة تحكم مصممة خصيصًا لفريق عمليات بيتك.
                    </p>
                </div>

                <p className="relative text-[12px] text-[#9FC2B7]">© {new Date().getFullYear()} بيتك — جميع الحقوق محفوظة</p>
            </div>

            {/* Form panel */}
            <div className="mesh-bg flex items-center justify-center px-6 py-12">
                <div className="w-full max-w-[420px]">
                    <div className="mb-8 text-center lg:hidden">
                        <span
                            className="icon-badge-glow mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl"
                            style={{ background: "linear-gradient(135deg,#4C9A6A,#1E6B5C)", ["--glow-color" as any]: "rgba(76,154,106,.5)" }}
                        >
                            <ShieldCheck className="h-6 w-6 text-white" />
                        </span>
                        <h1 className="font-heading text-2xl font-extrabold text-ink">لوحة تحكم بيتك</h1>
                    </div>

                    <div className="mb-6 hidden text-center lg:block">
                        <h2 className="font-heading text-2xl font-extrabold text-ink">تسجيل الدخول</h2>
                        <p className="mt-1.5 text-[13.5px] text-[#63756F]">
                            هذه اللوحة مخصصة لفريق العمليات — للعملاء الرجاء زيارة الموقع الرئيسي
                        </p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="card-elevated card-accent-top p-7">
                        {serverError && <div className="mb-5 rounded-md bg-danger/10 px-4 py-3 text-[13px] font-semibold text-danger">{serverError}</div>}

                        <label className="mb-1.5 block text-[13px] font-semibold text-[#57655F]">البريد الإلكتروني</label>
                        <div className="mb-1 flex items-center gap-2 rounded-xl border border-line px-3.5 py-3 transition-shadow focus-within:border-teal-700 focus-within:shadow-[0_0_0_4px_rgba(30,107,92,.12)]">
                            <Mail className="h-4 w-4 text-muted" />
                            <input {...register("email")} placeholder="admin@baytak.sa" className="w-full text-sm outline-none" dir="ltr" />
                        </div>
                        {errors.email && <p className="mb-3 text-[12px] text-danger">{errors.email.message}</p>}

                        <label className="mb-1.5 mt-4 block text-[13px] font-semibold text-[#57655F]">كلمة المرور</label>
                        <div className="mb-1 flex items-center gap-2 rounded-xl border border-line px-3.5 py-3 transition-shadow focus-within:border-teal-700 focus-within:shadow-[0_0_0_4px_rgba(30,107,92,.12)]">
                            <Lock className="h-4 w-4 text-muted" />
                            <input {...register("password")} type="password" placeholder="••••••••" className="w-full text-sm outline-none" />
                        </div>
                        {errors.password && <p className="mb-3 text-[12px] text-danger">{errors.password.message}</p>}

                        <button
                            type="submit"
                            className="mt-5 w-full rounded-full py-3.5 text-[14px] font-bold text-white shadow-[0_14px_30px_-10px_rgba(18,48,46,.55)] transition-transform hover:scale-[1.015] disabled:opacity-60 disabled:hover:scale-100"
                            style={{ background: "linear-gradient(135deg,#12302E,#1E6B5C)" }}
                            disabled={submitting}
                        >
                            {submitting ? "جارِ الدخول..." : "تسجيل الدخول"}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-[12px] text-muted">
                        هذا الدخول محصور بفريق بيتك الإداري فقط · جميع محاولات الدخول مسجّلة
                    </p>
                </div>
            </div>
        </main>
    );
}
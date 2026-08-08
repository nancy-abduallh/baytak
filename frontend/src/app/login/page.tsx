"use client";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Home, Lock, Phone } from "lucide-react";
import { api, ApiError } from "@/lib/api";
import { useAuthStore } from "@/lib/stores/auth-store";
import { Button } from "@/components/ui/Button";

const schema = z.object({
    phone: z.string().regex(/^05\d{8}$/, "أدخل رقم جوال سعودي صحيح (05xxxxxxxx)"),
    password: z.string().min(8, "كلمة المرور يجب ألا تقل عن 8 أحرف"),
});
type FormValues = z.infer<typeof schema>;

export default function LoginPage() {
    return (
        <Suspense>
            <LoginForm />
        </Suspense>
    );
}

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const setSession = useAuthStore((s) => s.setSession);
    const [serverError, setServerError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({ resolver: zodResolver(schema) });

    const onSubmit = async (values: FormValues) => {
        setServerError(null);
        setSubmitting(true);
        try {
            const session = await api.login(values);
            setSession(session);
            router.replace(searchParams.get("redirect") ?? "/dashboard/orders");
        } catch (err) {
            setServerError(err instanceof ApiError ? err.message : "تعذر تسجيل الدخول، حاول مرة أخرى");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <main className="mx-auto flex min-h-[calc(100vh-78px)] w-full max-w-[440px] flex-col justify-center px-4 py-10 sm:px-6 sm:py-16">
            <div className="mb-8 text-center">
                <span className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-green-500">
                    <Home className="h-6 w-6 text-teal-900" />
                </span>
                <h1 className="font-heading text-2xl font-extrabold">تسجيل الدخول إلى بيتك</h1>
                <p className="mt-1.5 text-[13.5px] text-[#63756F]">أدخل رقم جوالك وكلمة المرور للمتابعة</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="rounded-md border border-line bg-white p-5 sm:p-7">
                {serverError && <div className="mb-5 rounded-md bg-danger/10 px-4 py-3 text-[13px] font-semibold text-danger">{serverError}</div>}

                <label className="mb-1.5 block text-[13px] font-semibold text-[#57655F]">رقم الجوال</label>
                <div className="mb-1 flex items-center gap-2 rounded-md border border-line px-3.5 py-3">
                    <Phone className="h-4 w-4 text-[#8A9691]" />
                    <input {...register("phone")} placeholder="05xxxxxxxx" className="w-full text-sm outline-none" dir="ltr" />
                </div>
                {errors.phone && <p className="mb-3 text-[12px] text-danger">{errors.phone.message}</p>}

                <label className="mb-1.5 mt-4 block text-[13px] font-semibold text-[#57655F]">كلمة المرور</label>
                <div className="mb-1 flex items-center gap-2 rounded-md border border-line px-3.5 py-3">
                    <Lock className="h-4 w-4 text-[#8A9691]" />
                    <input {...register("password")} type="password" placeholder="••••••••" className="w-full text-sm outline-none" />
                </div>
                {errors.password && <p className="mb-3 text-[12px] text-danger">{errors.password.message}</p>}

                <Button type="submit" variant="dark" className="mt-5 w-full justify-center">
                    {submitting ? "جارِ الدخول..." : "تسجيل الدخول"}
                </Button>

                <p className="mt-5 text-center text-[13px] text-[#63756F]">
                    ليس لديك حساب؟ <Link href="/register" className="font-bold text-teal-700">إنشاء حساب جديد</Link>
                </p>
            </form>
        </main>
    );
}
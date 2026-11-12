import type { Metadata } from "next";
import { RegisterFormClient } from "@/components/auth/RegisterFormClient";

export const metadata: Metadata = {
    title: "إنشاء حساب جديد",
    description: "سجّل حسابك في منصة بيتك لطلب ومتابعة خدمات صيانة وتشغيل المنازل بالمملكة.",
    robots: {
        index: false,
        follow: false,
    },
};

export default function RegisterPage() {
    return <RegisterFormClient />;
}

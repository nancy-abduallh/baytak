import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginFormClient } from "@/components/auth/LoginFormClient";

export const metadata: Metadata = {
    title: "تسجيل الدخول",
    description: "تسجيل الدخول إلى حسابك في منصة بيتك لخدمات صيانة وتشغيل المنازل بالمملكة.",
    robots: {
        index: false,
        follow: false,
    },
};

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="grid min-h-[60vh] place-items-center text-sm text-[#8A9691]">جارِ التحميل...</div>}>
            <LoginFormClient />
        </Suspense>
    );
}

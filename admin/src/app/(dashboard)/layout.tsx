"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuthStore } from "@/lib/stores/admin-auth-store";
import { AdminSidebar } from "@/components/layout/AdminSidebar";

export default function DashboardShellLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const { accessToken, hasHydrated } = useAdminAuthStore();

    useEffect(() => {
        if (hasHydrated && !accessToken) router.replace("/login");
    }, [hasHydrated, accessToken, router]);

    if (!hasHydrated || !accessToken) {
        return <main className="grid min-h-screen place-items-center text-[13.5px] text-[#8A9691]">جارِ التحقق من صلاحية الدخول...</main>;
    }

    return (
        <div className="flex min-h-screen bg-sand-50">
            <AdminSidebar />
            <main className="mesh-bg flex-1 px-9 py-8">{children}</main>
        </div>
    );
}
"use client";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/lib/stores/auth-store";
import { SidebarNav } from "@/components/dashboard/SidebarNav";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const { user, accessToken, hasHydrated } = useAuthStore();

    useEffect(() => {
        if (hasHydrated && !accessToken) router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    }, [hasHydrated, accessToken, pathname, router]);

    if (!hasHydrated || !accessToken || !user) {
        return <main className="grid min-h-[60vh] place-items-center text-[13.5px] text-[#8A9691]">جارِ التحقق من جلسة الدخول...</main>;
    }

    return (
        <main className="mx-auto grid max-w-[1360px] grid-cols-1 gap-5 px-4 py-6 sm:px-6 md:grid-cols-[250px_1fr] md:gap-7 md:px-10 md:py-9">
            <SidebarNav user={user} />
            <div>{children}</div>
        </main>
    );
}
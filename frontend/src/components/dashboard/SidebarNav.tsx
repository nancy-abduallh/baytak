"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import clsx from "clsx";
import { ListChecks, User, Heart, CreditCard, Settings, LogOut } from "lucide-react";
import { User as UserType } from "@/lib/types";
import { useAuthStore } from "@/lib/stores/auth-store";
import { api } from "@/lib/api";
import { getInitials } from "@/lib/utils";

const NAV = [
    { href: "/dashboard/orders", label: "طلباتي", icon: ListChecks },
    { href: "/dashboard/account", label: "حسابي", icon: User },
    { href: "/dashboard/favorites", label: "المفضلة", icon: Heart },
    // { href: "/dashboard/payment-methods", label: "طرق الدفع", icon: CreditCard },
];

export function SidebarNav({ user }: { user: UserType }) {
    const pathname = usePathname();
    const router = useRouter();
    const clearSession = useAuthStore((s) => s.clearSession);

    const handleLogout = async () => {
        await api.logout();
        clearSession();
        router.push("/");
    };

    return (
        <aside className="h-fit rounded-md border border-line bg-white p-5 lg:sticky lg:top-[100px]">
            <div className="mb-4 flex items-center gap-3 border-b border-line pb-5">
                <div className="grid h-[46px] w-[46px] place-items-center rounded-full bg-gold-500 font-bold text-white">{getInitials(user.fullName)}</div>
                <div>
                    <h5 className="text-[14.5px] font-bold">{user.fullName}</h5>
                    <p className="text-xs text-[#8A9691]">{user.city ?? "—"}، {user.district ?? "—"}</p>
                </div>
            </div>

            <nav className="space-y-0.5">
                {NAV.map(({ href, label, icon: Icon }) => {
                    const active = pathname.startsWith(href);
                    return (
                        <Link key={href} href={href} className={clsx("flex items-center gap-3 rounded-[10px] px-3 py-3 text-sm font-semibold", active ? "bg-green-100 text-teal-800" : "text-[#57655F] hover:bg-sand-100")}>
                            <Icon className="h-[18px] w-[18px]" /> {label}
                        </Link>
                    );
                })}
                <div className="my-2 border-t border-line" />
                <Link href="/dashboard/settings" className={clsx("flex items-center gap-3 rounded-[10px] px-3 py-3 text-sm font-semibold", pathname.startsWith("/dashboard/settings") ? "bg-green-100 text-teal-800" : "text-[#57655F] hover:bg-sand-100")}>
                    <Settings className="h-[18px] w-[18px]" /> الإعدادات
                </Link>
                <button onClick={handleLogout} className="flex w-full items-center gap-3 rounded-[10px] px-3 py-3 text-sm font-semibold text-danger hover:bg-danger/5">
                    <LogOut className="h-[18px] w-[18px]" /> تسجيل الخروج
                </button>
            </nav>
        </aside>
    );
}
"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import clsx from "clsx";
import { LayoutDashboard, ClipboardList, Wrench, Users, ListTree, LogOut, ShieldCheck } from "lucide-react";
import { useAdminAuthStore } from "@/lib/stores/admin-auth-store";

const NAV = [
    { href: "/", label: "نظرة عامة", icon: LayoutDashboard, exact: true },
    { href: "/orders", label: "الطلبات", icon: ClipboardList },
    { href: "/technicians", label: "الفنيون", icon: Wrench },
    { href: "/users", label: "المستخدمون", icon: Users },
    { href: "/categories", label: "فئات الخدمة", icon: ListTree },
];

export function AdminSidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const { admin, clearSession } = useAdminAuthStore();

    const handleLogout = () => {
        clearSession();
        router.replace("/login");
    };

    return (
        <aside className="sticky top-0 flex h-screen w-[250px] flex-none flex-col border-e border-line bg-teal-900 px-4 py-6">
            <div className="mb-8 flex items-center gap-3 px-2">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-green-500">
                    <ShieldCheck className="h-5 w-5 text-teal-900" />
                </span>
                <div className="leading-tight">
                    <div className="font-heading text-[15px] font-extrabold text-white">بيتك</div>
                    <div className="text-[11px] text-[#9FC2B7]">لوحة التحكم</div>
                </div>
            </div>

            <nav className="flex-1 space-y-1">
                {NAV.map(({ href, label, icon: Icon, exact }) => {
                    const active = exact ? pathname === href : pathname.startsWith(href);
                    return (
                        <Link
                            key={href}
                            href={href}
                            className={clsx(
                                "flex items-center gap-3 rounded-[10px] px-3 py-3 text-[13.5px] font-semibold transition",
                                active ? "bg-green-500 text-white" : "text-[#BFD8D0] hover:bg-white/[.06] hover:text-white"
                            )}
                        >
                            <Icon className="h-[18px] w-[18px]" /> {label}
                        </Link>
                    );
                })}
            </nav>

            <div className="mt-4 border-t border-white/10 pt-4">
                <div className="mb-3 flex items-center gap-3 px-2">
                    <div className="grid h-9 w-9 place-items-center rounded-full bg-gold-500 text-xs font-bold text-white">
                        {admin?.fullName?.slice(0, 2) ?? "؟"}
                    </div>
                    <div className="leading-tight">
                        <div className="text-[13px] font-semibold text-white">{admin?.fullName ?? "—"}</div>
                        <div className="text-[11px] text-[#9FC2B7]">{roleLabel(admin?.role)}</div>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-[10px] px-3 py-3 text-[13.5px] font-semibold text-[#E7B3A8] hover:bg-danger/10"
                >
                    <LogOut className="h-[18px] w-[18px]" /> تسجيل الخروج
                </button>
            </div>
        </aside>
    );
}

function roleLabel(role?: string) {
    switch (role) {
        case "super_admin": return "مدير عام";
        case "operations": return "فريق العمليات";
        case "support": return "فريق الدعم";
        default: return "—";
    }
}
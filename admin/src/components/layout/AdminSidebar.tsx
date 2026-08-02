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
        <aside
            className="sticky top-0 flex h-screen w-[260px] flex-none flex-col overflow-hidden px-4 py-6 text-white"
            style={{ background: "linear-gradient(190deg,#0F332F 0%,#123B37 45%,#175249 100%)" }}
        >
            <div
                className="pointer-events-none absolute inset-0 opacity-40"
                style={{
                    background:
                        "radial-gradient(circle at 100% 0%, rgba(76,154,106,.25), transparent 45%), radial-gradient(circle at 0% 100%, rgba(191,138,52,.15), transparent 40%)",
                }}
            />

            <div className="relative mb-8 flex items-center gap-3 px-2">
                <span
                    className="icon-badge-glow grid h-11 w-11 place-items-center rounded-2xl"
                    style={{ background: "linear-gradient(135deg,#4C9A6A,#1E6B5C)", ["--glow-color" as any]: "rgba(76,154,106,.5)" }}
                >
                    <ShieldCheck className="h-5 w-5 text-white" />
                </span>
                <div className="leading-tight">
                    <div className="font-heading text-[16px] font-extrabold text-white">بيتك</div>
                    <div className="text-[11px] text-[#9FC2B7]">لوحة التحكم</div>
                </div>
            </div>

            <nav className="relative flex-1 space-y-1.5">
                {NAV.map(({ href, label, icon: Icon, exact }) => {
                    const active = exact ? pathname === href : pathname.startsWith(href);
                    return (
                        <Link
                            key={href}
                            href={href}
                            className={clsx(
                                "flex items-center gap-3 rounded-[12px] px-3.5 py-3 text-[13.5px] font-semibold transition-all",
                                active
                                    ? "text-white shadow-[0_8px_20px_-6px_rgba(76,154,106,.55)]"
                                    : "text-[#BFD8D0] hover:bg-white/[.07] hover:text-white",
                            )}
                            style={active ? { background: "linear-gradient(135deg,#4C9A6A,#1E6B5C)" } : undefined}
                        >
                            <Icon className="h-[18px] w-[18px]" /> {label}
                        </Link>
                    );
                })}
            </nav>

            <div className="relative mt-4 border-t border-white/10 pt-4">
                <div className="mb-3 flex items-center gap-3 px-2">
                    <div
                        className="grid h-10 w-10 place-items-center rounded-full text-xs font-bold text-white shadow-[0_6px_16px_-4px_rgba(191,138,52,.6)]"
                        style={{ background: "linear-gradient(135deg,#BF8A34,#E4B15C)" }}
                    >
                        {admin?.fullName?.slice(0, 2) ?? "؟"}
                    </div>
                    <div className="leading-tight">
                        <div className="text-[13px] font-semibold text-white">{admin?.fullName ?? "—"}</div>
                        <div className="text-[11px] text-[#9FC2B7]">{roleLabel(admin?.role)}</div>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-[12px] px-3.5 py-3 text-[13.5px] font-semibold text-[#E7B3A8] transition hover:bg-danger/15"
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
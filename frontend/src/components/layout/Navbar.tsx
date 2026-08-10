"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import clsx from "clsx";
import { Bell, LogOut, Menu, X } from "lucide-react";
import { useAuthStore } from "@/lib/stores/auth-store";
import { api } from "@/lib/api";
import { getInitials } from "@/lib/utils";

const TABS = [
    { href: "/", label: "الرئيسية" },
    { href: "/services", label: "الخدمات والحجز" },
    { href: "/dashboard/orders", label: "طلباتي" },
];

export function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    const { user, accessToken, clearSession } = useAuthStore();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [lastPathname, setLastPathname] = useState(pathname);

    // Close the mobile menu whenever the route changes (derived during render,
    // avoids a setState-in-effect cascading render).
    if (pathname !== lastPathname) {
        setLastPathname(pathname);
        if (mobileOpen) setMobileOpen(false);
    }

    const handleLogout = async () => {
        await api.logout();
        clearSession();
        router.push("/");
        setMobileOpen(false);
    };

    return (
        <nav className="sticky top-0 z-20 bg-teal-900 px-5 lg:px-10">
            <div className="flex h-[64px] items-center justify-between lg:h-[78px]">
                <Link href="/" className="flex items-center gap-2.5 lg:gap-3">
                    <span className="relative h-9 w-9 flex-none overflow-hidden rounded-2xl lg:h-10 lg:w-10">
                        <Image src="/logo.png" alt="بيتك" fill sizes="40px" className="object-cover" priority />
                    </span>
                    <span className="leading-tight">
                        <span className="block font-heading text-lg font-black text-white lg:text-xl">بيتك</span>
                        <span className="hidden text-[11px] tracking-wide text-[#9FC2B7] sm:block">صيانة وتشغيل · من بلدي</span>
                    </span>
                </Link>

                {/* Desktop tab pills — unchanged from original, hidden on mobile */}
                <div className="hidden items-center gap-1 rounded-full bg-white/5 p-1.5 lg:flex">
                    {TABS.map((tab) => {
                        const active = tab.href === "/" ? pathname === "/" : pathname.startsWith(tab.href);
                        return (
                            <Link
                                key={tab.href}
                                href={tab.href}
                                className={clsx("rounded-full px-5 py-2.5 text-[14.5px] font-semibold transition", active ? "bg-green-500 text-white" : "text-[#BFD8D0] hover:text-white")}
                            >
                                {tab.label}
                            </Link>
                        );
                    })}
                </div>

                {/* Desktop right-side actions — unchanged from original, hidden on mobile */}
                <div className="hidden items-center gap-3.5 lg:flex">
                    <button className="grid h-10 w-10 place-items-center rounded-full bg-white/[.07] text-[#DCE9E4]">
                        <Bell className="h-[18px] w-[18px]" />
                    </button>

                    {accessToken && user ? (
                        <div className="flex items-center gap-2">
                            <Link href="/dashboard/account" className="flex items-center gap-2.5 rounded-full bg-white/[.07] py-1.5 ps-3.5 pe-1.5">
                                <span className="text-[13.5px] font-semibold text-white">{user.fullName}</span>
                                <span className="grid h-7 w-7 place-items-center rounded-full bg-gold-500 text-xs font-bold text-white">{getInitials(user.fullName)}</span>
                            </Link>
                            <button onClick={handleLogout} title="تسجيل الخروج" className="grid h-9 w-9 place-items-center rounded-full bg-white/[.07] text-[#DCE9E4]">
                                <LogOut className="h-4 w-4" />
                            </button>
                        </div>
                    ) : (
                        <Link href="/login" className="rounded-full bg-gold-500 px-5 py-2.5 text-[13.5px] font-bold text-white">
                            تسجيل الدخول
                        </Link>
                    )}
                </div>

                {/* Mobile actions: bell + hamburger toggle */}
                <div className="flex items-center gap-2 lg:hidden">
                    <button className="grid h-9 w-9 place-items-center rounded-full bg-white/[.07] text-[#DCE9E4]">
                        <Bell className="h-4 w-4" />
                    </button>
                    <button
                        onClick={() => setMobileOpen((v) => !v)}
                        aria-label={mobileOpen ? "إغلاق القائمة" : "فتح القائمة"}
                        aria-expanded={mobileOpen}
                        className="grid h-9 w-9 place-items-center rounded-full bg-white/[.07] text-white"
                    >
                        {mobileOpen ? <X className="h-4.5 w-4.5" /> : <Menu className="h-4.5 w-4.5" />}
                    </button>
                </div>
            </div>

            {/* Mobile dropdown menu */}
            {mobileOpen && (
                <div className="border-t border-white/10 pb-5 pt-4 lg:hidden">
                    <div className="flex flex-col gap-1.5">
                        {TABS.map((tab) => {
                            const active = tab.href === "/" ? pathname === "/" : pathname.startsWith(tab.href);
                            return (
                                <Link
                                    key={tab.href}
                                    href={tab.href}
                                    className={clsx(
                                        "rounded-xl px-4 py-3 text-[14.5px] font-semibold transition",
                                        active ? "bg-green-500 text-white" : "text-[#BFD8D0] hover:bg-white/5 hover:text-white"
                                    )}
                                >
                                    {tab.label}
                                </Link>
                            );
                        })}
                    </div>

                    <div className="mt-4 border-t border-white/10 pt-4">
                        {accessToken && user ? (
                            <div className="flex flex-col gap-2.5">
                                <Link href="/dashboard/account" className="flex items-center gap-2.5 rounded-xl bg-white/[.07] px-3.5 py-2.5">
                                    <span className="grid h-8 w-8 flex-none place-items-center rounded-full bg-gold-500 text-xs font-bold text-white">{getInitials(user.fullName)}</span>
                                    <span className="text-[13.5px] font-semibold text-white">{user.fullName}</span>
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center justify-center gap-2 rounded-xl bg-white/[.07] px-3.5 py-3 text-[13.5px] font-semibold text-[#DCE9E4]"
                                >
                                    <LogOut className="h-4 w-4" /> تسجيل الخروج
                                </button>
                            </div>
                        ) : (
                            <Link
                                href="/login"
                                className="block rounded-xl bg-gold-500 px-5 py-3 text-center text-[13.5px] font-bold text-white"
                            >
                                تسجيل الدخول
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
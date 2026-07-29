"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { Bell, Home } from "lucide-react";

const TABS = [
    { href: "/", label: "الرئيسية" },
    { href: "/services/electrical", label: "الخدمات والحجز" },
    { href: "/dashboard/orders", label: "طلباتي" },
];

export function Navbar() {
    const pathname = usePathname();

    return (
        <nav className="sticky top-0 z-20 flex h-[78px] items-center justify-between bg-teal-900 px-10">
            <Link href="/" className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-green-500">
                    <Home className="h-5 w-5 text-teal-900" />
                </span>
                <span className="leading-tight">
                    <span className="block font-heading text-xl font-black text-white">بيتك</span>
                    <span className="block text-[11px] tracking-wide text-[#9FC2B7]">صيانة وتشغيل · من بلدي</span>
                </span>
            </Link>

            <div className="flex items-center gap-1 rounded-full bg-white/5 p-1.5">
                {TABS.map((tab) => {
                    const active = tab.href === "/" ? pathname === "/" : pathname.startsWith(`/${tab.href.split("/")[1]}`);
                    return (
                        <Link
                            key={tab.href}
                            href={tab.href}
                            className={clsx(
                                "rounded-full px-5 py-2.5 text-[14.5px] font-semibold transition",
                                active ? "bg-green-500 text-white" : "text-[#BFD8D0] hover:text-white"
                            )}
                        >
                            {tab.label}
                        </Link>
                    );
                })}
            </div>

            <div className="flex items-center gap-3.5">
                <button className="grid h-10 w-10 place-items-center rounded-full bg-white/[.07] text-[#DCE9E4]">
                    <Bell className="h-[18px] w-[18px]" />
                </button>
                <Link href="/dashboard/orders" className="flex items-center gap-2.5 rounded-full bg-white/[.07] py-1.5 ps-3.5 pe-1.5">
                    <span className="text-[13.5px] font-semibold text-white">أحمد محمد</span>
                    <span className="grid h-7 w-7 place-items-center rounded-full bg-gold-500 text-xs font-bold text-white">أح</span>
                </Link>
            </div>
        </nav>
    );
}
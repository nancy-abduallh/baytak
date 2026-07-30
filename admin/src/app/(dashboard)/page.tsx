"use client";
import { useEffect, useState } from "react";
import { ClipboardList, Wrench, Wallet, UserCheck, ShieldAlert, UserPlus } from "lucide-react";
import { adminApi } from "@/lib/api";
import { DashboardStats } from "@/lib/types";
import { AdminTopbar } from "@/components/layout/AdminTopbar";
import { StatCard } from "@/components/dashboard/StatCard";

// Mock fallback so the dashboard is reviewable before /admin/stats exists on the backend.
const MOCK_STATS: DashboardStats = {
    ordersToday: 18,
    ordersInProgress: 7,
    revenueThisMonth: 42500,
    activeTechnicians: 214,
    pendingVerifications: 6,
    newUsersThisWeek: 33,
};

export default function AdminOverviewPage() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [isMock, setIsMock] = useState(false);

    useEffect(() => {
        adminApi.getStats()
            .then(setStats)
            .catch(() => { setStats(MOCK_STATS); setIsMock(true); });
    }, []);

    return (
        <div>
            <AdminTopbar title="نظرة عامة" description="ملخص أداء المنصة اليوم" />

            {isMock && (
                <div className="mb-6 rounded-md border border-gold-500/30 bg-gold-100/50 px-5 py-3 text-[13px] font-semibold text-[#8A6417]">
                    تعذر الاتصال بنقطة /admin/stats — يتم عرض بيانات تجريبية إلى حين بناء نقاط النهاية الإدارية في الخادم الخلفي.
                </div>
            )}

            {!stats ? (
                <div className="rounded-md border border-line bg-white p-10 text-center text-[13.5px] text-[#8A9691]">جارِ التحميل...</div>
            ) : (
                <div className="grid grid-cols-3 gap-5">
                    <StatCard icon={ClipboardList} label="طلبات اليوم" value={stats.ordersToday} tone="teal" />
                    <StatCard icon={Wrench} label="طلبات قيد التنفيذ" value={stats.ordersInProgress} tone="gold" />
                    <StatCard icon={Wallet} label="إيرادات هذا الشهر" value={`${stats.revenueThisMonth.toLocaleString()} ر.س`} tone="green" />
                    <StatCard icon={UserCheck} label="فنيون نشطون" value={stats.activeTechnicians} tone="teal" />
                    <StatCard icon={ShieldAlert} label="بانتظار التحقق" value={stats.pendingVerifications} tone="danger" />
                    <StatCard icon={UserPlus} label="مستخدمون جدد هذا الأسبوع" value={stats.newUsersThisWeek} tone="green" />
                </div>
            )}
        </div>
    );
}
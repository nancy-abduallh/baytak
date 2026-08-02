"use client";
import { useEffect, useMemo, useState } from "react";
import {
    ClipboardList, Wrench, Wallet, UserCheck, ShieldAlert, UserPlus,
} from "lucide-react";
import {
    ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
    BarChart, Bar, PieChart, Pie, Cell, Legend,
} from "recharts";
import { adminApi } from "@/lib/api";
import { DashboardAnalytics, DashboardStats, OrderStatus } from "@/lib/types";
import { AdminTopbar } from "@/components/layout/AdminTopbar";
import { StatCard } from "@/components/dashboard/StatCard";
import { ChartCard } from "@/components/dashboard/ChartCard";

// Mock fallback so the dashboard is reviewable even if the backend/DB is unreachable.
const MOCK_STATS: DashboardStats = {
    ordersToday: 18,
    ordersInProgress: 7,
    revenueThisMonth: 42500,
    activeTechnicians: 214,
    pendingVerifications: 6,
    newUsersThisWeek: 33,
};

const MOCK_ANALYTICS: DashboardAnalytics = {
    ordersLast14Days: Array.from({ length: 14 }).map((_, i) => ({
        date: `2026-07-${String(19 + i).padStart(2, "0")}`,
        orders: Math.round(8 + Math.random() * 20),
    })),
    ordersByStatus: [
        { status: "pending", count: 12 },
        { status: "confirmed", count: 9 },
        { status: "in_progress", count: 7 },
        { status: "completed", count: 154 },
        { status: "cancelled", count: 6 },
    ],
    topCategories: [
        { label: "كهرباء", count: 132 },
        { label: "سباكة", count: 108 },
        { label: "تكييف", count: 94 },
        { label: "دهانات", count: 51 },
        { label: "نظافة", count: 40 },
        { label: "نجارة", count: 22 },
    ],
    revenueLast6Months: Array.from({ length: 6 }).map((_, i) => ({
        month: `2026-${String(2 + i).padStart(2, "0")}`,
        revenue: Math.round(20000 + Math.random() * 30000),
        orders: Math.round(60 + Math.random() * 80),
    })),
};

const STATUS_LABEL: Record<OrderStatus, string> = {
    pending: "جديد",
    confirmed: "مؤكد",
    in_progress: "قيد التنفيذ",
    completed: "مكتمل",
    cancelled: "ملغي",
};

const STATUS_COLOR: Record<OrderStatus, string> = {
    pending: "#3B6B7D",
    confirmed: "#7C9CB0",
    in_progress: "#BF8A34",
    completed: "#4C9A6A",
    cancelled: "#B24B3C",
};

const MONTH_LABEL = (key: string) => {
    const [, month] = key.split("-");
    const names = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];
    return names[parseInt(month, 10) - 1] ?? key;
};

const DAY_LABEL = (key: string) => {
    const [, month, day] = key.split("-");
    return `${day}/${month}`;
};

export default function AdminOverviewPage() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [analytics, setAnalytics] = useState<DashboardAnalytics | null>(null);
    const [isMock, setIsMock] = useState(false);

    useEffect(() => {
        Promise.all([adminApi.getStats(), adminApi.getAnalytics()])
            .then(([s, a]) => { setStats(s); setAnalytics(a); })
            .catch(() => { setStats(MOCK_STATS); setAnalytics(MOCK_ANALYTICS); setIsMock(true); });
    }, []);

    const ordersChartData = useMemo(
        () => (analytics?.ordersLast14Days ?? []).map((d) => ({ ...d, label: DAY_LABEL(d.date) })),
        [analytics],
    );

    const revenueChartData = useMemo(
        () => (analytics?.revenueLast6Months ?? []).map((d) => ({ ...d, label: MONTH_LABEL(d.month) })),
        [analytics],
    );

    const statusChartData = useMemo(
        () => (analytics?.ordersByStatus ?? []).map((s) => ({
            name: STATUS_LABEL[s.status], value: s.count, color: STATUS_COLOR[s.status],
        })),
        [analytics],
    );

    return (
        <div>
            <AdminTopbar title="نظرة عامة" description="ملخص أداء المنصة والإحصاءات التشغيلية" />

            {isMock && (
                <div className="mb-6 rounded-md border border-gold-500/30 bg-gold-100/50 px-5 py-3 text-[13px] font-semibold text-[#8A6417]">
                    تعذر الاتصال بالخادم الخلفي — يتم عرض بيانات تجريبية إلى حين تشغيل نقاط النهاية الإدارية.
                </div>
            )}

            {!stats || !analytics ? (
                <div className="rounded-md border border-line bg-white p-10 text-center text-[13.5px] text-[#8A9691]">جارِ التحميل...</div>
            ) : (
                <>
                    <div className="mb-6 grid grid-cols-3 gap-5">
                        <StatCard icon={ClipboardList} label="طلبات اليوم" value={stats.ordersToday} tone="teal" />
                        <StatCard icon={Wrench} label="طلبات قيد التنفيذ" value={stats.ordersInProgress} tone="gold" />
                        <StatCard icon={Wallet} label="إيرادات هذا الشهر" value={`${stats.revenueThisMonth.toLocaleString()} ر.س`} tone="green" />
                        <StatCard icon={UserCheck} label="فنيون نشطون" value={stats.activeTechnicians} tone="teal" />
                        <StatCard icon={ShieldAlert} label="بانتظار التحقق" value={stats.pendingVerifications} tone="danger" />
                        <StatCard icon={UserPlus} label="مستخدمون جدد هذا الأسبوع" value={stats.newUsersThisWeek} tone="green" />
                    </div>

                    <div className="mb-5 grid grid-cols-3 gap-5">
                        <ChartCard
                            title="الطلبات خلال آخر 14 يومًا"
                            description="عدد الطلبات المُنشأة يوميًا"
                            className="col-span-2"
                        >
                            <ResponsiveContainer width="100%" height={260}>
                                <AreaChart data={ordersChartData} margin={{ left: -18, right: 8 }}>
                                    <defs>
                                        <linearGradient id="ordersFill" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#1E6B5C" stopOpacity={0.35} />
                                            <stop offset="95%" stopColor="#1E6B5C" stopOpacity={0.02} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#E2DDD0" vertical={false} />
                                    <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#8A9691" }} axisLine={false} tickLine={false} />
                                    <YAxis tick={{ fontSize: 11, fill: "#8A9691" }} axisLine={false} tickLine={false} allowDecimals={false} />
                                    <Tooltip
                                        contentStyle={{ borderRadius: 10, border: "1px solid #E2DDD0", fontSize: 12.5, direction: "rtl" }}
                                        labelFormatter={(l) => `يوم ${l}`}
                                        formatter={(value: number) => [`${value} طلب`, "الطلبات"]}
                                    />
                                    <Area type="monotone" dataKey="orders" stroke="#1E6B5C" strokeWidth={2.5} fill="url(#ordersFill)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </ChartCard>

                        <ChartCard title="توزيع حالات الطلبات" description="نسبة الطلبات حسب الحالة">
                            <ResponsiveContainer width="100%" height={260}>
                                <PieChart>
                                    <Pie
                                        data={statusChartData}
                                        dataKey="value"
                                        nameKey="name"
                                        innerRadius={55}
                                        outerRadius={85}
                                        paddingAngle={2}
                                    >
                                        {statusChartData.map((entry) => (
                                            <Cell key={entry.name} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ borderRadius: 10, border: "1px solid #E2DDD0", fontSize: 12.5, direction: "rtl" }}
                                        formatter={(value: number, name: string) => [`${value} طلب`, name]}
                                    />
                                    <Legend
                                        verticalAlign="bottom"
                                        iconType="circle"
                                        iconSize={8}
                                        formatter={(value) => <span className="text-[12px] text-[#57655F]">{value}</span>}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </ChartCard>
                    </div>

                    <div className="grid grid-cols-2 gap-5">
                        <ChartCard title="الإيرادات الشهرية" description="آخر 6 أشهر — الطلبات المكتملة فقط">
                            <ResponsiveContainer width="100%" height={240}>
                                <BarChart data={revenueChartData} margin={{ left: -12, right: 8 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#E2DDD0" vertical={false} />
                                    <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#8A9691" }} axisLine={false} tickLine={false} />
                                    <YAxis tick={{ fontSize: 11, fill: "#8A9691" }} axisLine={false} tickLine={false} />
                                    <Tooltip
                                        contentStyle={{ borderRadius: 10, border: "1px solid #E2DDD0", fontSize: 12.5, direction: "rtl" }}
                                        formatter={(value: number) => [`${value.toLocaleString()} ر.س`, "الإيرادات"]}
                                    />
                                    <Bar dataKey="revenue" fill="#BF8A34" radius={[6, 6, 0, 0]} maxBarSize={34} />
                                </BarChart>
                            </ResponsiveContainer>
                        </ChartCard>

                        <ChartCard title="الفئات الأكثر طلبًا" description="عدد الطلبات لكل فئة خدمة">
                            <ResponsiveContainer width="100%" height={240}>
                                <BarChart data={analytics.topCategories} layout="vertical" margin={{ left: 8, right: 16 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#E2DDD0" horizontal={false} />
                                    <XAxis type="number" tick={{ fontSize: 11, fill: "#8A9691" }} axisLine={false} tickLine={false} allowDecimals={false} />
                                    <YAxis dataKey="label" type="category" width={70} tick={{ fontSize: 12, fill: "#57655F" }} axisLine={false} tickLine={false} />
                                    <Tooltip
                                        contentStyle={{ borderRadius: 10, border: "1px solid #E2DDD0", fontSize: 12.5, direction: "rtl" }}
                                        formatter={(value: number) => [`${value} طلب`, "الطلبات"]}
                                    />
                                    <Bar dataKey="count" fill="#1E6B5C" radius={[0, 6, 6, 0]} maxBarSize={18} />
                                </BarChart>
                            </ResponsiveContainer>
                        </ChartCard>
                    </div>
                </>
            )}
        </div>
    );
}
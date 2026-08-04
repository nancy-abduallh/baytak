"use client";
import { useEffect, useMemo, useState } from "react";
import {
    ClipboardList, Wrench, Users as UsersIcon, TrendingUp, ListTree,
} from "lucide-react";
import {
    ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
    BarChart, Bar, Cell,
} from "recharts";
import { adminApi } from "@/lib/api";
import {
    DashboardAnalytics, DashboardStats, OrderStatus,
    AdminTechnicianRow, AdminUserRow, AdminCategoryRow,
} from "@/lib/types";
import { AdminTopbar } from "@/components/layout/AdminTopbar";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { MetricPill } from "@/components/dashboard/MetricPill";
import { DonutStat } from "@/components/dashboard/DonutStat";
import { GaugeCard } from "@/components/dashboard/GaugeCard";
import { RankedList } from "@/components/dashboard/RankedList";
import { FilterSelect } from "@/components/dashboard/FilterSelect";

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

const MOCK_TECHNICIANS: AdminTechnicianRow[] = Array.from({ length: 40 }).map((_, i) => ({
    id: i + 1,
    fullName: `فني ${i + 1}`,
    initials: `ف${i + 1}`,
    phone: "05xxxxxxxx",
    email: null,
    avatarUrl: null,
    categoryLabel: ["كهرباء", "سباكة", "تكييف"][i % 3],
    primaryCategoryId: (i % 3) + 1,
    city: "الرياض",
    district: "—",
    yearsExperience: 3,
    priceFrom: 100,
    isVerified: i % 4 !== 0,
    isActive: i % 5 !== 0,
    averageRating: 4.5,
    reviewCount: 12,
    completedOrders: 20,
}));

const MOCK_USERS: AdminUserRow[] = Array.from({ length: 60 }).map((_, i) => ({
    id: i + 1,
    fullName: `مستخدم ${i + 1}`,
    phone: "05xxxxxxxx",
    email: null,
    city: "جدة",
    ordersCount: 2,
    createdAt: "2026-01-01",
    isBlocked: i % 9 === 0,
}));

const MOCK_CATEGORIES: AdminCategoryRow[] = ["كهرباء", "سباكة", "تكييف", "دهانات", "نظافة", "نجارة"].map((nameAr, i) => ({
    id: i + 1,
    nameAr,
    slug: nameAr,
    description: null,
    iconKey: "wrench",
    priceFrom: 100,
    priceUnit: "ر.س",
    sortOrder: i,
    technicianCount: 10,
    isActive: true,
}));

const STATUS_LABEL: Record<OrderStatus, string> = {
    pending: "جديد",
    confirmed: "مؤكد",
    in_progress: "قيد التنفيذ",
    completed: "مكتمل",
    cancelled: "ملغي",
};

const CATEGORY_COLORS = ["#1E6B5C", "#BF8A34", "#4C9A6A", "#2F6FED", "#8B5CF6", "#3B6B7D"];

const DAY_LABEL = (key: string) => {
    const [, month, day] = key.split("-");
    return `${day}/${month}`;
};

const PERIOD_OPTIONS = [
    { value: "7", label: "آخر 7 أيام" },
    { value: "14", label: "آخر 14 يومًا" },
];

export default function AdminOverviewPage() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [analytics, setAnalytics] = useState<DashboardAnalytics | null>(null);
    const [technicians, setTechnicians] = useState<AdminTechnicianRow[] | null>(null);
    const [users, setUsers] = useState<AdminUserRow[] | null>(null);
    const [categories, setCategories] = useState<AdminCategoryRow[] | null>(null);
    const [isMock, setIsMock] = useState(false);

    const [periodDays, setPeriodDays] = useState<"7" | "14">("14");
    const [categoryFilter, setCategoryFilter] = useState<string>("all");

    useEffect(() => {
        Promise.all([
            adminApi.getStats(),
            adminApi.getAnalytics(),
            adminApi.getTechnicians(),
            adminApi.getUsers(),
            adminApi.getCategories(),
        ])
            .then(([s, a, t, u, c]) => {
                setStats(s); setAnalytics(a); setTechnicians(t); setUsers(u); setCategories(c);
            })
            .catch(() => {
                setStats(MOCK_STATS); setAnalytics(MOCK_ANALYTICS);
                setTechnicians(MOCK_TECHNICIANS); setUsers(MOCK_USERS); setCategories(MOCK_CATEGORIES);
                setIsMock(true);
            });
    }, []);

    // ---------- Orders trend (line chart with callouts) ----------
    const ordersChartData = useMemo(() => {
        const days = parseInt(periodDays, 10);
        return (analytics?.ordersLast14Days ?? [])
            .slice(-days)
            .map((d) => ({ ...d, label: DAY_LABEL(d.date) }));
    }, [analytics, periodDays]);

    const calloutMap = useMemo(() => {
        const map = new Map<number, "top" | "bottom">();
        if (ordersChartData.length === 0) return map;
        let maxIdx = 0, minIdx = 0;
        ordersChartData.forEach((d, i) => {
            if (d.orders > ordersChartData[maxIdx].orders) maxIdx = i;
            if (d.orders < ordersChartData[minIdx].orders) minIdx = i;
        });
        map.set(0, "bottom");
        map.set(ordersChartData.length - 1, "bottom");
        map.set(minIdx, "bottom");
        map.set(maxIdx, "top");
        return map;
    }, [ordersChartData]);

    const ordersTrend = useMemo(() => {
        if (ordersChartData.length < 2) return undefined;
        const first = ordersChartData[0].orders;
        const last = ordersChartData[ordersChartData.length - 1].orders;
        if (!first) return undefined;
        return Math.round(((last - first) / first) * 100);
    }, [ordersChartData]);

    // ---------- Order status → 3-way "active / completed / cancelled" donut ----------
    const orderStatusSegments = useMemo(() => {
        const byStatus = new Map((analytics?.ordersByStatus ?? []).map((s) => [s.status, s.count]));
        const completed = byStatus.get("completed") ?? 0;
        const cancelled = byStatus.get("cancelled") ?? 0;
        const active = (byStatus.get("pending") ?? 0) + (byStatus.get("confirmed") ?? 0) + (byStatus.get("in_progress") ?? 0);
        return [
            { label: "قيد التنفيذ", value: active, color: "#2F6FED" },
            { label: "مكتملة", value: completed, color: "#4C9A6A" },
            { label: "ملغاة", value: cancelled, color: "#B24B3C" },
        ];
    }, [analytics]);

    const totalOrders = useMemo(
        () => (analytics?.ordersByStatus ?? []).reduce((sum, s) => sum + s.count, 0),
        [analytics],
    );
    const completedOrders = useMemo(
        () => analytics?.ordersByStatus.find((s) => s.status === "completed")?.count ?? 0,
        [analytics],
    );

    // ---------- Technicians donut (respects the category filter) ----------
    const filteredTechnicians = useMemo(() => {
        if (!technicians) return [];
        return categoryFilter === "all" ? technicians : technicians.filter((t) => t.categoryLabel === categoryFilter);
    }, [technicians, categoryFilter]);

    const technicianSegments = useMemo(() => {
        const verified = filteredTechnicians.filter((t) => t.isVerified).length;
        const unverified = filteredTechnicians.length - verified;
        return [
            { label: "موثّقون", value: verified, color: "#1E6B5C" },
            { label: "بانتظار التوثيق", value: unverified, color: "#BF8A34" },
        ];
    }, [filteredTechnicians]);

    // ---------- Users donut ----------
    const userSegments = useMemo(() => {
        const list = users ?? [];
        const blocked = list.filter((u) => u.isBlocked).length;
        return [
            { label: "نشطون", value: list.length - blocked, color: "#2F6FED" },
            { label: "محظورون", value: blocked, color: "#B24B3C" },
        ];
    }, [users]);

    // ---------- Category bar chart + ranked list (shared source, like the reference) ----------
    const topCategories = analytics?.topCategories ?? [];
    const categoryFilterOptions = useMemo(
        () => [{ value: "all", label: "جميع الفئات" }, ...(categories ?? []).map((c) => ({ value: c.nameAr, label: c.nameAr }))],
        [categories],
    );

    const rankedItems = useMemo(
        () => topCategories.map((c, i) => ({
            label: c.label,
            value: c.count,
            color: CATEGORY_COLORS[i % CATEGORY_COLORS.length],
            highlighted: categoryFilter === "all" || c.label === categoryFilter,
        })),
        [topCategories, categoryFilter],
    );

    // ---------- Revenue / business KPIs ----------
    const avgOrderValue = useMemo(() => {
        if (!stats || !totalOrders) return 0;
        return Math.round(stats.revenueThisMonth / totalOrders);
    }, [stats, totalOrders]);

    const completionRate = useMemo(() => {
        if (!totalOrders) return 0;
        return Math.round((completedOrders / totalOrders) * 100);
    }, [completedOrders, totalOrders]);

    const avgTechnicianRating = useMemo(() => {
        if (!technicians || technicians.length === 0) return "—";
        const sum = technicians.reduce((acc, t) => acc + (t.averageRating ?? 0), 0);
        return (sum / technicians.length).toFixed(1);
    }, [technicians]);

    const isLoading = !stats || !analytics || !technicians || !users || !categories;

    return (
        <div>
            <AdminTopbar title="نظرة عامة" description="ملخص أداء منصة بيتك والإحصاءات التشغيلية" />

            {isMock && (
                <div className="mb-6 rounded-md border border-gold-500/30 bg-gold-100/50 px-5 py-3 text-[13px] font-semibold text-[#8A6417]">
                    تعذر الاتصال بالخادم الخلفي — يتم عرض بيانات تجريبية إلى حين تشغيل الخادم.
                </div>
            )}

            {isLoading ? (
                <div className="card-elevated p-10 text-center text-[13.5px] text-muted">جارِ التحميل...</div>
            ) : (
                <>
                    {/* Filters — mirrors the "Year(s) / Fire Type" controls in the reference dashboard */}
                    <div className="mb-6 flex flex-wrap items-end justify-end gap-4">
                        <FilterSelect
                            label="الفترة"
                            value={periodDays}
                            onChange={(v) => setPeriodDays(v as "7" | "14")}
                            options={PERIOD_OPTIONS}
                        />
                        <FilterSelect
                            label="فئة الخدمة"
                            value={categoryFilter}
                            onChange={setCategoryFilter}
                            options={categoryFilterOptions}
                        />
                    </div>

                    {/* Top KPI capsules — mirrors "Total Fires / Years / Types of Fires / ..." */}
                    <div className="mb-6 flex flex-wrap gap-4 rounded-[18px] border border-line bg-white/60 p-5">
                        <MetricPill label="إجمالي الطلبات" value={totalOrders.toLocaleString()} tone="teal900" />
                        <MetricPill label="الفنيون النشطون" value={stats.activeTechnicians} tone="teal700" />
                        <MetricPill label="فئات الخدمة" value={categories.length} tone="green500" />
                        <MetricPill label="بانتظار التوثيق" value={stats.pendingVerifications} tone="gold500" />
                        <MetricPill label="مستخدمون جدد" value={stats.newUsersThisWeek} tone="sand100" />
                        <MetricPill
                            label="إجمالي الإيرادات (هذا الشهر)"
                            value={`${stats.revenueThisMonth.toLocaleString()} ر.س`}
                            tone="blue500"
                        />
                        <MetricPill
                            label="متوسط قيمة الطلب"
                            value={`${avgOrderValue.toLocaleString()} ر.س`}
                            tone="purple500"
                        />
                        <MetricPill label="نسبة إنجاز الطلبات" value={`${completionRate}٪`} tone="green500" />
                        <MetricPill label="متوسط تقييم الفنيين" value={avgTechnicianRating} tone="gold500" />
                    </div>

                    {/* Main grid — 3 stacked donuts | trend + category chart | gauge + ranked list */}
                    <div className="grid grid-cols-12 gap-5">
                        <div className="col-span-12 flex flex-col gap-5 lg:col-span-3">
                            <DonutStat
                                title="حالة الطلبات"
                                legendTitle="نوع الطلب"
                                icon={ClipboardList}
                                segments={orderStatusSegments}
                            />
                            <DonutStat
                                title="حالة الفنيين"
                                legendTitle="التوثيق"
                                icon={Wrench}
                                segments={technicianSegments}
                            />
                            <DonutStat
                                title="حالة المستخدمين"
                                legendTitle="الحساب"
                                icon={UsersIcon}
                                segments={userSegments}
                            />
                        </div>

                        <div className="col-span-12 flex flex-col gap-5 lg:col-span-6">
                            <ChartCard
                                title="الطلبات عبر الزمن"
                                description="عدد الطلبات المُنشأة يوميًا"
                                icon={TrendingUp}
                                tone="teal"
                                action={
                                    ordersTrend !== undefined && (
                                        <span
                                            className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${ordersTrend >= 0 ? "bg-green-100 text-green-600" : "bg-danger/10 text-danger"}`}
                                        >
                                            {ordersTrend >= 0 ? "+" : ""}{ordersTrend}%
                                        </span>
                                    )
                                }
                            >
                                <div style={{ direction: "ltr" }}>
                                    <ResponsiveContainer width="100%" height={260}>
                                        <LineChart data={ordersChartData} margin={{ top: 30, left: -18, right: 8, bottom: 24 }}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#E2DDD0" vertical={false} />
                                            <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#5B6B64" }} axisLine={false} tickLine={false} />
                                            <YAxis tick={{ fontSize: 11, fill: "#5B6B64" }} axisLine={false} tickLine={false} allowDecimals={false} />
                                            <Tooltip
                                                contentStyle={{ borderRadius: 12, border: "1px solid #E2DDD0", fontSize: 12.5, direction: "rtl", boxShadow: "0 12px 30px rgba(18,48,46,.18)" }}
                                                labelFormatter={(l) => `يوم ${l}`}
                                                formatter={(value: number) => [`${value} طلب`, "الطلبات"]}
                                            />
                                            <Line
                                                type="monotone"
                                                dataKey="orders"
                                                stroke="#1E6B5C"
                                                strokeWidth={3}
                                                dot={(dotProps: any) => {
                                                    const { cx, cy, index, value } = dotProps;
                                                    const pos = calloutMap.get(index);
                                                    if (!pos) {
                                                        return <circle key={`d-${index}`} cx={cx} cy={cy} r={2.5} fill="#1E6B5C" />;
                                                    }
                                                    const label = `${value}`;
                                                    const boxWidth = Math.max(30, label.length * 9 + 16);
                                                    const y = pos === "top" ? cy - 34 : cy + 12;
                                                    const fill = pos === "top" ? "#1E6B5C" : "#BF8A34";
                                                    return (
                                                        <g key={`d-${index}`}>
                                                            <circle cx={cx} cy={cy} r={4} fill={fill} stroke="#fff" strokeWidth={2} />
                                                            <rect x={cx - boxWidth / 2} y={y} width={boxWidth} height={22} rx={11} fill={fill} />
                                                            <text x={cx} y={y + 15} textAnchor="middle" fontSize={11} fontWeight={700} fill="#fff">
                                                                {label}
                                                            </text>
                                                        </g>
                                                    );
                                                }}
                                                activeDot={{ r: 5, fill: "#1E6B5C", stroke: "#fff", strokeWidth: 2 }}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </ChartCard>

                            <ChartCard
                                title="الفئات الأكثر طلبًا"
                                description="عدد الطلبات لكل فئة خدمة"
                                icon={ListTree}
                                tone="blue"
                            >
                                <div style={{ direction: "ltr" }}>
                                    <ResponsiveContainer width="100%" height={260}>
                                        <BarChart data={topCategories} layout="vertical" margin={{ left: 8, right: 30 }}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#E2DDD0" horizontal={false} />
                                            <XAxis type="number" tick={{ fontSize: 11, fill: "#5B6B64" }} axisLine={false} tickLine={false} allowDecimals={false} />
                                            <YAxis dataKey="label" type="category" width={70} tick={{ fontSize: 12, fill: "#57655F" }} axisLine={false} tickLine={false} />
                                            <Tooltip
                                                contentStyle={{ borderRadius: 12, border: "1px solid #E2DDD0", fontSize: 12.5, direction: "rtl", boxShadow: "0 12px 30px rgba(18,48,46,.18)" }}
                                                formatter={(value: number) => [`${value} طلب`, "الطلبات"]}
                                            />
                                            <Bar dataKey="count" radius={[0, 8, 8, 0]} maxBarSize={20} label={{ position: "right", fontSize: 11, fill: "#57655F", fontWeight: 700 }}>
                                                {topCategories.map((entry, i) => (
                                                    <Cell
                                                        key={entry.label}
                                                        fill={CATEGORY_COLORS[i % CATEGORY_COLORS.length]}
                                                        fillOpacity={categoryFilter === "all" || entry.label === categoryFilter ? 1 : 0.35}
                                                    />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </ChartCard>
                        </div>

                        <div className="col-span-12 flex flex-col gap-5 lg:col-span-3">
                            <GaugeCard
                                title="نسبة إنجاز الطلبات"
                                value={completedOrders}
                                max={totalOrders}
                                valueLabel={completedOrders.toLocaleString()}
                                color="#1E6B5C"
                            />
                            <RankedList title="الفئات حسب عدد الطلبات" items={rankedItems} unit="طلب" />
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
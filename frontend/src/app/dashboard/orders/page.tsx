"use client";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/lib/stores/auth-store";
import { api, ApiError } from "@/lib/api";
import { Order } from "@/lib/types";
import { OrdersBoard } from "@/components/dashboard/OrdersBoard";

export default function OrdersPage() {
    const user = useAuthStore((s) => s.user);
    const [orders, setOrders] = useState<Order[] | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!user) return;
        api.getOrders(user.id).then(setOrders).catch((err) => setError(err instanceof ApiError ? err.message : "تعذر تحميل الطلبات"));
    }, [user]);

    if (error) return <div className="rounded-md border border-danger/30 bg-danger/5 p-6 text-[13.5px] font-semibold text-danger">{error}</div>;
    if (!orders) return <div className="rounded-md border border-line bg-white p-10 text-center text-[13.5px] text-[#8A9691]">جارِ تحميل الطلبات...</div>;
    if (orders.length === 0) {
        return (
            <div className="rounded-md border border-line bg-white p-10 text-center text-[13.5px] text-[#8A9691]">
                لا توجد طلبات بعد. <a href="/services" className="font-bold text-teal-700">اطلب خدمة الآن</a>
            </div>
        );
    }

    return <OrdersBoard initialOrders={orders} />;
}
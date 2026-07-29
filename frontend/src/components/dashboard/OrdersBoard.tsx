"use client";
import { useMemo, useState } from "react";
import { Order } from "@/lib/types";
import { StatusTabs } from "./StatusTabs";
import { OrderRow } from "./OrderRow";
import { OrderDetails } from "./OrderDetails";

type TabKey = "all" | "in_progress" | "completed";

export function OrdersBoard({ initialOrders }: { initialOrders: Order[] }) {
    const [tab, setTab] = useState<TabKey>("all");
    const [selectedId, setSelectedId] = useState(initialOrders[0]?.id);

    const counts = useMemo(() => ({
        all: initialOrders.length,
        inProgress: initialOrders.filter((o) => o.status === "in_progress").length,
        completed: initialOrders.filter((o) => o.status === "completed").length,
    }), [initialOrders]);

    const filtered = useMemo(() => {
        if (tab === "all") return initialOrders;
        return initialOrders.filter((o) => o.status === tab);
    }, [initialOrders, tab]);

    const selected = initialOrders.find((o) => o.id === selectedId) ?? initialOrders[0];

    return (
        <div>
            <div className="mb-5 flex items-center justify-between">
                <h2 className="text-2xl font-extrabold">طلباتي</h2>
                <StatusTabs counts={counts} active={tab} onChange={setTab} />
            </div>

            {filtered.map((order) => (
                <OrderRow key={order.id} order={order} selected={order.id === selected?.id} onSelect={() => setSelectedId(order.id)} />
            ))}

            {selected && <OrderDetails order={selected} />}
        </div>
    );
}
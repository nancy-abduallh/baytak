import { api } from "@/lib/api";
import { MOCK_USER } from "@/lib/mock-data";
import { SidebarNav } from "@/components/dashboard/SidebarNav";
import { OrdersBoard } from "@/components/dashboard/OrdersBoard";

export default async function OrdersPage() {
    const orders = await api.getOrders(MOCK_USER.id);

    return (
        <main className="mx-auto grid max-w-[1360px] grid-cols-[250px_1fr] gap-7 px-10 py-9">
            <SidebarNav user={MOCK_USER} />
            <OrdersBoard initialOrders={orders} />
        </main>
    );
}
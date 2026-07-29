import { ServiceCategory, Technician, Order } from "./types";
import { MOCK_CATEGORIES, MOCK_TECHNICIANS, MOCK_ORDERS } from "./mock-data";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1";

async function request<T>(path: string, fallback: T, init?: RequestInit): Promise<T> {
    try {
        const res = await fetch(`${BASE_URL}${path}`, {
            ...init,
            headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
            cache: "no-store",
        });
        if (!res.ok) throw new Error(`API ${path} responded ${res.status}`);
        return (await res.json()) as T;
    } catch (err) {
        // Backend isn't built yet (or is unreachable) — fall back to typed mock
        // data so the UI stays fully browsable. Remove this once the NestJS
        // API is live and this catch becomes a real error path.
        if (process.env.NODE_ENV !== "production") {
            console.warn(`[api] falling back to mock data for ${path}:`, (err as Error).message);
        }
        return fallback;
    }
}

export const api = {
    getCategories: () => request<ServiceCategory[]>("/service-categories", MOCK_CATEGORIES),

    getTechniciansByCategory: (slug: string) =>
        request<Technician[]>(
            `/technicians?category=${slug}`,
            MOCK_TECHNICIANS.filter((t) => t.categorySlug === slug)
        ),

    getOrders: (userId: number) =>
        request<Order[]>(`/users/${userId}/orders`, MOCK_ORDERS),
};
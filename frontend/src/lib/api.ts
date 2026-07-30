import { useAuthStore } from "./stores/auth-store";
import { ServiceCategory, Technician, Order, User, Address } from "./types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1";

export class ApiError extends Error {
    constructor(message: string, public status: number) {
        super(message);
        this.name = "ApiError";
    }
}

interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    user: User;
}

async function request<T>(path: string, init?: RequestInit, allowRetry = true): Promise<T> {
    const token = useAuthStore.getState().accessToken;

    const res = await fetch(`${BASE_URL}${path}`, {
        ...init,
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...(init?.headers ?? {}),
        },
        cache: "no-store",
    });

    if (res.status === 401 && allowRetry && useAuthStore.getState().refreshToken) {
        const refreshed = await refreshSession();
        if (refreshed) return request<T>(path, init, false);
        useAuthStore.getState().clearSession();
    }

    if (!res.ok) {
        const body = await res.json().catch(() => ({}) as { message?: string });
        throw new ApiError(body.message ?? `تعذر إتمام الطلب (${res.status})`, res.status);
    }

    if (res.status === 204) return undefined as T;
    return res.json() as Promise<T>;
}

async function refreshSession(): Promise<boolean> {
    const refreshToken = useAuthStore.getState().refreshToken;
    if (!refreshToken) return false;
    try {
        const res = await fetch(`${BASE_URL}/auth/refresh`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshToken }),
        });
        if (!res.ok) return false;
        useAuthStore.getState().setSession((await res.json()) as AuthResponse);
        return true;
    } catch {
        return false;
    }
}

export const api = {
    // Public
    getCategories: () => request<ServiceCategory[]>("/service-categories"),
    getTechniciansByCategory: (slug: string) => request<Technician[]>(`/technicians?category=${slug}`),
    getTechnician: (id: number) => request<Technician>(`/technicians/${id}`),

    // Auth
    register: (payload: { fullName: string; phone: string; password: string; email?: string; city?: string; district?: string }) =>
        request<AuthResponse>("/auth/register", { method: "POST", body: JSON.stringify(payload) }),
    login: (payload: { phone: string; password: string }) =>
        request<AuthResponse>("/auth/login", { method: "POST", body: JSON.stringify(payload) }),
    logout: () => {
        const refreshToken = useAuthStore.getState().refreshToken;
        if (!refreshToken) return Promise.resolve();
        return request("/auth/logout", { method: "POST", body: JSON.stringify({ refreshToken }) }).catch(() => undefined);
    },

    // Protected
    getOrders: (userId: number) => request<Order[]>(`/users/${userId}/orders`),
    getOrder: (id: number) => request<Order>(`/orders/${id}`),
    createOrder: (payload: { categoryId: number; addressId: number; technicianId?: number; description?: string; scheduledDate: string; amount: number }) =>
        request<Order>("/orders", { method: "POST", body: JSON.stringify(payload) }),
    getMyAddresses: () => request<Address[]>("/addresses/mine"),
    createAddress: (payload: { label?: string; city: string; district: string; street?: string; isDefault?: boolean }) =>
        request<Address>("/addresses", { method: "POST", body: JSON.stringify(payload) }),
};
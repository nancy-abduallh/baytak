import { useAuthStore } from "./stores/auth-store";
import { ServiceCategory, Technician, Order, User, Address, Review } from "./types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1";

const ASSET_ORIGIN = BASE_URL.replace(/\/api\/v1\/?$/, "");

export function getAssetUrl(path?: string | null): string | null {
    if (!path) return null;
    if (/^https?:\/\//i.test(path)) return path;
    return `${ASSET_ORIGIN}${path.startsWith("/") ? path : `/${path}`}`;
}

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

export interface TechnicianFilters {
    minRating?: number;
    maxPrice?: number;
    sortBy?: "rating" | "price" | "experience";
}

function buildQuery(params: Record<string, string | number | undefined>): string {
    const search = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") search.set(key, String(value));
    });
    const qs = search.toString();
    return qs ? `?${qs}` : "";
}

export const api = {
    // Public
    getCategories: () => request<ServiceCategory[]>("/service-categories"),
    getTechniciansByCategory: (slug: string, filters: TechnicianFilters = {}) =>
        request<Technician[]>(`/technicians${buildQuery({ category: slug, minRating: filters.minRating, maxPrice: filters.maxPrice, sortBy: filters.sortBy })}`),
    getTechnician: (id: number) => request<Technician>(`/technicians/${id}`),
    getTechnicianReviews: (id: number) => request<Review[]>(`/technicians/${id}/reviews`),

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
    updateProfile: (payload: { fullName?: string; phone?: string; email?: string; city?: string; district?: string }) =>
        request<User>("/auth/me", { method: "PATCH", body: JSON.stringify(payload) }),

    // Protected
    getOrders: (userId: number) => request<Order[]>(`/users/${userId}/orders`),
    getOrder: (id: number) => request<Order>(`/orders/${id}`),
    createOrder: (payload: { categoryId: number; addressId: number; technicianId?: number; description?: string; scheduledDate: string; amount: number }) =>
        request<Order>("/orders", { method: "POST", body: JSON.stringify(payload) }),
    createReview: (orderId: number, payload: { rating: number; comment?: string }) =>
        request<{ id: number }>(`/orders/${orderId}/reviews`, { method: "POST", body: JSON.stringify(payload) }),

    getMyAddresses: () => request<Address[]>("/addresses/mine"),
    createAddress: (payload: { label?: string; city: string; district: string; street?: string; isDefault?: boolean }) =>
        request<Address>("/addresses", { method: "POST", body: JSON.stringify(payload) }),
    updateAddress: (id: number, payload: { label?: string; city?: string; district?: string; street?: string; isDefault?: boolean }) =>
        request<Address>(`/addresses/${id}`, { method: "PATCH", body: JSON.stringify(payload) }),
    deleteAddress: (id: number) => request<{ id: number; deleted: boolean }>(`/addresses/${id}`, { method: "DELETE" }),

    getFavorites: () => request<Technician[]>("/favorites/mine"),
    getFavoriteIds: () => request<number[]>("/favorites/mine/ids"),
    addFavorite: (technicianId: number) => request<{ favorited: boolean }>(`/favorites/${technicianId}`, { method: "POST" }),
    removeFavorite: (technicianId: number) => request<{ favorited: boolean }>(`/favorites/${technicianId}`, { method: "DELETE" }),
};
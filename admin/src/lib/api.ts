import { useAdminAuthStore } from "./stores/admin-auth-store";
import {
    AdminOrderRow, AdminTechnicianRow, AdminUserRow, AdminCategoryRow,
    CreateTechnicianPayload, UpdateTechnicianPayload,
    CreateCategoryPayload, UpdateCategoryPayload,
    DashboardStats, DashboardAnalytics, AdminUser, OrderStatus,
} from "./types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1";

export class ApiError extends Error {
    constructor(message: string, public status: number) {
        super(message);
        this.name = "ApiError";
    }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
    const token = useAdminAuthStore.getState().accessToken;

    const res = await fetch(`${BASE_URL}${path}`, {
        ...init,
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...(init?.headers ?? {}),
        },
        cache: "no-store",
    });

    if (res.status === 401) {
        useAdminAuthStore.getState().clearSession();
    }

    if (!res.ok) {
        const body = await res.json().catch(() => ({}) as { message?: string });
        throw new ApiError(body.message ?? `تعذر إتمام الطلب (${res.status})`, res.status);
    }
    if (res.status === 204) return undefined as T;
    return res.json() as Promise<T>;
}

// NOTE: every endpoint below is under /admin and requires a valid admin JWT
// (see backend/src/modules/admin — AdminController + JwtAdminGuard).
export const adminApi = {
    login: (payload: { email: string; password: string }) =>
        request<{ accessToken: string; admin: AdminUser }>("/admin/auth/login", {
            method: "POST",
            body: JSON.stringify(payload),
        }),

    getStats: () => request<DashboardStats>("/admin/stats"),
    getAnalytics: () => request<DashboardAnalytics>("/admin/analytics"),

    // ---------- Orders ----------
    getOrders: (params?: { status?: OrderStatus; search?: string }) => {
        const qs = new URLSearchParams(params as Record<string, string>).toString();
        return request<AdminOrderRow[]>(`/admin/orders${qs ? `?${qs}` : ""}`);
    },
    updateOrderStatus: (id: number, status: OrderStatus) =>
        request<AdminOrderRow>(`/admin/orders/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) }),

    // ---------- Technicians ----------
    getTechnicians: (params?: { search?: string; verified?: boolean }) => {
        const qs = new URLSearchParams(params as Record<string, string>).toString();
        return request<AdminTechnicianRow[]>(`/admin/technicians${qs ? `?${qs}` : ""}`);
    },
    createTechnician: (payload: CreateTechnicianPayload) =>
        request<AdminTechnicianRow>("/admin/technicians", { method: "POST", body: JSON.stringify(payload) }),
    updateTechnician: (id: number, payload: UpdateTechnicianPayload) =>
        request<AdminTechnicianRow>(`/admin/technicians/${id}`, { method: "PATCH", body: JSON.stringify(payload) }),
    deleteTechnician: (id: number) =>
        request<{ id: number; deleted: boolean }>(`/admin/technicians/${id}`, { method: "DELETE" }),
    setTechnicianVerified: (id: number, isVerified: boolean) =>
        request<AdminTechnicianRow>(`/admin/technicians/${id}/verify`, { method: "PATCH", body: JSON.stringify({ isVerified }) }),
    setTechnicianActive: (id: number, isActive: boolean) =>
        request<AdminTechnicianRow>(`/admin/technicians/${id}/active`, { method: "PATCH", body: JSON.stringify({ isActive }) }),

    // ---------- Users ----------
    getUsers: (params?: { search?: string }) => {
        const qs = new URLSearchParams(params as Record<string, string>).toString();
        return request<AdminUserRow[]>(`/admin/users${qs ? `?${qs}` : ""}`);
    },
    setUserBlocked: (id: number, isBlocked: boolean) =>
        request<AdminUserRow>(`/admin/users/${id}/block`, { method: "PATCH", body: JSON.stringify({ isBlocked }) }),

    // ---------- Categories ----------
    getCategories: () => request<AdminCategoryRow[]>("/admin/categories"),
    createCategory: (payload: CreateCategoryPayload) =>
        request<AdminCategoryRow>("/admin/categories", { method: "POST", body: JSON.stringify(payload) }),
    updateCategory: (id: number, payload: UpdateCategoryPayload) =>
        request<AdminCategoryRow>(`/admin/categories/${id}`, { method: "PATCH", body: JSON.stringify(payload) }),
    deleteCategory: (id: number) =>
        request<{ id: number; deleted: boolean }>(`/admin/categories/${id}`, { method: "DELETE" }),
};
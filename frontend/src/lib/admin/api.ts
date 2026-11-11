import { useAdminAuthStore } from "./stores/admin-auth-store";
import {
    AdminOrderRow, AdminTechnicianRow, AdminUserRow, AdminCategoryRow,
    CreateTechnicianPayload, UpdateTechnicianPayload,
    CreateCategoryPayload, UpdateCategoryPayload,
    DashboardStats, DashboardAnalytics, AdminUser, OrderStatus,
    AdminRow, CreateAdminPayload, UpdateAdminPayload, UpdateOwnProfilePayload, PermissionKey,
    SiteSettings, UpdateSiteSettingsPayload,
} from "./types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1";
// Static files (technician avatars) are served from the API origin but outside
// the /api/v1 prefix, e.g. http://localhost:4000/uploads/avatars/xyz.jpg
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

async function requestFormData<T>(path: string, formData: FormData, method: "POST" | "PATCH" = "POST"): Promise<T> {
    const token = useAdminAuthStore.getState().accessToken;

    // NOTE: no Content-Type header here on purpose — the browser sets the
    // correct multipart/form-data boundary automatically for FormData bodies.
    const res = await fetch(`${BASE_URL}${path}`, {
        method,
        headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
        cache: "no-store",
    });

    if (res.status === 401) {
        useAdminAuthStore.getState().clearSession();
    }

    if (!res.ok) {
        const body = await res.json().catch(() => ({}) as { message?: string });
        throw new ApiError(body.message ?? `تعذر إتمام الطلب (${res.status})`, res.status);
    }
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
    updateOrderStatus: (id: number, status: OrderStatus, note?: string) =>
        request<AdminOrderRow>(`/admin/orders/${id}/status`, { method: "PATCH", body: JSON.stringify({ status, note }) }),
    deleteOrder: (id: number) =>
        request<{ id: number; deleted: boolean }>(`/admin/orders/${id}`, { method: "DELETE" }),

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
    uploadTechnicianAvatar: (id: number, file: File) => {
        const formData = new FormData();
        formData.append("avatar", file);
        return requestFormData<AdminTechnicianRow>(`/admin/technicians/${id}/avatar`, formData, "POST");
    },
    removeTechnicianAvatar: (id: number) =>
        request<AdminTechnicianRow>(`/admin/technicians/${id}/avatar`, { method: "DELETE" }),

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

    // ---------- My own account ----------
    getMe: () => request<AdminRow>("/admin/me"),
    updateMe: (payload: UpdateOwnProfilePayload) =>
        request<AdminRow>("/admin/me", { method: "PATCH", body: JSON.stringify(payload) }),

    // ---------- Admin & permissions management (super admin / admins.manage only) ----------
    getPermissionsCatalogue: () => request<{ key: PermissionKey; label: string }[]>("/admin/permissions"),
    getAdmins: () => request<AdminRow[]>("/admin/admins"),
    createAdmin: (payload: CreateAdminPayload) =>
        request<AdminRow>("/admin/admins", { method: "POST", body: JSON.stringify(payload) }),
    updateAdmin: (id: number, payload: UpdateAdminPayload) =>
        request<AdminRow>(`/admin/admins/${id}`, { method: "PATCH", body: JSON.stringify(payload) }),
    deleteAdmin: (id: number) =>
        request<{ id: number; deleted: boolean }>(`/admin/admins/${id}`, { method: "DELETE" }),

    // ---------- Site settings (contact us / footer / social links) ----------
    getSiteSettings: () => request<SiteSettings>("/admin/site-settings"),
    updateSiteSettings: (payload: UpdateSiteSettingsPayload) =>
        request<SiteSettings>("/admin/site-settings", { method: "PATCH", body: JSON.stringify(payload) }),
};
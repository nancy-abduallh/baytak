import { AdminUser, PermissionKey } from "./types";

export const PERMISSION_LABELS: Record<PermissionKey, string> = {
    "dashboard.view": "عرض لوحة القيادة والإحصائيات",
    "orders.view": "عرض الطلبات",
    "orders.update_status": "تعديل حالة الطلبات",
    "orders.delete": "حذف الطلبات",
    "technicians.manage": "إدارة الفنيين",
    "users.manage": "إدارة المستخدمين",
    "categories.manage": "إدارة فئات الخدمة",
    "admins.manage": "إدارة المشرفين وصلاحياتهم",
};

export const ALL_PERMISSIONS = Object.keys(PERMISSION_LABELS) as PermissionKey[];

export const ROLE_LABELS: Record<AdminUser["role"], string> = {
    super_admin: "مدير عام",
    operations: "فريق العمليات",
    support: "فريق الدعم",
    finance: "فريق المالية",
};

export const DEFAULT_PERMISSIONS_BY_ROLE: Record<Exclude<AdminUser["role"], "super_admin">, PermissionKey[]> = {
    operations: ["dashboard.view", "orders.view", "orders.update_status", "technicians.manage", "categories.manage"],
    support: ["dashboard.view", "orders.view", "orders.update_status", "users.manage"],
    finance: ["dashboard.view", "orders.view"],
};

// super_admin implicitly has every permission — the backend never even
// looks at their `permissions` array. Mirror that here so the UI hides
// the same actions the API would reject.
export function hasPermission(admin: AdminUser | null | undefined, permission: PermissionKey): boolean {
    if (!admin) return false;
    if (admin.role === "super_admin") return true;
    return admin.permissions?.includes(permission) ?? false;
}

export function hasAnyPermission(admin: AdminUser | null | undefined, permissions: PermissionKey[]): boolean {
    return permissions.some((p) => hasPermission(admin, p));
}
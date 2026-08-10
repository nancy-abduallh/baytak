export declare const ADMIN_PERMISSIONS: readonly ["dashboard.view", "orders.view", "orders.update_status", "orders.delete", "technicians.manage", "users.manage", "categories.manage", "admins.manage", "settings.manage"];
export type AdminPermission = (typeof ADMIN_PERMISSIONS)[number];
export declare const ADMIN_PERMISSION_LABELS: Record<AdminPermission, string>;
export declare const DEFAULT_PERMISSIONS_BY_ROLE: Record<string, AdminPermission[]>;
export declare function isAdminPermission(value: string): value is AdminPermission;

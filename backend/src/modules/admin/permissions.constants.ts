// =====================================================================
//  Admin RBAC — permission catalogue
//  `super_admin` always has every permission (checked in PermissionsGuard)
//  and does not need entries in the `permissions` column. Every other
//  admin is only allowed to do what's explicitly listed in their
//  `permissions` array, which the super admin assigns on creation/edit.
// =====================================================================

export const ADMIN_PERMISSIONS = [
    'dashboard.view',
    'orders.view',
    'orders.update_status',
    'orders.delete',
    'technicians.manage',
    'users.manage',
    'categories.manage',
    'admins.manage',
    'settings.manage',
] as const;

export type AdminPermission = (typeof ADMIN_PERMISSIONS)[number];

export const ADMIN_PERMISSION_LABELS: Record<AdminPermission, string> = {
    'dashboard.view': 'عرض لوحة القيادة والإحصائيات',
    'orders.view': 'عرض الطلبات',
    'orders.update_status': 'تعديل حالة الطلبات',
    'orders.delete': 'حذف الطلبات',
    'technicians.manage': 'إدارة الفنيين',
    'users.manage': 'إدارة المستخدمين',
    'categories.manage': 'إدارة فئات الخدمة',
    'admins.manage': 'إدارة المشرفين وصلاحياتهم',
    'settings.manage': 'إدارة إعدادات الموقع وبيانات التواصل',
};

// Sensible defaults offered by the UI when a super admin picks a role —
// still just a starting point, the final `permissions` array on each
// admin is what's actually enforced server-side.
export const DEFAULT_PERMISSIONS_BY_ROLE: Record<string, AdminPermission[]> = {
    operations: ['dashboard.view', 'orders.view', 'orders.update_status', 'technicians.manage', 'categories.manage'],
    support: ['dashboard.view', 'orders.view', 'orders.update_status', 'users.manage'],
    finance: ['dashboard.view', 'orders.view'],
};

export function isAdminPermission(value: string): value is AdminPermission {
    return (ADMIN_PERMISSIONS as readonly string[]).includes(value);
}
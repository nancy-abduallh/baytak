"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_PERMISSIONS_BY_ROLE = exports.ADMIN_PERMISSION_LABELS = exports.ADMIN_PERMISSIONS = void 0;
exports.isAdminPermission = isAdminPermission;
exports.ADMIN_PERMISSIONS = [
    'dashboard.view',
    'orders.view',
    'orders.update_status',
    'orders.delete',
    'technicians.manage',
    'users.manage',
    'categories.manage',
    'admins.manage',
];
exports.ADMIN_PERMISSION_LABELS = {
    'dashboard.view': 'عرض لوحة القيادة والإحصائيات',
    'orders.view': 'عرض الطلبات',
    'orders.update_status': 'تعديل حالة الطلبات',
    'orders.delete': 'حذف الطلبات',
    'technicians.manage': 'إدارة الفنيين',
    'users.manage': 'إدارة المستخدمين',
    'categories.manage': 'إدارة فئات الخدمة',
    'admins.manage': 'إدارة المشرفين وصلاحياتهم',
};
exports.DEFAULT_PERMISSIONS_BY_ROLE = {
    operations: ['dashboard.view', 'orders.view', 'orders.update_status', 'technicians.manage', 'categories.manage'],
    support: ['dashboard.view', 'orders.view', 'orders.update_status', 'users.manage'],
    finance: ['dashboard.view', 'orders.view'],
};
function isAdminPermission(value) {
    return exports.ADMIN_PERMISSIONS.includes(value);
}
//# sourceMappingURL=permissions.constants.js.map
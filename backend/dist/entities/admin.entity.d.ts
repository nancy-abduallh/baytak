import { AdminPermission } from '../modules/admin/permissions.constants';
export type AdminRole = 'super_admin' | 'operations' | 'support' | 'finance';
export declare class Admin {
    id: number;
    fullName: string;
    email: string;
    passwordHash: string;
    role: AdminRole;
    permissions: AdminPermission[];
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

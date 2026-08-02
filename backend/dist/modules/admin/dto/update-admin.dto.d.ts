import { AdminPermission } from '../permissions.constants';
import type { AdminRole } from '../../../entities/admin.entity';
export declare class UpdateAdminDto {
    fullName?: string;
    email?: string;
    password?: string;
    role?: AdminRole;
    permissions?: AdminPermission[];
    isActive?: boolean;
}

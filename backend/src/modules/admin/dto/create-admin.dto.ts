import { ArrayUnique, IsArray, IsBoolean, IsEmail, IsIn, IsOptional, IsString, MinLength } from 'class-validator';
import { ADMIN_PERMISSIONS, AdminPermission } from '../permissions.constants';
import type { AdminRole } from '../../../entities/admin.entity';

export class CreateAdminDto {
    @IsString()
    @MinLength(2)
    fullName: string;

    @IsEmail()
    email: string;

    @IsString()
    @MinLength(8)
    password: string;

    @IsIn(['super_admin', 'operations', 'support', 'finance'])
    role: AdminRole;

    // Ignored server-side when role === 'super_admin' (they get every
    // permission implicitly), but validated regardless so the request
    // shape stays predictable.
    @IsOptional()
    @IsArray()
    @ArrayUnique()
    @IsIn(ADMIN_PERMISSIONS, { each: true })
    permissions?: AdminPermission[];

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}

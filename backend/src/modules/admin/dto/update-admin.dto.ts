import { ArrayUnique, IsArray, IsBoolean, IsEmail, IsIn, IsOptional, IsString, MinLength } from 'class-validator';
import { ADMIN_PERMISSIONS, AdminPermission } from '../permissions.constants';
import type { AdminRole } from '../../../entities/admin.entity';

export class UpdateAdminDto {
    @IsOptional()
    @IsString()
    @MinLength(2)
    fullName?: string;

    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    @IsString()
    @MinLength(8)
    password?: string;

    @IsOptional()
    @IsIn(['super_admin', 'operations', 'support', 'finance'])
    role?: AdminRole;

    @IsOptional()
    @IsArray()
    @ArrayUnique()
    @IsIn(ADMIN_PERMISSIONS, { each: true })
    permissions?: AdminPermission[];

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}

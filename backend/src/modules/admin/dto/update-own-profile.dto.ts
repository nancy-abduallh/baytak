import { IsOptional, IsString, MinLength, ValidateIf } from 'class-validator';

export class UpdateOwnProfileDto {
    @IsOptional()
    @IsString()
    @MinLength(2)
    fullName?: string;

    @IsOptional()
    @IsString()
    @MinLength(8)
    newPassword?: string;

    // Required whenever newPassword is supplied — an admin must prove
    // they know the current password before setting a new one, even for
    // their own account.
    @ValidateIf((o) => !!o.newPassword)
    @IsString()
    @MinLength(1)
    currentPassword?: string;
}

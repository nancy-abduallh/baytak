import { IsBoolean } from 'class-validator';

export class UpdateTechnicianVerifiedDto {
    @IsBoolean()
    isVerified: boolean;
}

export class UpdateTechnicianActiveDto {
    @IsBoolean()
    isActive: boolean;
}
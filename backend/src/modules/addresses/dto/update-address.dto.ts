import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateAddressDto {
    @IsOptional()
    @IsString()
    label?: string;

    @IsOptional()
    @IsString()
    city?: string;

    @IsOptional()
    @IsString()
    district?: string;

    @IsOptional()
    @IsString()
    street?: string;

    @IsOptional()
    @IsBoolean()
    isDefault?: boolean;
}
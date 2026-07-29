import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateAddressDto {
    @IsOptional()
    @IsString()
    label?: string;

    @IsString()
    city: string;

    @IsString()
    district: string;

    @IsOptional()
    @IsString()
    street?: string;

    @IsOptional()
    @IsBoolean()
    isDefault?: boolean;
}
import { Type } from 'class-transformer';
import {
    ArrayNotEmpty,
    IsArray,
    IsBoolean,
    IsEmail,
    IsInt,
    IsNumber,
    IsOptional,
    IsString,
    Matches,
    Min,
    MinLength,
} from 'class-validator';

export class CreateTechnicianDto {
    @IsString()
    @MinLength(3)
    fullName: string;

    @Matches(/^05\d{8}$/, { message: 'أدخل رقم جوال سعودي صحيح (يبدأ بـ 05 ويتكون من 10 أرقام)' })
    phone: string;

    @IsOptional()
    @IsEmail()
    email?: string;

    @IsString()
    @MinLength(8, { message: 'كلمة المرور يجب ألا تقل عن 8 أحرف' })
    password: string;

    @Type(() => Number)
    @IsInt()
    primaryCategoryId: number;

    @IsOptional()
    @IsArray()
    @ArrayNotEmpty()
    @Type(() => Number)
    categoryIds?: number[];

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(0)
    yearsExperience?: number;

    @IsString()
    city: string;

    @IsString()
    district: string;

    @Type(() => Number)
    @IsNumber()
    @Min(0)
    priceFrom: number;

    @IsOptional()
    @IsBoolean()
    isVerified?: boolean;

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}
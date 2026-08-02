import { Type } from 'class-transformer';
import { IsBoolean, IsInt, IsNumber, IsOptional, IsString, Matches, Min, MinLength } from 'class-validator';

export class CreateCategoryDto {
    @IsString()
    @MinLength(2)
    nameAr: string;

    @Matches(/^[a-z0-9-]+$/, { message: 'المعرّف (slug) يجب أن يحتوي على أحرف إنجليزية صغيرة وأرقام وشرطات فقط' })
    slug: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsString()
    iconKey: string;

    @Type(() => Number)
    @IsNumber()
    @Min(0)
    priceFrom: number;

    @IsOptional()
    @IsString()
    priceUnit?: string;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    sortOrder?: number;

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}
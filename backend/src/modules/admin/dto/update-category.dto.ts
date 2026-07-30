import { IsBoolean, IsNumber, IsOptional, Min } from 'class-validator';

export class UpdateCategoryDto {
    @IsOptional()
    @IsNumber()
    @Min(0)
    priceFrom?: number;

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}
import { IsInt, IsISO8601, IsOptional, IsString, Min } from 'class-validator';

export class CreateOrderDto {
    @IsInt()
    categoryId: number;

    @IsInt()
    addressId: number;

    @IsOptional()
    @IsInt()
    technicianId?: number;

    @IsOptional()
    @IsString()
    description?: string;

    @IsISO8601()
    scheduledDate: string;

    @IsOptional()
    @IsString()
    scheduledSlot?: string;

    @Min(0)
    amount: number;
}
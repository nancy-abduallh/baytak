import { IsIn, IsOptional, IsString } from 'class-validator';

export class UpdateOrderStatusDto {
    @IsIn(['confirmed', 'in_progress', 'completed', 'cancelled'])
    status: 'confirmed' | 'in_progress' | 'completed' | 'cancelled';

    @IsOptional()
    @IsString()
    note?: string;
}
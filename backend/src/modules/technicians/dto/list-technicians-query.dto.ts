import { IsIn, IsNumberString, IsOptional } from 'class-validator';

export class ListTechniciansQueryDto {
    @IsOptional()
    category?: string;

    @IsOptional()
    @IsNumberString()
    minRating?: string;

    @IsOptional()
    @IsNumberString()
    maxPrice?: string;

    @IsOptional()
    @IsIn(['rating', 'price', 'experience'])
    sortBy?: 'rating' | 'price' | 'experience';
}
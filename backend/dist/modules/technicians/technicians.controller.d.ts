import { TechniciansService } from './technicians.service';
import { ListTechniciansQueryDto } from './dto/list-technicians-query.dto';
export declare class TechniciansController {
    private readonly service;
    constructor(service: TechniciansService);
    findAll(query: ListTechniciansQueryDto): Promise<{
        id: number;
        fullName: string;
        initials: string;
        avatarUrl: string | null;
        primaryCategoryId: number;
        categorySlug: string;
        categoryLabel: string;
        yearsExperience: number;
        city: string;
        district: string;
        priceFrom: number;
        isVerified: boolean;
        averageRating: number;
        reviewCount: number;
    }[]>;
    findOne(id: number): Promise<{
        id: number;
        fullName: string;
        initials: string;
        avatarUrl: string | null;
        primaryCategoryId: number;
        categorySlug: string;
        categoryLabel: string;
        yearsExperience: number;
        city: string;
        district: string;
        priceFrom: number;
        isVerified: boolean;
        averageRating: number;
        reviewCount: number;
    }>;
}

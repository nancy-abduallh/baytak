import { Repository } from 'typeorm';
import { Technician } from '../../entities/technician.entity';
import { ServiceCategory } from '../../entities/service-category.entity';
import { ListTechniciansQueryDto } from './dto/list-technicians-query.dto';
export declare class TechniciansService {
    private readonly technicians;
    private readonly categories;
    constructor(technicians: Repository<Technician>, categories: Repository<ServiceCategory>);
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
    private toResponse;
}

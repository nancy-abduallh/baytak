import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Technician } from '../../entities/technician.entity';
import { ServiceCategory } from '../../entities/service-category.entity';
import { ListTechniciansQueryDto } from './dto/list-technicians-query.dto';

@Injectable()
export class TechniciansService {
    constructor(
        @InjectRepository(Technician) private readonly technicians: Repository<Technician>,
        @InjectRepository(ServiceCategory) private readonly categories: Repository<ServiceCategory>,
    ) { }

    async findAll(query: ListTechniciansQueryDto) {
        const qb = this.technicians
            .createQueryBuilder('t')
            .leftJoinAndSelect('t.primaryCategory', 'category')
            .where('t.isActive = :active', { active: true });

        if (query.category) {
            const category = await this.categories.findOne({ where: { slug: query.category } });
            if (!category) throw new NotFoundException('الفئة غير موجودة');
            qb.andWhere('t.primaryCategoryId = :categoryId', { categoryId: category.id });
        }
        if (query.minRating) qb.andWhere('t.averageRating >= :minRating', { minRating: parseFloat(query.minRating) });
        if (query.maxPrice) qb.andWhere('t.priceFrom <= :maxPrice', { maxPrice: parseFloat(query.maxPrice) });

        const sortColumn = { rating: 't.averageRating', price: 't.priceFrom', experience: 't.yearsExperience' }[query.sortBy ?? 'rating'];
        qb.orderBy(sortColumn, 'DESC');

        const rows = await qb.getMany();
        return rows.map((t) => this.toResponse(t));
    }

    async findOne(id: number) {
        const technician = await this.technicians.findOne({ where: { id }, relations: ['primaryCategory'] });
        if (!technician) throw new NotFoundException('الفني غير موجود');
        return this.toResponse(technician);
    }

    private toResponse(t: Technician) {
        return {
            id: t.id,
            fullName: t.fullName,
            initials: t.initials,
            avatarUrl: t.avatarUrl,
            primaryCategoryId: t.primaryCategoryId,
            categorySlug: t.primaryCategory?.slug,
            categoryLabel: t.primaryCategory?.nameAr,
            yearsExperience: t.yearsExperience,
            city: t.city,
            district: t.district,
            priceFrom: t.priceFrom,
            isVerified: t.isVerified,
            averageRating: t.averageRating,
            reviewCount: t.reviewCount,
        };
    }
}
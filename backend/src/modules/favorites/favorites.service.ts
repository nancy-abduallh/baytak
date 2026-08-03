import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Favorite } from '../../entities/favorite.entity';
import { Technician } from '../../entities/technician.entity';

@Injectable()
export class FavoritesService {
    constructor(
        @InjectRepository(Favorite) private readonly favorites: Repository<Favorite>,
        @InjectRepository(Technician) private readonly technicians: Repository<Technician>,
    ) { }

    async findMine(userId: number) {
        const rows = await this.favorites.find({
            where: { userId },
            relations: ['technician', 'technician.primaryCategory'],
            order: { createdAt: 'DESC' },
        });

        return rows
            .filter((f) => !!f.technician)
            .map((f) => this.toTechnicianResponse(f.technician));
    }

    async listFavoriteTechnicianIds(userId: number) {
        const rows = await this.favorites.find({ where: { userId } });
        return rows.map((r) => r.technicianId);
    }

    async add(userId: number, technicianId: number) {
        const technician = await this.technicians.findOneBy({ id: technicianId });
        if (!technician) throw new NotFoundException('الفني غير موجود');

        const existing = await this.favorites.findOne({ where: { userId, technicianId } });
        if (existing) return { favorited: true };

        await this.favorites.save(this.favorites.create({ userId, technicianId }));
        return { favorited: true };
    }

    async remove(userId: number, technicianId: number) {
        await this.favorites.delete({ userId, technicianId });
        return { favorited: false };
    }

    private toTechnicianResponse(t: Technician) {
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
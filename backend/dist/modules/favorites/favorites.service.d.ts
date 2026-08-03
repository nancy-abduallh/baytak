import { Repository } from 'typeorm';
import { Favorite } from '../../entities/favorite.entity';
import { Technician } from '../../entities/technician.entity';
export declare class FavoritesService {
    private readonly favorites;
    private readonly technicians;
    constructor(favorites: Repository<Favorite>, technicians: Repository<Technician>);
    findMine(userId: number): Promise<{
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
    listFavoriteTechnicianIds(userId: number): Promise<number[]>;
    add(userId: number, technicianId: number): Promise<{
        favorited: boolean;
    }>;
    remove(userId: number, technicianId: number): Promise<{
        favorited: boolean;
    }>;
    private toTechnicianResponse;
}

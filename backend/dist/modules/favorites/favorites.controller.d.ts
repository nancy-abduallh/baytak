import { FavoritesService } from './favorites.service';
export declare class FavoritesController {
    private readonly service;
    constructor(service: FavoritesService);
    findMine(user: {
        id: number;
    }): Promise<{
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
    findMineIds(user: {
        id: number;
    }): Promise<number[]>;
    add(user: {
        id: number;
    }, technicianId: number): Promise<{
        favorited: boolean;
    }>;
    remove(user: {
        id: number;
    }, technicianId: number): Promise<{
        favorited: boolean;
    }>;
}

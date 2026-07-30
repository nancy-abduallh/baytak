import { ServiceCategory } from './service-category.entity';
export declare class Technician {
    id: number;
    fullName: string;
    initials: string;
    phone: string;
    email: string | null;
    passwordHash: string;
    avatarUrl: string | null;
    primaryCategoryId: number;
    primaryCategory: ServiceCategory;
    categories: ServiceCategory[];
    yearsExperience: number;
    city: string;
    district: string;
    lat: number | null;
    lng: number | null;
    priceFrom: number;
    isVerified: boolean;
    isActive: boolean;
    averageRating: number;
    reviewCount: number;
    createdAt: Date;
    updatedAt: Date;
}

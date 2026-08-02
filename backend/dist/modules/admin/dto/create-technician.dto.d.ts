export declare class CreateTechnicianDto {
    fullName: string;
    phone: string;
    email?: string;
    password: string;
    primaryCategoryId: number;
    categoryIds?: number[];
    yearsExperience?: number;
    city: string;
    district: string;
    priceFrom: number;
    isVerified?: boolean;
    isActive?: boolean;
}

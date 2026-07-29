export type ServiceCategorySlug =
    | "plumbing" | "electrical" | "ac" | "carpentry" | "painting" | "cleaning";

export interface ServiceCategory {
    id: number;
    slug: ServiceCategorySlug;
    nameAr: string;
    description: string;
    iconKey: string;
    priceFrom: number;
    priceUnit: string;
}

export interface Technician {
    id: number;
    fullName: string;
    initials: string;
    avatarUrl?: string | null;
    primaryCategoryId: number;
    categorySlug: ServiceCategorySlug;
    categoryLabel: string;
    yearsExperience: number;
    city: string;
    district: string;
    distanceKm?: number;
    priceFrom: number;
    isVerified: boolean;
    averageRating: number;
    reviewCount: number;
}

export type OrderStatus = "pending" | "confirmed" | "in_progress" | "completed" | "cancelled";

export interface Order {
    id: number;
    orderNumber: string;              // "#1010"
    categoryId: number;
    categorySlug: ServiceCategorySlug;
    categoryLabel: string;
    categoryIconKey: string;
    technician?: { id: number; fullName: string } | null;
    description: string;
    status: OrderStatus;
    address: string;
    amount: number;
    scheduledDate: string;
}

export interface User {
    id: number;
    fullName: string;
    initials: string;
    phone: string;
    email?: string | null;
    city: string;
    district: string;
}
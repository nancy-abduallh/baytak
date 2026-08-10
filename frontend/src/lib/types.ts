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
    orderNumber: string;
    categoryId: number;
    categorySlug: ServiceCategorySlug;
    categoryLabel: string;
    categoryIconKey: string;
    technician?: { id: number; fullName: string } | null;
    description: string | null;
    status: OrderStatus;
    address: string;
    amount: number;
    scheduledDate: string;
    images: string[];
    hasReview: boolean;
    canReview: boolean;
}

export interface Review {
    id: number;
    rating: number;
    comment: string | null;
    createdAt: string;
    reviewerName: string;
}

export interface User {
    id: number;
    fullName: string;
    phone: string;
    email?: string | null;
    city?: string | null;
    district?: string | null;
}

export interface Address {
    id: number;
    label?: string | null;
    city: string;
    district: string;
    street?: string | null;
    isDefault: boolean;
}

export interface SiteSettings {
    siteName: string;
    footerDescription: string | null;
    availabilityNote: string | null;
    contactPhone: string | null;
    contactWhatsapp: string | null;
    contactEmail: string | null;
    websiteUrl: string | null;
    address: string | null;
    workingHours: string | null;
    facebookUrl: string | null;
    twitterUrl: string | null;
    instagramUrl: string | null;
    tiktokUrl: string | null;
    copyrightText: string | null;
    updatedAt: string;
}
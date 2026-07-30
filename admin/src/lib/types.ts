export interface AdminUser {
    id: number;
    fullName: string;
    email: string;
    role: "super_admin" | "operations" | "support";
}

export type OrderStatus = "pending" | "confirmed" | "in_progress" | "completed" | "cancelled";

export interface AdminOrderRow {
    id: number;
    orderNumber: string;
    customerName: string;
    technicianName: string | null;
    categoryLabel: string;
    status: OrderStatus;
    amount: number;
    scheduledDate: string;
    createdAt: string;
}

export interface AdminTechnicianRow {
    id: number;
    fullName: string;
    phone: string;
    categoryLabel: string;
    city: string;
    district: string;
    isVerified: boolean;
    isActive: boolean;
    averageRating: number;
    reviewCount: number;
    completedOrders: number;
}

export interface AdminUserRow {
    id: number;
    fullName: string;
    phone: string;
    email: string | null;
    city: string | null;
    ordersCount: number;
    createdAt: string;
    isBlocked: boolean;
}

export interface AdminCategoryRow {
    id: number;
    nameAr: string;
    slug: string;
    priceFrom: number;
    priceUnit: string;
    technicianCount: number;
    isActive: boolean;
}

export interface DashboardStats {
    ordersToday: number;
    ordersInProgress: number;
    revenueThisMonth: number;
    activeTechnicians: number;
    pendingVerifications: number;
    newUsersThisWeek: number;
}
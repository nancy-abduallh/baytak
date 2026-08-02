export type PermissionKey =
    | "dashboard.view"
    | "orders.view"
    | "orders.update_status"
    | "orders.delete"
    | "technicians.manage"
    | "users.manage"
    | "categories.manage"
    | "admins.manage";

export interface AdminUser {
    id: number;
    fullName: string;
    email: string;
    role: "super_admin" | "operations" | "support" | "finance";
    permissions: PermissionKey[];
    isActive?: boolean;
}

export interface AdminRow {
    id: number;
    fullName: string;
    email: string;
    role: AdminUser["role"];
    permissions: PermissionKey[];
    isActive: boolean;
    createdAt: string;
}

export interface CreateAdminPayload {
    fullName: string;
    email: string;
    password: string;
    role: AdminUser["role"];
    permissions: PermissionKey[];
    isActive?: boolean;
}

export type UpdateAdminPayload = Partial<Omit<CreateAdminPayload, "password">> & { password?: string };

export interface UpdateOwnProfilePayload {
    fullName?: string;
    currentPassword?: string;
    newPassword?: string;
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
    email: string | null;
    categoryLabel: string;
    primaryCategoryId: number;
    city: string;
    district: string;
    yearsExperience: number;
    priceFrom: number;
    isVerified: boolean;
    isActive: boolean;
    averageRating: number;
    reviewCount: number;
    completedOrders: number;
}

export interface CreateTechnicianPayload {
    fullName: string;
    phone: string;
    email?: string;
    password: string;
    primaryCategoryId: number;
    yearsExperience?: number;
    city: string;
    district: string;
    priceFrom: number;
    isVerified?: boolean;
    isActive?: boolean;
}

export type UpdateTechnicianPayload = Partial<Omit<CreateTechnicianPayload, "password">> & { password?: string };

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
    description: string | null;
    iconKey: string;
    priceFrom: number;
    priceUnit: string;
    sortOrder: number;
    technicianCount: number;
    isActive: boolean;
}

export interface CreateCategoryPayload {
    nameAr: string;
    slug: string;
    description?: string;
    iconKey: string;
    priceFrom: number;
    priceUnit?: string;
    sortOrder?: number;
    isActive?: boolean;
}

export type UpdateCategoryPayload = Partial<CreateCategoryPayload>;

export interface DashboardStats {
    ordersToday: number;
    ordersInProgress: number;
    revenueThisMonth: number;
    activeTechnicians: number;
    pendingVerifications: number;
    newUsersThisWeek: number;
}

export interface DashboardAnalytics {
    ordersLast14Days: { date: string; orders: number }[];
    ordersByStatus: { status: OrderStatus; count: number }[];
    topCategories: { label: string; count: number }[];
    revenueLast6Months: { month: string; revenue: number; orders: number }[];
}
import { AdminService } from './admin.service';
import { UpdateOrderStatusDto } from '../orders/dto/update-order-status.dto';
import { UpdateTechnicianVerifiedDto, UpdateTechnicianActiveDto } from './dto/technician-flags.dto';
import { UpdateUserBlockedDto } from './dto/update-user-blocked.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import type { OrderStatus } from '../../entities/order.entity';
export declare class AdminController {
    private readonly admin;
    constructor(admin: AdminService);
    getStats(): Promise<{
        ordersToday: number;
        ordersInProgress: number;
        revenueThisMonth: number;
        activeTechnicians: number;
        pendingVerifications: number;
        newUsersThisWeek: number;
    }>;
    getOrders(status?: OrderStatus): Promise<{
        id: number;
        orderNumber: string;
        customerName: string;
        technicianName: string | null;
        categoryLabel: string;
        status: OrderStatus;
        amount: number;
        scheduledDate: string;
        createdAt: string;
    }[]>;
    updateOrderStatus(id: number, dto: UpdateOrderStatusDto): Promise<{
        id: number;
        orderNumber: string;
        customerName: string;
        technicianName: string | null;
        categoryLabel: string;
        status: OrderStatus;
        amount: number;
        scheduledDate: string;
        createdAt: string;
    }>;
    getTechnicians(): Promise<{
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
    }[]>;
    setTechnicianVerified(id: number, dto: UpdateTechnicianVerifiedDto): Promise<{
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
    }>;
    setTechnicianActive(id: number, dto: UpdateTechnicianActiveDto): Promise<{
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
    }>;
    getUsers(): Promise<{
        id: number;
        fullName: string;
        phone: string;
        email: string | null;
        city: string | null;
        isBlocked: boolean;
        orderCount: number;
        createdAt: string;
    }[]>;
    setUserBlocked(id: number, dto: UpdateUserBlockedDto): Promise<{
        id: number;
        fullName: string;
        phone: string;
        email: string | null;
        city: string | null;
        isBlocked: boolean;
        orderCount: number;
        createdAt: string;
    }>;
    getCategories(): Promise<import("../../entities/service-category.entity").ServiceCategory[]>;
    updateCategory(id: number, dto: UpdateCategoryDto): Promise<import("../../entities/service-category.entity").ServiceCategory>;
}

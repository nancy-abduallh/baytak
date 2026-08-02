import { Repository } from 'typeorm';
import { Order, OrderStatus } from '../../entities/order.entity';
import { User } from '../../entities/user.entity';
import { Technician } from '../../entities/technician.entity';
import { ServiceCategory } from '../../entities/service-category.entity';
import { OrdersService } from '../orders/orders.service';
import { UpdateOrderStatusDto } from '../orders/dto/update-order-status.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CreateTechnicianDto } from './dto/create-technician.dto';
import { UpdateTechnicianDto } from './dto/update-technician.dto';
export declare class AdminService {
    private readonly orders;
    private readonly users;
    private readonly technicians;
    private readonly categories;
    private readonly ordersService;
    constructor(orders: Repository<Order>, users: Repository<User>, technicians: Repository<Technician>, categories: Repository<ServiceCategory>, ordersService: OrdersService);
    getStats(): Promise<{
        ordersToday: number;
        ordersInProgress: number;
        revenueThisMonth: number;
        activeTechnicians: number;
        pendingVerifications: number;
        newUsersThisWeek: number;
    }>;
    getAnalytics(): Promise<{
        ordersLast14Days: {
            date: string;
            orders: number;
        }[];
        ordersByStatus: {
            status: OrderStatus;
            count: number;
        }[];
        topCategories: {
            label: string;
            count: number;
        }[];
        revenueLast6Months: {
            month: string;
            revenue: number;
            orders: number;
        }[];
    }>;
    private toDateKey;
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
    private toOrderRow;
    getTechnicians(): Promise<{
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
    }[]>;
    createTechnician(dto: CreateTechnicianDto): Promise<{
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
    }>;
    updateTechnician(id: number, dto: UpdateTechnicianDto): Promise<{
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
    }>;
    deleteTechnician(id: number): Promise<{
        id: number;
        deleted: boolean;
    }>;
    setTechnicianVerified(id: number, isVerified: boolean): Promise<{
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
    }>;
    setTechnicianActive(id: number, isActive: boolean): Promise<{
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
    }>;
    private completedCountFor;
    private toTechnicianRow;
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
    setUserBlocked(id: number, isBlocked: boolean): Promise<{
        id: number;
        fullName: string;
        phone: string;
        email: string | null;
        city: string | null;
        isBlocked: boolean;
        orderCount: number;
        createdAt: string;
    }>;
    private toUserRow;
    getCategories(): Promise<{
        technicianCount: number;
        id: number;
        slug: string;
        nameAr: string;
        description: string | null;
        iconKey: string;
        priceFrom: number;
        priceUnit: string;
        sortOrder: number;
        isActive: boolean;
    }[]>;
    createCategory(dto: CreateCategoryDto): Promise<{
        technicianCount: number;
        id: number;
        slug: string;
        nameAr: string;
        description: string | null;
        iconKey: string;
        priceFrom: number;
        priceUnit: string;
        sortOrder: number;
        isActive: boolean;
    }>;
    updateCategory(id: number, dto: UpdateCategoryDto): Promise<{
        technicianCount: number;
        id: number;
        slug: string;
        nameAr: string;
        description: string | null;
        iconKey: string;
        priceFrom: number;
        priceUnit: string;
        sortOrder: number;
        isActive: boolean;
    }>;
    deleteCategory(id: number): Promise<{
        id: number;
        deleted: boolean;
    }>;
}

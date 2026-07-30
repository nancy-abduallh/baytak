import { Repository } from 'typeorm';
import { Order, OrderStatus } from '../../entities/order.entity';
import { User } from '../../entities/user.entity';
import { Technician } from '../../entities/technician.entity';
import { ServiceCategory } from '../../entities/service-category.entity';
import { OrdersService } from '../orders/orders.service';
import { UpdateOrderStatusDto } from '../orders/dto/update-order-status.dto';
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
        categoryLabel: string;
        city: string;
        district: string;
        isVerified: boolean;
        isActive: boolean;
        averageRating: number;
        reviewCount: number;
        completedOrders: number;
    }[]>;
    setTechnicianVerified(id: number, isVerified: boolean): Promise<{
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
    setTechnicianActive(id: number, isActive: boolean): Promise<{
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
    private completedCountFor;
    private toTechnicianRow;
    getUsers(): Promise<any[]>;
    setUserBlocked(id: number, isBlocked: boolean): Promise<any>;
}

import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
export declare class OrdersController {
    private readonly service;
    constructor(service: OrdersService);
    create(user: {
        id: number;
    }, dto: CreateOrderDto): Promise<{
        id: number;
        orderNumber: string;
        categoryId: number;
        categorySlug: string;
        categoryLabel: string;
        categoryIconKey: string;
        technician: {
            id: number;
            fullName: string;
        } | null;
        description: string | null;
        status: import("../../entities/order.entity").OrderStatus;
        address: string;
        amount: number;
        scheduledDate: string;
        images: string[];
        hasReview: boolean;
        canReview: boolean;
    }>;
    uploadImages(user: {
        id: number;
    }, id: number, files: Express.Multer.File[]): Promise<{
        id: number;
        orderNumber: string;
        categoryId: number;
        categorySlug: string;
        categoryLabel: string;
        categoryIconKey: string;
        technician: {
            id: number;
            fullName: string;
        } | null;
        description: string | null;
        status: import("../../entities/order.entity").OrderStatus;
        address: string;
        amount: number;
        scheduledDate: string;
        images: string[];
        hasReview: boolean;
        canReview: boolean;
    }>;
    findMine(user: {
        id: number;
    }, userId: number): Promise<{
        id: number;
        orderNumber: string;
        categoryId: number;
        categorySlug: string;
        categoryLabel: string;
        categoryIconKey: string;
        technician: {
            id: number;
            fullName: string;
        } | null;
        description: string | null;
        status: import("../../entities/order.entity").OrderStatus;
        address: string;
        amount: number;
        scheduledDate: string;
        images: string[];
        hasReview: boolean;
        canReview: boolean;
    }[]>;
    findOne(user: {
        id: number;
    }, id: number): Promise<{
        id: number;
        orderNumber: string;
        categoryId: number;
        categorySlug: string;
        categoryLabel: string;
        categoryIconKey: string;
        technician: {
            id: number;
            fullName: string;
        } | null;
        description: string | null;
        status: import("../../entities/order.entity").OrderStatus;
        address: string;
        amount: number;
        scheduledDate: string;
        images: string[];
        hasReview: boolean;
        canReview: boolean;
    }>;
    updateStatus(id: number, dto: UpdateOrderStatusDto): Promise<{
        id: number;
        orderNumber: string;
        categoryId: number;
        categorySlug: string;
        categoryLabel: string;
        categoryIconKey: string;
        technician: {
            id: number;
            fullName: string;
        } | null;
        description: string | null;
        status: import("../../entities/order.entity").OrderStatus;
        address: string;
        amount: number;
        scheduledDate: string;
        images: string[];
        hasReview: boolean;
        canReview: boolean;
    }>;
}

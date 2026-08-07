import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Order, OrderStatus } from '../../entities/order.entity';
import { OrderStatusHistory } from '../../entities/order-status-history.entity';
import { OrderImage } from '../../entities/order-image.entity';
import { Review } from '../../entities/review.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
export declare class OrdersService {
    private readonly orders;
    private readonly history;
    private readonly images;
    private readonly reviews;
    private readonly events;
    constructor(orders: Repository<Order>, history: Repository<OrderStatusHistory>, images: Repository<OrderImage>, reviews: Repository<Review>, events: EventEmitter2);
    create(userId: number, dto: CreateOrderDto): Promise<{
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
        status: OrderStatus;
        address: string;
        amount: number;
        scheduledDate: string;
        images: string[];
        hasReview: boolean;
        canReview: boolean;
    }>;
    addImages(orderId: number, userId: number, files: Express.Multer.File[]): Promise<{
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
        status: OrderStatus;
        address: string;
        amount: number;
        scheduledDate: string;
        images: string[];
        hasReview: boolean;
        canReview: boolean;
    }>;
    findMine(userId: number): Promise<{
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
        status: OrderStatus;
        address: string;
        amount: number;
        scheduledDate: string;
        images: string[];
        hasReview: boolean;
        canReview: boolean;
    }[]>;
    findOne(id: number, requesterId?: number): Promise<{
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
        status: OrderStatus;
        address: string;
        amount: number;
        scheduledDate: string;
        images: string[];
        hasReview: boolean;
        canReview: boolean;
    }>;
    private reviewedOrderIds;
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
        status: OrderStatus;
        address: string;
        amount: number;
        scheduledDate: string;
        images: string[];
        hasReview: boolean;
        canReview: boolean;
    }>;
    remove(id: number): Promise<{
        id: number;
        deleted: boolean;
    }>;
    private toResponse;
}

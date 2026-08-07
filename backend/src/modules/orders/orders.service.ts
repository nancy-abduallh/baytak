import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Order, OrderStatus } from '../../entities/order.entity';
import { OrderStatusHistory } from '../../entities/order-status-history.entity';
import { OrderImage } from '../../entities/order-image.entity';
import { Review } from '../../entities/review.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

const ALLOWED_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
    pending: ['confirmed', 'cancelled'],
    confirmed: ['in_progress', 'cancelled'],
    in_progress: ['completed', 'cancelled'],
    completed: [],
    cancelled: [],
};

@Injectable()
export class OrdersService {
    constructor(
        @InjectRepository(Order) private readonly orders: Repository<Order>,
        @InjectRepository(OrderStatusHistory) private readonly history: Repository<OrderStatusHistory>,
        @InjectRepository(OrderImage) private readonly images: Repository<OrderImage>,
        @InjectRepository(Review) private readonly reviews: Repository<Review>,
        private readonly events: EventEmitter2,
    ) { }

    async create(userId: number, dto: CreateOrderDto) {
        const order = await this.orders.save(
            this.orders.create({
                userId,
                categoryId: dto.categoryId,
                addressId: dto.addressId,
                technicianId: dto.technicianId ?? null,
                description: dto.description ?? null,
                scheduledDate: dto.scheduledDate,
                scheduledSlot: dto.scheduledSlot ?? null,
                amount: dto.amount,
                status: 'pending',
            }),
        );
        await this.history.save(this.history.create({ orderId: order.id, status: 'pending', note: 'تم إنشاء الطلب' }));
        return this.findOne(order.id, userId);
    }

    // Optional photos of the problem, attached after the order is created
    // ("إضافة صور بالاختيار"). Only the order's owner may attach photos.
    async addImages(orderId: number, userId: number, files: Express.Multer.File[]) {
        const order = await this.orders.findOneBy({ id: orderId });
        if (!order) throw new NotFoundException('الطلب غير موجود');
        if (order.userId !== userId) throw new ForbiddenException('لا تملك صلاحية الوصول لهذا الطلب');

        const rows = files.map((file) =>
            this.images.create({ orderId, imageUrl: `/uploads/orders/${file.filename}` }),
        );
        await this.images.save(rows);

        return this.findOne(orderId, userId);
    }

    async findMine(userId: number) {
        const rows = await this.orders.find({
            where: { userId },
            relations: ['technician', 'category', 'address', 'images'],
            order: { createdAt: 'DESC' },
        });
        const reviewedOrderIds = await this.reviewedOrderIds(rows.map((o) => o.id));
        return rows.map((o) => this.toResponse(o, reviewedOrderIds.has(o.id)));
    }

    async findOne(id: number, requesterId?: number) {
        const order = await this.orders.findOne({
            where: { id },
            relations: ['technician', 'category', 'address', 'statusHistory', 'images'],
        });
        if (!order) throw new NotFoundException('الطلب غير موجود');
        if (requesterId && order.userId !== requesterId) throw new ForbiddenException('لا تملك صلاحية الوصول لهذا الطلب');
        const reviewedOrderIds = await this.reviewedOrderIds([order.id]);
        return this.toResponse(order, reviewedOrderIds.has(order.id));
    }

    private async reviewedOrderIds(orderIds: number[]): Promise<Set<number>> {
        if (orderIds.length === 0) return new Set();
        const rows = await this.reviews.find({ where: orderIds.map((orderId) => ({ orderId })) });
        return new Set(rows.map((r) => r.orderId));
    }

    async updateStatus(id: number, dto: UpdateOrderStatusDto) {
        const order = await this.orders.findOneBy({ id });
        if (!order) throw new NotFoundException('الطلب غير موجود');

        if (!ALLOWED_TRANSITIONS[order.status].includes(dto.status)) {
            throw new BadRequestException(`لا يمكن الانتقال من "${order.status}" إلى "${dto.status}"`);
        }

        order.status = dto.status;
        await this.orders.save(order);
        await this.history.save(this.history.create({ orderId: order.id, status: dto.status, note: dto.note ?? null }));

        // Decoupled from the WebSocket gateway — it just listens for this event.
        this.events.emit('order.status.changed', {
            orderId: order.id,
            status: order.status,
            note: dto.note ?? null,
            changedAt: new Date().toISOString(),
        });

        return this.findOne(id);
    }

    async remove(id: number) {
        const order = await this.orders.findOneBy({ id });
        if (!order) throw new NotFoundException('الطلب غير موجود');

        await this.orders.remove(order);
        // order_status_history, order_images and reviews all cascade on
        // delete at the DB level (see schema.sql), so no manual cleanup
        // is required here.

        this.events.emit('order.deleted', { orderId: id, deletedAt: new Date().toISOString() });

        return { id, deleted: true };
    }

    private toResponse(order: Order, hasReview = false) {
        return {
            id: order.id,
            orderNumber: `#${order.id}`,
            categoryId: order.categoryId,
            categorySlug: order.category?.slug,
            categoryLabel: order.category?.nameAr,
            categoryIconKey: order.category?.iconKey,
            technician: order.technician ? { id: order.technician.id, fullName: order.technician.fullName } : null,
            description: order.description,
            status: order.status,
            address: order.address ? `${order.address.city} - ${order.address.district}` : '',
            amount: order.amount,
            scheduledDate: order.scheduledDate,
            images: (order.images ?? []).map((img) => img.imageUrl),
            hasReview,
            canReview: order.status === 'completed' && !!order.technicianId && !hasReview,
        };
    }
}
import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Order, OrderStatus } from '../../entities/order.entity';
import { OrderStatusHistory } from '../../entities/order-status-history.entity';
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

    async findMine(userId: number) {
        const rows = await this.orders.find({
            where: { userId },
            relations: ['technician', 'category', 'address'],
            order: { createdAt: 'DESC' },
        });
        return rows.map((o) => this.toResponse(o));
    }

    async findOne(id: number, requesterId?: number) {
        const order = await this.orders.findOne({
            where: { id },
            relations: ['technician', 'category', 'address', 'statusHistory'],
        });
        if (!order) throw new NotFoundException('الطلب غير موجود');
        if (requesterId && order.userId !== requesterId) throw new ForbiddenException('لا تملك صلاحية الوصول لهذا الطلب');
        return this.toResponse(order);
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

    private toResponse(order: Order) {
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
        };
    }
}
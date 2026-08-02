"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const event_emitter_1 = require("@nestjs/event-emitter");
const order_entity_1 = require("../../entities/order.entity");
const order_status_history_entity_1 = require("../../entities/order-status-history.entity");
const ALLOWED_TRANSITIONS = {
    pending: ['confirmed', 'cancelled'],
    confirmed: ['in_progress', 'cancelled'],
    in_progress: ['completed', 'cancelled'],
    completed: [],
    cancelled: [],
};
let OrdersService = class OrdersService {
    orders;
    history;
    events;
    constructor(orders, history, events) {
        this.orders = orders;
        this.history = history;
        this.events = events;
    }
    async create(userId, dto) {
        const order = await this.orders.save(this.orders.create({
            userId,
            categoryId: dto.categoryId,
            addressId: dto.addressId,
            technicianId: dto.technicianId ?? null,
            description: dto.description ?? null,
            scheduledDate: dto.scheduledDate,
            scheduledSlot: dto.scheduledSlot ?? null,
            amount: dto.amount,
            status: 'pending',
        }));
        await this.history.save(this.history.create({ orderId: order.id, status: 'pending', note: 'تم إنشاء الطلب' }));
        return this.findOne(order.id, userId);
    }
    async findMine(userId) {
        const rows = await this.orders.find({
            where: { userId },
            relations: ['technician', 'category', 'address'],
            order: { createdAt: 'DESC' },
        });
        return rows.map((o) => this.toResponse(o));
    }
    async findOne(id, requesterId) {
        const order = await this.orders.findOne({
            where: { id },
            relations: ['technician', 'category', 'address', 'statusHistory'],
        });
        if (!order)
            throw new common_1.NotFoundException('الطلب غير موجود');
        if (requesterId && order.userId !== requesterId)
            throw new common_1.ForbiddenException('لا تملك صلاحية الوصول لهذا الطلب');
        return this.toResponse(order);
    }
    async updateStatus(id, dto) {
        const order = await this.orders.findOneBy({ id });
        if (!order)
            throw new common_1.NotFoundException('الطلب غير موجود');
        if (!ALLOWED_TRANSITIONS[order.status].includes(dto.status)) {
            throw new common_1.BadRequestException(`لا يمكن الانتقال من "${order.status}" إلى "${dto.status}"`);
        }
        order.status = dto.status;
        await this.orders.save(order);
        await this.history.save(this.history.create({ orderId: order.id, status: dto.status, note: dto.note ?? null }));
        this.events.emit('order.status.changed', {
            orderId: order.id,
            status: order.status,
            note: dto.note ?? null,
            changedAt: new Date().toISOString(),
        });
        return this.findOne(id);
    }
    async remove(id) {
        const order = await this.orders.findOneBy({ id });
        if (!order)
            throw new common_1.NotFoundException('الطلب غير موجود');
        await this.orders.remove(order);
        this.events.emit('order.deleted', { orderId: id, deletedAt: new Date().toISOString() });
        return { id, deleted: true };
    }
    toResponse(order) {
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
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __param(1, (0, typeorm_1.InjectRepository)(order_status_history_entity_1.OrderStatusHistory)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        event_emitter_1.EventEmitter2])
], OrdersService);
//# sourceMappingURL=orders.service.js.map
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
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const order_entity_1 = require("../../entities/order.entity");
const user_entity_1 = require("../../entities/user.entity");
const technician_entity_1 = require("../../entities/technician.entity");
const service_category_entity_1 = require("../../entities/service-category.entity");
const orders_service_1 = require("../orders/orders.service");
let AdminService = class AdminService {
    orders;
    users;
    technicians;
    categories;
    ordersService;
    constructor(orders, users, technicians, categories, ordersService) {
        this.orders = orders;
        this.users = users;
        this.technicians = technicians;
        this.categories = categories;
        this.ordersService = ordersService;
    }
    async getStats() {
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);
        const endOfToday = new Date();
        endOfToday.setHours(23, 59, 59, 999);
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);
        const startOfWeek = new Date();
        startOfWeek.setDate(startOfWeek.getDate() - 7);
        const [ordersToday, ordersInProgress, activeTechnicians, pendingVerifications, newUsersThisWeek] = await Promise.all([
            this.orders.count({ where: { createdAt: (0, typeorm_2.Between)(startOfToday, endOfToday) } }),
            this.orders.count({ where: { status: 'in_progress' } }),
            this.technicians.count({ where: { isActive: true } }),
            this.technicians.count({ where: { isVerified: false } }),
            this.users.count({ where: { createdAt: (0, typeorm_2.Between)(startOfWeek, new Date()) } }),
        ]);
        const revenueRow = await this.orders
            .createQueryBuilder('o')
            .select('COALESCE(SUM(o.amount), 0)', 'total')
            .where('o.createdAt >= :start', { start: startOfMonth })
            .andWhere('o.status = :status', { status: 'completed' })
            .getRawOne();
        return {
            ordersToday,
            ordersInProgress,
            revenueThisMonth: parseFloat(revenueRow?.total ?? '0') || 0,
            activeTechnicians,
            pendingVerifications,
            newUsersThisWeek,
        };
    }
    async getOrders(status) {
        const qb = this.orders
            .createQueryBuilder('o')
            .leftJoinAndSelect('o.user', 'user')
            .leftJoinAndSelect('o.technician', 'technician')
            .leftJoinAndSelect('o.category', 'category')
            .orderBy('o.createdAt', 'DESC');
        if (status)
            qb.andWhere('o.status = :status', { status });
        const rows = await qb.getMany();
        return rows.map((o) => this.toOrderRow(o));
    }
    async updateOrderStatus(id, dto) {
        await this.ordersService.updateStatus(id, dto);
        const order = await this.orders.findOne({ where: { id }, relations: ['user', 'technician', 'category'] });
        if (!order)
            throw new common_1.NotFoundException('الطلب غير موجود');
        return this.toOrderRow(order);
    }
    toOrderRow(o) {
        return {
            id: o.id,
            orderNumber: `#${o.id}`,
            customerName: o.user?.fullName ?? '—',
            technicianName: o.technician?.fullName ?? null,
            categoryLabel: o.category?.nameAr ?? '',
            status: o.status,
            amount: o.amount,
            scheduledDate: o.scheduledDate,
            createdAt: o.createdAt?.toISOString().slice(0, 10),
        };
    }
    async getTechnicians() {
        const rows = await this.technicians.find({ relations: ['primaryCategory'] });
        const completedCounts = await this.orders
            .createQueryBuilder('o')
            .select('o.technicianId', 'technicianId')
            .addSelect('COUNT(*)', 'count')
            .where('o.status = :status', { status: 'completed' })
            .groupBy('o.technicianId')
            .getRawMany();
        const countMap = new Map(completedCounts.map((c) => [Number(c.technicianId), parseInt(c.count, 10)]));
        return rows.map((t) => this.toTechnicianRow(t, countMap.get(t.id) ?? 0));
    }
    async setTechnicianVerified(id, isVerified) {
        const technician = await this.technicians.findOne({ where: { id }, relations: ['primaryCategory'] });
        if (!technician)
            throw new common_1.NotFoundException('الفني غير موجود');
        technician.isVerified = isVerified;
        await this.technicians.save(technician);
        return this.toTechnicianRow(technician, await this.completedCountFor(id));
    }
    async setTechnicianActive(id, isActive) {
        const technician = await this.technicians.findOne({ where: { id }, relations: ['primaryCategory'] });
        if (!technician)
            throw new common_1.NotFoundException('الفني غير موجود');
        technician.isActive = isActive;
        await this.technicians.save(technician);
        return this.toTechnicianRow(technician, await this.completedCountFor(id));
    }
    completedCountFor(technicianId) {
        return this.orders.count({ where: { technicianId, status: 'completed' } });
    }
    toTechnicianRow(t, completedOrders) {
        return {
            id: t.id,
            fullName: t.fullName,
            phone: t.phone,
            categoryLabel: t.primaryCategory?.nameAr ?? '',
            city: t.city,
            district: t.district,
            isVerified: t.isVerified,
            isActive: t.isActive,
            averageRating: t.averageRating,
            reviewCount: t.reviewCount,
            completedOrders,
        };
    }
    async getUsers() {
        const rows = await this.users.find({ order: { createdAt: 'DESC' } });
        const orderCounts = await this.orders
            .createQueryBuilder('o')
            .select('o.userId', 'userId')
            .addSelect('COUNT(*)', 'count')
            .groupBy('o.userId')
            .getRawMany();
        const countMap = new Map(orderCounts.map((c) => [Number(c.userId), parseInt(c.count, 10)]));
        return rows.map((u) => this.toUserRow(u, countMap.get(u.id) ?? 0));
    }
    async setUserBlocked(id, isBlocked) {
        const user = await this.users.findOne({ where: { id } });
        if (!user)
            throw new common_1.NotFoundException('المستخدم غير موجود');
        user.isActive = !isBlocked;
        await this.users.save(user);
        const count = await this.orders.count({ where: { userId: id } });
        return this.toUserRow(user, count);
    }
    toUserRow(u, orderCount) {
        return {
            id: u.id,
            fullName: u.fullName,
            phone: u.phone,
            email: u.email,
            city: u.city,
            isBlocked: !u.isActive,
            orderCount,
            createdAt: u.createdAt?.toISOString().slice(0, 10),
        };
    }
    getCategories() {
        return this.categories.find({ order: { sortOrder: 'ASC' } });
    }
    async updateCategory(id, dto) {
        const category = await this.categories.findOne({ where: { id } });
        if (!category)
            throw new common_1.NotFoundException('الفئة غير موجودة');
        if (dto.priceFrom !== undefined)
            category.priceFrom = dto.priceFrom;
        if (dto.isActive !== undefined)
            category.isActive = dto.isActive;
        return this.categories.save(category);
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(2, (0, typeorm_1.InjectRepository)(technician_entity_1.Technician)),
    __param(3, (0, typeorm_1.InjectRepository)(service_category_entity_1.ServiceCategory)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        orders_service_1.OrdersService])
], AdminService);
//# sourceMappingURL=admin.service.js.map
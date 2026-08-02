"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const bcrypt = __importStar(require("bcrypt"));
const order_entity_1 = require("../../entities/order.entity");
const user_entity_1 = require("../../entities/user.entity");
const technician_entity_1 = require("../../entities/technician.entity");
const service_category_entity_1 = require("../../entities/service-category.entity");
const orders_service_1 = require("../orders/orders.service");
const SALT_ROUNDS = 12;
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
    async getAnalytics() {
        const fourteenDaysAgo = new Date();
        fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 13);
        fourteenDaysAgo.setHours(0, 0, 0, 0);
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
        sixMonthsAgo.setDate(1);
        sixMonthsAgo.setHours(0, 0, 0, 0);
        const [dailyRaw, statusRaw, categoryRaw, monthlyRaw] = await Promise.all([
            this.orders
                .createQueryBuilder('o')
                .select('DATE(o.createdAt)', 'day')
                .addSelect('COUNT(*)', 'count')
                .where('o.createdAt >= :start', { start: fourteenDaysAgo })
                .groupBy('DATE(o.createdAt)')
                .orderBy('day', 'ASC')
                .getRawMany(),
            this.orders
                .createQueryBuilder('o')
                .select('o.status', 'status')
                .addSelect('COUNT(*)', 'count')
                .groupBy('o.status')
                .getRawMany(),
            this.orders
                .createQueryBuilder('o')
                .leftJoin('o.category', 'category')
                .select('category.nameAr', 'label')
                .addSelect('COUNT(*)', 'count')
                .groupBy('category.nameAr')
                .orderBy('count', 'DESC')
                .limit(6)
                .getRawMany(),
            this.orders
                .createQueryBuilder('o')
                .select("DATE_FORMAT(o.createdAt, '%Y-%m')", 'month')
                .addSelect('COALESCE(SUM(CASE WHEN o.status = :completed THEN o.amount ELSE 0 END), 0)', 'revenue')
                .addSelect('COUNT(*)', 'count')
                .where('o.createdAt >= :start', { start: sixMonthsAgo })
                .setParameter('completed', 'completed')
                .groupBy('month')
                .orderBy('month', 'ASC')
                .getRawMany(),
        ]);
        const dayMap = new Map(dailyRaw.map((d) => [this.toDateKey(d.day), parseInt(d.count, 10)]));
        const ordersLast14Days = Array.from({ length: 14 }).map((_, idx) => {
            const date = new Date(fourteenDaysAgo);
            date.setDate(date.getDate() + idx);
            const key = this.toDateKey(date);
            return { date: key, orders: dayMap.get(key) ?? 0 };
        });
        const monthMap = new Map(monthlyRaw.map((m) => [m.month, { revenue: parseFloat(m.revenue) || 0, orders: parseInt(m.count, 10) }]));
        const revenueLast6Months = Array.from({ length: 6 }).map((_, idx) => {
            const date = new Date(sixMonthsAgo);
            date.setMonth(date.getMonth() + idx);
            const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            const entry = monthMap.get(key);
            return { month: key, revenue: entry?.revenue ?? 0, orders: entry?.orders ?? 0 };
        });
        const ordersByStatus = statusRaw.map((s) => ({ status: s.status, count: parseInt(s.count, 10) }));
        const topCategories = categoryRaw.map((c) => ({ label: c.label ?? '—', count: parseInt(c.count, 10) }));
        return { ordersLast14Days, ordersByStatus, topCategories, revenueLast6Months };
    }
    toDateKey(value) {
        const date = typeof value === 'string' ? new Date(value) : value;
        return date.toISOString().slice(0, 10);
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
    async createTechnician(dto) {
        const existingPhone = await this.technicians.findOne({ where: { phone: dto.phone } });
        if (existingPhone)
            throw new common_1.ConflictException('رقم الجوال مستخدم بالفعل لفني آخر');
        if (dto.email) {
            const existingEmail = await this.technicians.findOne({ where: { email: dto.email } });
            if (existingEmail)
                throw new common_1.ConflictException('البريد الإلكتروني مستخدم بالفعل لفني آخر');
        }
        const category = await this.categories.findOne({ where: { id: dto.primaryCategoryId } });
        if (!category)
            throw new common_1.BadRequestException('فئة الخدمة الأساسية غير موجودة');
        const passwordHash = await bcrypt.hash(dto.password, SALT_ROUNDS);
        const initials = dto.fullName.trim().slice(0, 2);
        const additionalCategories = dto.categoryIds?.length
            ? await this.categories.find({ where: { id: (0, typeorm_2.In)(dto.categoryIds) } })
            : [];
        const technician = this.technicians.create({
            fullName: dto.fullName,
            initials,
            phone: dto.phone,
            email: dto.email ?? null,
            passwordHash,
            primaryCategoryId: dto.primaryCategoryId,
            categories: additionalCategories,
            yearsExperience: dto.yearsExperience ?? 0,
            city: dto.city,
            district: dto.district,
            priceFrom: dto.priceFrom,
            isVerified: dto.isVerified ?? false,
            isActive: dto.isActive ?? true,
        });
        const saved = await this.technicians.save(technician);
        const withCategory = await this.technicians.findOne({ where: { id: saved.id }, relations: ['primaryCategory'] });
        return this.toTechnicianRow(withCategory, 0);
    }
    async updateTechnician(id, dto) {
        const technician = await this.technicians.findOne({ where: { id }, relations: ['primaryCategory'] });
        if (!technician)
            throw new common_1.NotFoundException('الفني غير موجود');
        if (dto.phone && dto.phone !== technician.phone) {
            const existingPhone = await this.technicians.findOne({ where: { phone: dto.phone } });
            if (existingPhone && existingPhone.id !== id)
                throw new common_1.ConflictException('رقم الجوال مستخدم بالفعل لفني آخر');
            technician.phone = dto.phone;
        }
        if (dto.email !== undefined && dto.email !== technician.email) {
            if (dto.email) {
                const existingEmail = await this.technicians.findOne({ where: { email: dto.email } });
                if (existingEmail && existingEmail.id !== id)
                    throw new common_1.ConflictException('البريد الإلكتروني مستخدم بالفعل لفني آخر');
            }
            technician.email = dto.email ?? null;
        }
        if (dto.password)
            technician.passwordHash = await bcrypt.hash(dto.password, SALT_ROUNDS);
        if (dto.fullName) {
            technician.fullName = dto.fullName;
            technician.initials = dto.fullName.trim().slice(0, 2);
        }
        if (dto.primaryCategoryId !== undefined) {
            const category = await this.categories.findOne({ where: { id: dto.primaryCategoryId } });
            if (!category)
                throw new common_1.BadRequestException('فئة الخدمة الأساسية غير موجودة');
            technician.primaryCategoryId = dto.primaryCategoryId;
        }
        if (dto.categoryIds) {
            technician.categories = dto.categoryIds.length
                ? await this.categories.find({ where: { id: (0, typeorm_2.In)(dto.categoryIds) } })
                : [];
        }
        if (dto.yearsExperience !== undefined)
            technician.yearsExperience = dto.yearsExperience;
        if (dto.city)
            technician.city = dto.city;
        if (dto.district)
            technician.district = dto.district;
        if (dto.priceFrom !== undefined)
            technician.priceFrom = dto.priceFrom;
        if (dto.isVerified !== undefined)
            technician.isVerified = dto.isVerified;
        if (dto.isActive !== undefined)
            technician.isActive = dto.isActive;
        await this.technicians.save(technician);
        const refreshed = await this.technicians.findOne({ where: { id }, relations: ['primaryCategory'] });
        return this.toTechnicianRow(refreshed, await this.completedCountFor(id));
    }
    async deleteTechnician(id) {
        const technician = await this.technicians.findOne({ where: { id } });
        if (!technician)
            throw new common_1.NotFoundException('الفني غير موجود');
        const linkedOrders = await this.orders.count({ where: { technicianId: id } });
        if (linkedOrders > 0) {
            throw new common_1.BadRequestException('لا يمكن حذف هذا الفني لوجود طلبات مرتبطة به — يمكنك إلغاء تفعيل حسابه بدلاً من ذلك');
        }
        await this.technicians.remove(technician);
        return { id, deleted: true };
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
            email: t.email,
            categoryLabel: t.primaryCategory?.nameAr ?? '',
            primaryCategoryId: t.primaryCategoryId,
            city: t.city,
            district: t.district,
            yearsExperience: t.yearsExperience,
            priceFrom: t.priceFrom,
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
    async getCategories() {
        const rows = await this.categories.find({ order: { sortOrder: 'ASC' } });
        const technicianCounts = await this.technicians
            .createQueryBuilder('t')
            .select('t.primaryCategoryId', 'categoryId')
            .addSelect('COUNT(*)', 'count')
            .groupBy('t.primaryCategoryId')
            .getRawMany();
        const countMap = new Map(technicianCounts.map((c) => [Number(c.categoryId), parseInt(c.count, 10)]));
        return rows.map((c) => ({ ...c, technicianCount: countMap.get(c.id) ?? 0 }));
    }
    async createCategory(dto) {
        const existingSlug = await this.categories.findOne({ where: { slug: dto.slug } });
        if (existingSlug)
            throw new common_1.ConflictException('المعرّف (slug) مستخدم بالفعل');
        const category = this.categories.create({
            nameAr: dto.nameAr,
            slug: dto.slug,
            description: dto.description ?? null,
            iconKey: dto.iconKey,
            priceFrom: dto.priceFrom,
            priceUnit: dto.priceUnit ?? 'ر.س',
            sortOrder: dto.sortOrder ?? 0,
            isActive: dto.isActive ?? true,
        });
        const saved = await this.categories.save(category);
        return { ...saved, technicianCount: 0 };
    }
    async updateCategory(id, dto) {
        const category = await this.categories.findOne({ where: { id } });
        if (!category)
            throw new common_1.NotFoundException('الفئة غير موجودة');
        if (dto.slug && dto.slug !== category.slug) {
            const existingSlug = await this.categories.findOne({ where: { slug: dto.slug } });
            if (existingSlug && existingSlug.id !== id)
                throw new common_1.ConflictException('المعرّف (slug) مستخدم بالفعل');
            category.slug = dto.slug;
        }
        if (dto.nameAr !== undefined)
            category.nameAr = dto.nameAr;
        if (dto.description !== undefined)
            category.description = dto.description;
        if (dto.iconKey !== undefined)
            category.iconKey = dto.iconKey;
        if (dto.priceFrom !== undefined)
            category.priceFrom = dto.priceFrom;
        if (dto.priceUnit !== undefined)
            category.priceUnit = dto.priceUnit;
        if (dto.sortOrder !== undefined)
            category.sortOrder = dto.sortOrder;
        if (dto.isActive !== undefined)
            category.isActive = dto.isActive;
        const saved = await this.categories.save(category);
        const technicianCount = await this.technicians.count({ where: { primaryCategoryId: id } });
        return { ...saved, technicianCount };
    }
    async deleteCategory(id) {
        const category = await this.categories.findOne({ where: { id } });
        if (!category)
            throw new common_1.NotFoundException('الفئة غير موجودة');
        const linkedTechnicians = await this.technicians.count({ where: { primaryCategoryId: id } });
        if (linkedTechnicians > 0) {
            throw new common_1.BadRequestException('لا يمكن حذف هذه الفئة لوجود فنيين مرتبطين بها — يمكنك إيقاف تفعيلها بدلاً من ذلك');
        }
        const linkedOrders = await this.orders.count({ where: { categoryId: id } });
        if (linkedOrders > 0) {
            throw new common_1.BadRequestException('لا يمكن حذف هذه الفئة لوجود طلبات مرتبطة بها — يمكنك إيقاف تفعيلها بدلاً من ذلك');
        }
        await this.categories.remove(category);
        return { id, deleted: true };
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
import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, In, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
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

const SALT_ROUNDS = 12;

@Injectable()
export class AdminService {
    constructor(
        @InjectRepository(Order) private readonly orders: Repository<Order>,
        @InjectRepository(User) private readonly users: Repository<User>,
        @InjectRepository(Technician) private readonly technicians: Repository<Technician>,
        @InjectRepository(ServiceCategory) private readonly categories: Repository<ServiceCategory>,
        private readonly ordersService: OrdersService,
    ) { }

    // ---------- Stats ----------
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

        const [ordersToday, ordersInProgress, activeTechnicians, pendingVerifications, newUsersThisWeek] =
            await Promise.all([
                this.orders.count({ where: { createdAt: Between(startOfToday, endOfToday) } }),
                this.orders.count({ where: { status: 'in_progress' } }),
                this.technicians.count({ where: { isActive: true } }),
                this.technicians.count({ where: { isVerified: false } }),
                this.users.count({ where: { createdAt: Between(startOfWeek, new Date()) } }),
            ]);

        const revenueRow = await this.orders
            .createQueryBuilder('o')
            .select('COALESCE(SUM(o.amount), 0)', 'total')
            .where('o.createdAt >= :start', { start: startOfMonth })
            .andWhere('o.status = :status', { status: 'completed' })
            .getRawOne<{ total: string }>();

        return {
            ordersToday,
            ordersInProgress,
            revenueThisMonth: parseFloat(revenueRow?.total ?? '0') || 0,
            activeTechnicians,
            pendingVerifications,
            newUsersThisWeek,
        };
    }

    // ---------- Analytics (for dashboard charts) ----------
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
                .getRawMany<{ day: string; count: string }>(),

            this.orders
                .createQueryBuilder('o')
                .select('o.status', 'status')
                .addSelect('COUNT(*)', 'count')
                .groupBy('o.status')
                .getRawMany<{ status: OrderStatus; count: string }>(),

            this.orders
                .createQueryBuilder('o')
                .leftJoin('o.category', 'category')
                .select('category.nameAr', 'label')
                .addSelect('COUNT(*)', 'count')
                .groupBy('category.nameAr')
                .orderBy('count', 'DESC')
                .limit(6)
                .getRawMany<{ label: string; count: string }>(),

            this.orders
                .createQueryBuilder('o')
                .select("DATE_FORMAT(o.createdAt, '%Y-%m')", 'month')
                .addSelect('COALESCE(SUM(CASE WHEN o.status = :completed THEN o.amount ELSE 0 END), 0)', 'revenue')
                .addSelect('COUNT(*)', 'count')
                .where('o.createdAt >= :start', { start: sixMonthsAgo })
                .setParameter('completed', 'completed')
                .groupBy('month')
                .orderBy('month', 'ASC')
                .getRawMany<{ month: string; revenue: string; count: string }>(),
        ]);

        // Build a complete 14-day series (fill in zero-order days).
        const dayMap = new Map(dailyRaw.map((d) => [this.toDateKey(d.day), parseInt(d.count, 10)]));
        const ordersLast14Days = Array.from({ length: 14 }).map((_, idx) => {
            const date = new Date(fourteenDaysAgo);
            date.setDate(date.getDate() + idx);
            const key = this.toDateKey(date);
            return { date: key, orders: dayMap.get(key) ?? 0 };
        });

        // Build a complete 6-month series (fill in zero-revenue months).
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

    private toDateKey(value: string | Date) {
        const date = typeof value === 'string' ? new Date(value) : value;
        return date.toISOString().slice(0, 10);
    }

    // ---------- Orders ----------
    async getOrders(status?: OrderStatus) {
        const qb = this.orders
            .createQueryBuilder('o')
            .leftJoinAndSelect('o.user', 'user')
            .leftJoinAndSelect('o.technician', 'technician')
            .leftJoinAndSelect('o.category', 'category')
            .orderBy('o.createdAt', 'DESC');

        if (status) qb.andWhere('o.status = :status', { status });

        const rows = await qb.getMany();
        return rows.map((o) => this.toOrderRow(o));
    }

    async updateOrderStatus(id: number, dto: UpdateOrderStatusDto) {
        await this.ordersService.updateStatus(id, dto);
        const order = await this.orders.findOne({ where: { id }, relations: ['user', 'technician', 'category'] });
        if (!order) throw new NotFoundException('الطلب غير موجود');
        return this.toOrderRow(order);
    }

    async deleteOrder(id: number) {
        return this.ordersService.remove(id);
    }

    private toOrderRow(o: Order) {
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

    // ---------- Technicians ----------
    async getTechnicians() {
        const rows = await this.technicians.find({ relations: ['primaryCategory'] });

        const completedCounts = await this.orders
            .createQueryBuilder('o')
            .select('o.technicianId', 'technicianId')
            .addSelect('COUNT(*)', 'count')
            .where('o.status = :status', { status: 'completed' })
            .groupBy('o.technicianId')
            .getRawMany<{ technicianId: string; count: string }>();

        const countMap = new Map(completedCounts.map((c) => [Number(c.technicianId), parseInt(c.count, 10)]));

        return rows.map((t) => this.toTechnicianRow(t, countMap.get(t.id) ?? 0));
    }

    async createTechnician(dto: CreateTechnicianDto) {
        const existingPhone = await this.technicians.findOne({ where: { phone: dto.phone } });
        if (existingPhone) throw new ConflictException('رقم الجوال مستخدم بالفعل لفني آخر');

        if (dto.email) {
            const existingEmail = await this.technicians.findOne({ where: { email: dto.email } });
            if (existingEmail) throw new ConflictException('البريد الإلكتروني مستخدم بالفعل لفني آخر');
        }

        const category = await this.categories.findOne({ where: { id: dto.primaryCategoryId } });
        if (!category) throw new BadRequestException('فئة الخدمة الأساسية غير موجودة');

        const passwordHash = await bcrypt.hash(dto.password, SALT_ROUNDS);
        const initials = dto.fullName.trim().slice(0, 2);

        const additionalCategories = dto.categoryIds?.length
            ? await this.categories.find({ where: { id: In(dto.categoryIds) } })
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
            priceFrom: dto.priceFrom as any,
            isVerified: dto.isVerified ?? false,
            isActive: dto.isActive ?? true,
        });

        const saved = await this.technicians.save(technician);
        const withCategory = await this.technicians.findOne({ where: { id: saved.id }, relations: ['primaryCategory'] });
        return this.toTechnicianRow(withCategory!, 0);
    }

    async updateTechnician(id: number, dto: UpdateTechnicianDto) {
        const technician = await this.technicians.findOne({ where: { id }, relations: ['primaryCategory'] });
        if (!technician) throw new NotFoundException('الفني غير موجود');

        if (dto.phone && dto.phone !== technician.phone) {
            const existingPhone = await this.technicians.findOne({ where: { phone: dto.phone } });
            if (existingPhone && existingPhone.id !== id) throw new ConflictException('رقم الجوال مستخدم بالفعل لفني آخر');
            technician.phone = dto.phone;
        }

        if (dto.email !== undefined && dto.email !== technician.email) {
            if (dto.email) {
                const existingEmail = await this.technicians.findOne({ where: { email: dto.email } });
                if (existingEmail && existingEmail.id !== id) throw new ConflictException('البريد الإلكتروني مستخدم بالفعل لفني آخر');
            }
            technician.email = dto.email ?? null;
        }

        if (dto.password) technician.passwordHash = await bcrypt.hash(dto.password, SALT_ROUNDS);
        if (dto.fullName) {
            technician.fullName = dto.fullName;
            technician.initials = dto.fullName.trim().slice(0, 2);
        }
        if (dto.primaryCategoryId !== undefined) {
            const category = await this.categories.findOne({ where: { id: dto.primaryCategoryId } });
            if (!category) throw new BadRequestException('فئة الخدمة الأساسية غير موجودة');
            technician.primaryCategoryId = dto.primaryCategoryId;
        }
        if (dto.categoryIds) {
            technician.categories = dto.categoryIds.length
                ? await this.categories.find({ where: { id: In(dto.categoryIds) } })
                : [];
        }
        if (dto.yearsExperience !== undefined) technician.yearsExperience = dto.yearsExperience;
        if (dto.city) technician.city = dto.city;
        if (dto.district) technician.district = dto.district;
        if (dto.priceFrom !== undefined) technician.priceFrom = dto.priceFrom as any;
        if (dto.isVerified !== undefined) technician.isVerified = dto.isVerified;
        if (dto.isActive !== undefined) technician.isActive = dto.isActive;

        await this.technicians.save(technician);
        const refreshed = await this.technicians.findOne({ where: { id }, relations: ['primaryCategory'] });
        return this.toTechnicianRow(refreshed!, await this.completedCountFor(id));
    }

    async deleteTechnician(id: number) {
        const technician = await this.technicians.findOne({ where: { id } });
        if (!technician) throw new NotFoundException('الفني غير موجود');

        const linkedOrders = await this.orders.count({ where: { technicianId: id } });
        if (linkedOrders > 0) {
            throw new BadRequestException('لا يمكن حذف هذا الفني لوجود طلبات مرتبطة به — يمكنك إلغاء تفعيل حسابه بدلاً من ذلك');
        }

        await this.technicians.remove(technician);
        return { id, deleted: true };
    }

    async setTechnicianVerified(id: number, isVerified: boolean) {
        const technician = await this.technicians.findOne({ where: { id }, relations: ['primaryCategory'] });
        if (!technician) throw new NotFoundException('الفني غير موجود');
        technician.isVerified = isVerified;
        await this.technicians.save(technician);
        return this.toTechnicianRow(technician, await this.completedCountFor(id));
    }

    async setTechnicianActive(id: number, isActive: boolean) {
        const technician = await this.technicians.findOne({ where: { id }, relations: ['primaryCategory'] });
        if (!technician) throw new NotFoundException('الفني غير موجود');
        technician.isActive = isActive;
        await this.technicians.save(technician);
        return this.toTechnicianRow(technician, await this.completedCountFor(id));
    }

    private completedCountFor(technicianId: number) {
        return this.orders.count({ where: { technicianId, status: 'completed' } });
    }

    private toTechnicianRow(t: Technician, completedOrders: number) {
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

    // ---------- Users ----------
    async getUsers() {
        const rows = await this.users.find({ order: { createdAt: 'DESC' } });

        const orderCounts = await this.orders
            .createQueryBuilder('o')
            .select('o.userId', 'userId')
            .addSelect('COUNT(*)', 'count')
            .groupBy('o.userId')
            .getRawMany<{ userId: string; count: string }>();

        const countMap = new Map(orderCounts.map((c) => [Number(c.userId), parseInt(c.count, 10)]));

        return rows.map((u) => this.toUserRow(u, countMap.get(u.id) ?? 0));
    }

    async setUserBlocked(id: number, isBlocked: boolean) {
        const user = await this.users.findOne({ where: { id } });
        if (!user) throw new NotFoundException('المستخدم غير موجود');
        user.isActive = !isBlocked;
        await this.users.save(user);
        const count = await this.orders.count({ where: { userId: id } });
        return this.toUserRow(user, count);
    }

    private toUserRow(u: User, orderCount: number) {
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

    // ---------- Categories ----------
    async getCategories() {
        const rows = await this.categories.find({ order: { sortOrder: 'ASC' } });
        const technicianCounts = await this.technicians
            .createQueryBuilder('t')
            .select('t.primaryCategoryId', 'categoryId')
            .addSelect('COUNT(*)', 'count')
            .groupBy('t.primaryCategoryId')
            .getRawMany<{ categoryId: string; count: string }>();

        const countMap = new Map(technicianCounts.map((c) => [Number(c.categoryId), parseInt(c.count, 10)]));

        return rows.map((c) => ({ ...c, technicianCount: countMap.get(c.id) ?? 0 }));
    }

    async createCategory(dto: CreateCategoryDto) {
        const existingSlug = await this.categories.findOne({ where: { slug: dto.slug } });
        if (existingSlug) throw new ConflictException('المعرّف (slug) مستخدم بالفعل');

        const category = this.categories.create({
            nameAr: dto.nameAr,
            slug: dto.slug,
            description: dto.description ?? null,
            iconKey: dto.iconKey,
            priceFrom: dto.priceFrom as any,
            priceUnit: dto.priceUnit ?? 'ر.س',
            sortOrder: dto.sortOrder ?? 0,
            isActive: dto.isActive ?? true,
        });
        const saved = await this.categories.save(category);
        return { ...saved, technicianCount: 0 };
    }

    async updateCategory(id: number, dto: UpdateCategoryDto) {
        const category = await this.categories.findOne({ where: { id } });
        if (!category) throw new NotFoundException('الفئة غير موجودة');

        if (dto.slug && dto.slug !== category.slug) {
            const existingSlug = await this.categories.findOne({ where: { slug: dto.slug } });
            if (existingSlug && existingSlug.id !== id) throw new ConflictException('المعرّف (slug) مستخدم بالفعل');
            category.slug = dto.slug;
        }

        if (dto.nameAr !== undefined) category.nameAr = dto.nameAr;
        if (dto.description !== undefined) category.description = dto.description;
        if (dto.iconKey !== undefined) category.iconKey = dto.iconKey;
        if (dto.priceFrom !== undefined) category.priceFrom = dto.priceFrom as any;
        if (dto.priceUnit !== undefined) category.priceUnit = dto.priceUnit;
        if (dto.sortOrder !== undefined) category.sortOrder = dto.sortOrder;
        if (dto.isActive !== undefined) category.isActive = dto.isActive;

        const saved = await this.categories.save(category);
        const technicianCount = await this.technicians.count({ where: { primaryCategoryId: id } });
        return { ...saved, technicianCount };
    }

    async deleteCategory(id: number) {
        const category = await this.categories.findOne({ where: { id } });
        if (!category) throw new NotFoundException('الفئة غير موجودة');

        const linkedTechnicians = await this.technicians.count({ where: { primaryCategoryId: id } });
        if (linkedTechnicians > 0) {
            throw new BadRequestException('لا يمكن حذف هذه الفئة لوجود فنيين مرتبطين بها — يمكنك إيقاف تفعيلها بدلاً من ذلك');
        }

        const linkedOrders = await this.orders.count({ where: { categoryId: id } });
        if (linkedOrders > 0) {
            throw new BadRequestException('لا يمكن حذف هذه الفئة لوجود طلبات مرتبطة بها — يمكنك إيقاف تفعيلها بدلاً من ذلك');
        }

        await this.categories.remove(category);
        return { id, deleted: true };
    }
}
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { Order, OrderStatus } from '../../entities/order.entity';
import { User } from '../../entities/user.entity';
import { Technician } from '../../entities/technician.entity';
import { ServiceCategory } from '../../entities/service-category.entity';
import { OrdersService } from '../orders/orders.service';
import { UpdateOrderStatusDto } from '../orders/dto/update-order-status.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

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
        return this.
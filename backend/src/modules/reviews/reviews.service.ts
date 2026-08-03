import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from '../../entities/review.entity';
import { Order } from '../../entities/order.entity';
import { Technician } from '../../entities/technician.entity';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewsService {
    constructor(
        @InjectRepository(Review) private readonly reviews: Repository<Review>,
        @InjectRepository(Order) private readonly orders: Repository<Order>,
        @InjectRepository(Technician) private readonly technicians: Repository<Technician>,
    ) { }

    async findByTechnician(technicianId: number) {
        const rows = await this.reviews.find({
            where: { technicianId },
            relations: ['user'],
            order: { createdAt: 'DESC' },
        });

        return rows.map((r) => ({
            id: r.id,
            rating: r.rating,
            comment: r.comment,
            createdAt: r.createdAt,
            reviewerName: r.user?.fullName ?? 'مستخدم بيتك',
        }));
    }

    async create(orderId: number, userId: number, dto: CreateReviewDto) {
        const order = await this.orders.findOneBy({ id: orderId });
        if (!order) throw new NotFoundException('الطلب غير موجود');
        if (order.userId !== userId) throw new BadRequestException('لا يمكنك تقييم طلب لا يخصك');
        if (order.status !== 'completed') throw new BadRequestException('يمكن تقييم الطلبات المكتملة فقط');
        if (!order.technicianId) throw new BadRequestException('لا يوجد فني مرتبط بهذا الطلب');

        const existing = await this.reviews.findOneBy({ orderId });
        if (existing) throw new ConflictException('تم تقييم هذا الطلب مسبقًا');

        const review = await this.reviews.save(
            this.reviews.create({ orderId, userId, technicianId: order.technicianId, rating: dto.rating, comment: dto.comment ?? null }),
        );

        await this.recalculateTechnicianRating(order.technicianId);
        return review;
    }

    private async recalculateTechnicianRating(technicianId: number) {
        const { avg, count } = await this.reviews
            .createQueryBuilder('r')
            .select('AVG(r.rating)', 'avg')
            .addSelect('COUNT(r.id)', 'count')
            .where('r.technicianId = :technicianId', { technicianId })
            .getRawOne();

        await this.technicians.update(technicianId, {
            averageRating: Math.round(parseFloat(avg) * 10) / 10,
            reviewCount: parseInt(count, 10),
        });
    }
}
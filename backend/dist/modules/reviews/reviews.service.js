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
exports.ReviewsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const review_entity_1 = require("../../entities/review.entity");
const order_entity_1 = require("../../entities/order.entity");
const technician_entity_1 = require("../../entities/technician.entity");
let ReviewsService = class ReviewsService {
    reviews;
    orders;
    technicians;
    constructor(reviews, orders, technicians) {
        this.reviews = reviews;
        this.orders = orders;
        this.technicians = technicians;
    }
    async create(orderId, userId, dto) {
        const order = await this.orders.findOneBy({ id: orderId });
        if (!order)
            throw new common_1.NotFoundException('الطلب غير موجود');
        if (order.userId !== userId)
            throw new common_1.BadRequestException('لا يمكنك تقييم طلب لا يخصك');
        if (order.status !== 'completed')
            throw new common_1.BadRequestException('يمكن تقييم الطلبات المكتملة فقط');
        if (!order.technicianId)
            throw new common_1.BadRequestException('لا يوجد فني مرتبط بهذا الطلب');
        const existing = await this.reviews.findOneBy({ orderId });
        if (existing)
            throw new common_1.ConflictException('تم تقييم هذا الطلب مسبقًا');
        const review = await this.reviews.save(this.reviews.create({ orderId, userId, technicianId: order.technicianId, rating: dto.rating, comment: dto.comment ?? null }));
        await this.recalculateTechnicianRating(order.technicianId);
        return review;
    }
    async recalculateTechnicianRating(technicianId) {
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
};
exports.ReviewsService = ReviewsService;
exports.ReviewsService = ReviewsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(review_entity_1.Review)),
    __param(1, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __param(2, (0, typeorm_1.InjectRepository)(technician_entity_1.Technician)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ReviewsService);
//# sourceMappingURL=reviews.service.js.map
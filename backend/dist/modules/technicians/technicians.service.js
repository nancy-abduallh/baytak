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
exports.TechniciansService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const technician_entity_1 = require("../../entities/technician.entity");
const service_category_entity_1 = require("../../entities/service-category.entity");
let TechniciansService = class TechniciansService {
    technicians;
    categories;
    constructor(technicians, categories) {
        this.technicians = technicians;
        this.categories = categories;
    }
    async findAll(query) {
        const qb = this.technicians
            .createQueryBuilder('t')
            .leftJoinAndSelect('t.primaryCategory', 'category')
            .where('t.isActive = :active', { active: true });
        if (query.category) {
            const category = await this.categories.findOne({ where: { slug: query.category } });
            if (!category)
                throw new common_1.NotFoundException('الفئة غير موجودة');
            qb.andWhere('t.primaryCategoryId = :categoryId', { categoryId: category.id });
        }
        if (query.minRating)
            qb.andWhere('t.averageRating >= :minRating', { minRating: parseFloat(query.minRating) });
        if (query.maxPrice)
            qb.andWhere('t.priceFrom <= :maxPrice', { maxPrice: parseFloat(query.maxPrice) });
        const sortColumn = { rating: 't.averageRating', price: 't.priceFrom', experience: 't.yearsExperience' }[query.sortBy ?? 'rating'];
        qb.orderBy(sortColumn, 'DESC');
        const rows = await qb.getMany();
        return rows.map((t) => this.toResponse(t));
    }
    async findOne(id) {
        const technician = await this.technicians.findOne({ where: { id }, relations: ['primaryCategory'] });
        if (!technician)
            throw new common_1.NotFoundException('الفني غير موجود');
        return this.toResponse(technician);
    }
    toResponse(t) {
        return {
            id: t.id,
            fullName: t.fullName,
            initials: t.initials,
            avatarUrl: t.avatarUrl,
            primaryCategoryId: t.primaryCategoryId,
            categorySlug: t.primaryCategory?.slug,
            categoryLabel: t.primaryCategory?.nameAr,
            yearsExperience: t.yearsExperience,
            city: t.city,
            district: t.district,
            priceFrom: t.priceFrom,
            isVerified: t.isVerified,
            averageRating: t.averageRating,
            reviewCount: t.reviewCount,
        };
    }
};
exports.TechniciansService = TechniciansService;
exports.TechniciansService = TechniciansService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(technician_entity_1.Technician)),
    __param(1, (0, typeorm_1.InjectRepository)(service_category_entity_1.ServiceCategory)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], TechniciansService);
//# sourceMappingURL=technicians.service.js.map
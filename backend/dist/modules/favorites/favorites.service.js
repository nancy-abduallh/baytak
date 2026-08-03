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
exports.FavoritesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const favorite_entity_1 = require("../../entities/favorite.entity");
const technician_entity_1 = require("../../entities/technician.entity");
let FavoritesService = class FavoritesService {
    favorites;
    technicians;
    constructor(favorites, technicians) {
        this.favorites = favorites;
        this.technicians = technicians;
    }
    async findMine(userId) {
        const rows = await this.favorites.find({
            where: { userId },
            relations: ['technician', 'technician.primaryCategory'],
            order: { createdAt: 'DESC' },
        });
        return rows
            .filter((f) => !!f.technician)
            .map((f) => this.toTechnicianResponse(f.technician));
    }
    async listFavoriteTechnicianIds(userId) {
        const rows = await this.favorites.find({ where: { userId } });
        return rows.map((r) => r.technicianId);
    }
    async add(userId, technicianId) {
        const technician = await this.technicians.findOneBy({ id: technicianId });
        if (!technician)
            throw new common_1.NotFoundException('الفني غير موجود');
        const existing = await this.favorites.findOne({ where: { userId, technicianId } });
        if (existing)
            return { favorited: true };
        await this.favorites.save(this.favorites.create({ userId, technicianId }));
        return { favorited: true };
    }
    async remove(userId, technicianId) {
        await this.favorites.delete({ userId, technicianId });
        return { favorited: false };
    }
    toTechnicianResponse(t) {
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
exports.FavoritesService = FavoritesService;
exports.FavoritesService = FavoritesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(favorite_entity_1.Favorite)),
    __param(1, (0, typeorm_1.InjectRepository)(technician_entity_1.Technician)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], FavoritesService);
//# sourceMappingURL=favorites.service.js.map
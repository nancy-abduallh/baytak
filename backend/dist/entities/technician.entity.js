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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Technician = void 0;
const typeorm_1 = require("typeorm");
const class_transformer_1 = require("class-transformer");
const service_category_entity_1 = require("./service-category.entity");
const numeric_transformer_1 = require("../common/transformers/numeric.transformer");
let Technician = class Technician {
    id;
    fullName;
    initials;
    phone;
    email;
    passwordHash;
    avatarUrl;
    primaryCategoryId;
    primaryCategory;
    categories;
    yearsExperience;
    city;
    district;
    lat;
    lng;
    priceFrom;
    isVerified;
    isActive;
    averageRating;
    reviewCount;
    createdAt;
    updatedAt;
};
exports.Technician = Technician;
__decorate([
    (0, typeorm_1.PrimaryColumn)({
        type: 'bigint',
        generated: 'increment',
        transformer: numeric_transformer_1.bigintTransformer,
    }),
    __metadata("design:type", Number)
], Technician.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'full_name', type: 'varchar', length: 120 }),
    __metadata("design:type", String)
], Technician.prototype, "fullName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 6 }),
    __metadata("design:type", String)
], Technician.prototype, "initials", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, unique: true }),
    __metadata("design:type", String)
], Technician.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 160, unique: true, nullable: true }),
    __metadata("design:type", Object)
], Technician.prototype, "email", void 0);
__decorate([
    (0, class_transformer_1.Exclude)(),
    (0, typeorm_1.Column)({ name: 'password_hash', type: 'varchar', length: 255, select: false }),
    __metadata("design:type", String)
], Technician.prototype, "passwordHash", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'avatar_url', type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", Object)
], Technician.prototype, "avatarUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'primary_category_id', type: 'int' }),
    __metadata("design:type", Number)
], Technician.prototype, "primaryCategoryId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => service_category_entity_1.ServiceCategory),
    (0, typeorm_1.JoinColumn)({ name: 'primary_category_id' }),
    __metadata("design:type", service_category_entity_1.ServiceCategory)
], Technician.prototype, "primaryCategory", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => service_category_entity_1.ServiceCategory),
    (0, typeorm_1.JoinTable)({
        name: 'technician_categories',
        joinColumn: { name: 'technician_id' },
        inverseJoinColumn: { name: 'category_id' },
    }),
    __metadata("design:type", Array)
], Technician.prototype, "categories", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'years_experience', type: 'smallint', default: 0 }),
    __metadata("design:type", Number)
], Technician.prototype, "yearsExperience", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 80 }),
    __metadata("design:type", String)
], Technician.prototype, "city", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 80 }),
    __metadata("design:type", String)
], Technician.prototype, "district", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 7, nullable: true, transformer: numeric_transformer_1.decimalTransformer }),
    __metadata("design:type", Object)
], Technician.prototype, "lat", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 7, nullable: true, transformer: numeric_transformer_1.decimalTransformer }),
    __metadata("design:type", Object)
], Technician.prototype, "lng", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'price_from', type: 'decimal', precision: 10, scale: 2, transformer: numeric_transformer_1.decimalTransformer }),
    __metadata("design:type", Number)
], Technician.prototype, "priceFrom", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_verified', default: false }),
    __metadata("design:type", Boolean)
], Technician.prototype, "isVerified", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_active', default: true }),
    __metadata("design:type", Boolean)
], Technician.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'average_rating', type: 'decimal', precision: 2, scale: 1, default: 0, transformer: numeric_transformer_1.decimalTransformer }),
    __metadata("design:type", Number)
], Technician.prototype, "averageRating", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'review_count', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Technician.prototype, "reviewCount", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Technician.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Technician.prototype, "updatedAt", void 0);
exports.Technician = Technician = __decorate([
    (0, typeorm_1.Entity)('technicians')
], Technician);
//# sourceMappingURL=technician.entity.js.map
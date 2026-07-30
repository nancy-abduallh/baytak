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
exports.ServiceCategory = void 0;
const typeorm_1 = require("typeorm");
const numeric_transformer_1 = require("../common/transformers/numeric.transformer");
let ServiceCategory = class ServiceCategory {
    id;
    slug;
    nameAr;
    description;
    iconKey;
    priceFrom;
    priceUnit;
    sortOrder;
    isActive;
};
exports.ServiceCategory = ServiceCategory;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'int' }),
    __metadata("design:type", Number)
], ServiceCategory.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 60, unique: true }),
    __metadata("design:type", String)
], ServiceCategory.prototype, "slug", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'name_ar', type: 'varchar', length: 80 }),
    __metadata("design:type", String)
], ServiceCategory.prototype, "nameAr", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", Object)
], ServiceCategory.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'icon_key', type: 'varchar', length: 40 }),
    __metadata("design:type", String)
], ServiceCategory.prototype, "iconKey", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'price_from', type: 'decimal', precision: 10, scale: 2, transformer: numeric_transformer_1.decimalTransformer }),
    __metadata("design:type", Number)
], ServiceCategory.prototype, "priceFrom", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'price_unit', type: 'varchar', length: 20, default: 'ر.س' }),
    __metadata("design:type", String)
], ServiceCategory.prototype, "priceUnit", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'sort_order', type: 'smallint', default: 0 }),
    __metadata("design:type", Number)
], ServiceCategory.prototype, "sortOrder", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_active', default: true }),
    __metadata("design:type", Boolean)
], ServiceCategory.prototype, "isActive", void 0);
exports.ServiceCategory = ServiceCategory = __decorate([
    (0, typeorm_1.Entity)('service_categories')
], ServiceCategory);
//# sourceMappingURL=service-category.entity.js.map
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
exports.Address = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
const numeric_transformer_1 = require("../common/transformers/numeric.transformer");
let Address = class Address {
    id;
    userId;
    user;
    label;
    city;
    district;
    street;
    buildingNo;
    lat;
    lng;
    isDefault;
    createdAt;
};
exports.Address = Address;
__decorate([
    (0, typeorm_1.PrimaryColumn)({
        type: 'bigint',
        generated: 'increment',
        transformer: numeric_transformer_1.bigintTransformer,
    }),
    __metadata("design:type", Number)
], Address.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id', type: 'bigint', transformer: numeric_transformer_1.bigintTransformer }),
    __metadata("design:type", Number)
], Address.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.addresses, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.User)
], Address.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 60, default: 'المنزل' }),
    __metadata("design:type", String)
], Address.prototype, "label", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 80 }),
    __metadata("design:type", String)
], Address.prototype, "city", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 80 }),
    __metadata("design:type", String)
], Address.prototype, "district", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 160, nullable: true }),
    __metadata("design:type", Object)
], Address.prototype, "street", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'building_no', type: 'varchar', length: 30, nullable: true }),
    __metadata("design:type", Object)
], Address.prototype, "buildingNo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 7, nullable: true, transformer: numeric_transformer_1.decimalTransformer }),
    __metadata("design:type", Object)
], Address.prototype, "lat", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 7, nullable: true, transformer: numeric_transformer_1.decimalTransformer }),
    __metadata("design:type", Object)
], Address.prototype, "lng", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_default', default: false }),
    __metadata("design:type", Boolean)
], Address.prototype, "isDefault", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Address.prototype, "createdAt", void 0);
exports.Address = Address = __decorate([
    (0, typeorm_1.Entity)('addresses')
], Address);
//# sourceMappingURL=address.entity.js.map
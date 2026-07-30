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
exports.PaymentMethod = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
const numeric_transformer_1 = require("../common/transformers/numeric.transformer");
let PaymentMethod = class PaymentMethod {
    id;
    userId;
    user;
    type;
    cardBrand;
    cardLast4;
    isDefault;
    createdAt;
};
exports.PaymentMethod = PaymentMethod;
__decorate([
    (0, typeorm_1.PrimaryColumn)({
        type: 'bigint',
        generated: 'increment',
        transformer: numeric_transformer_1.bigintTransformer,
    }),
    __metadata("design:type", Number)
], PaymentMethod.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id', type: 'bigint', transformer: numeric_transformer_1.bigintTransformer }),
    __metadata("design:type", Number)
], PaymentMethod.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.User)
], PaymentMethod.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ['card', 'apple_pay', 'stc_pay', 'cash'] }),
    __metadata("design:type", String)
], PaymentMethod.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'card_brand', type: 'varchar', length: 30, nullable: true }),
    __metadata("design:type", Object)
], PaymentMethod.prototype, "cardBrand", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'card_last4', type: 'varchar', length: 4, nullable: true }),
    __metadata("design:type", Object)
], PaymentMethod.prototype, "cardLast4", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_default', default: false }),
    __metadata("design:type", Boolean)
], PaymentMethod.prototype, "isDefault", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], PaymentMethod.prototype, "createdAt", void 0);
exports.PaymentMethod = PaymentMethod = __decorate([
    (0, typeorm_1.Entity)('payment_methods')
], PaymentMethod);
//# sourceMappingURL=payment-method.entity.js.map
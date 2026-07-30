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
exports.Order = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
const technician_entity_1 = require("./technician.entity");
const service_category_entity_1 = require("./service-category.entity");
const address_entity_1 = require("./address.entity");
const order_status_history_entity_1 = require("./order-status-history.entity");
const order_image_entity_1 = require("./order-image.entity");
const numeric_transformer_1 = require("../common/transformers/numeric.transformer");
let Order = class Order {
    id;
    userId;
    user;
    technicianId;
    technician;
    categoryId;
    category;
    addressId;
    address;
    description;
    status;
    scheduledDate;
    scheduledSlot;
    amount;
    paymentStatus;
    paymentMethodId;
    createdAt;
    updatedAt;
    statusHistory;
    images;
};
exports.Order = Order;
__decorate([
    (0, typeorm_1.PrimaryColumn)({
        type: 'bigint',
        generated: 'increment',
        transformer: numeric_transformer_1.bigintTransformer,
    }),
    __metadata("design:type", Number)
], Order.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id', type: 'bigint', transformer: numeric_transformer_1.bigintTransformer }),
    __metadata("design:type", Number)
], Order.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.orders),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.User)
], Order.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'technician_id', type: 'bigint', transformer: numeric_transformer_1.bigintTransformer, nullable: true }),
    __metadata("design:type", Object)
], Order.prototype, "technicianId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => technician_entity_1.Technician, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'technician_id' }),
    __metadata("design:type", Object)
], Order.prototype, "technician", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'category_id', type: 'int' }),
    __metadata("design:type", Number)
], Order.prototype, "categoryId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => service_category_entity_1.ServiceCategory),
    (0, typeorm_1.JoinColumn)({ name: 'category_id' }),
    __metadata("design:type", service_category_entity_1.ServiceCategory)
], Order.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'address_id', type: 'bigint', transformer: numeric_transformer_1.bigintTransformer }),
    __metadata("design:type", Number)
], Order.prototype, "addressId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => address_entity_1.Address),
    (0, typeorm_1.JoinColumn)({ name: 'address_id' }),
    __metadata("design:type", address_entity_1.Address)
], Order.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], Order.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled'], default: 'pending' }),
    __metadata("design:type", String)
], Order.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'scheduled_date', type: 'date' }),
    __metadata("design:type", String)
], Order.prototype, "scheduledDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'scheduled_slot', type: 'varchar', length: 30, nullable: true }),
    __metadata("design:type", Object)
], Order.prototype, "scheduledSlot", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, transformer: numeric_transformer_1.decimalTransformer }),
    __metadata("design:type", Number)
], Order.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'payment_status', type: 'enum', enum: ['unpaid', 'paid', 'refunded'], default: 'unpaid' }),
    __metadata("design:type", String)
], Order.prototype, "paymentStatus", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'payment_method_id', type: 'bigint', transformer: numeric_transformer_1.bigintTransformer, nullable: true }),
    __metadata("design:type", Object)
], Order.prototype, "paymentMethodId", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Order.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Order.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => order_status_history_entity_1.OrderStatusHistory, (h) => h.order),
    __metadata("design:type", Array)
], Order.prototype, "statusHistory", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => order_image_entity_1.OrderImage, (img) => img.order),
    __metadata("design:type", Array)
], Order.prototype, "images", void 0);
exports.Order = Order = __decorate([
    (0, typeorm_1.Entity)('orders')
], Order);
//# sourceMappingURL=order.entity.js.map
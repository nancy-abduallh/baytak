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
exports.OrderImage = void 0;
const typeorm_1 = require("typeorm");
const order_entity_1 = require("./order.entity");
const numeric_transformer_1 = require("../common/transformers/numeric.transformer");
let OrderImage = class OrderImage {
    id;
    orderId;
    order;
    imageUrl;
    uploadedAt;
};
exports.OrderImage = OrderImage;
__decorate([
    (0, typeorm_1.PrimaryColumn)({
        type: 'bigint',
        generated: 'increment',
        transformer: numeric_transformer_1.bigintTransformer,
    }),
    __metadata("design:type", Number)
], OrderImage.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'order_id', type: 'bigint', transformer: numeric_transformer_1.bigintTransformer }),
    __metadata("design:type", Number)
], OrderImage.prototype, "orderId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => order_entity_1.Order, (order) => order.images, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'order_id' }),
    __metadata("design:type", order_entity_1.Order)
], OrderImage.prototype, "order", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'image_url', length: 255 }),
    __metadata("design:type", String)
], OrderImage.prototype, "imageUrl", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'uploaded_at' }),
    __metadata("design:type", Date)
], OrderImage.prototype, "uploadedAt", void 0);
exports.OrderImage = OrderImage = __decorate([
    (0, typeorm_1.Entity)('order_images')
], OrderImage);
//# sourceMappingURL=order-image.entity.js.map
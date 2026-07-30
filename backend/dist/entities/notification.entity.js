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
exports.Notification = void 0;
const typeorm_1 = require("typeorm");
const numeric_transformer_1 = require("../common/transformers/numeric.transformer");
let Notification = class Notification {
    id;
    userId;
    technicianId;
    title;
    body;
    type;
    isRead;
    createdAt;
};
exports.Notification = Notification;
__decorate([
    (0, typeorm_1.PrimaryColumn)({
        type: 'bigint',
        generated: 'increment',
        transformer: numeric_transformer_1.bigintTransformer,
    }),
    __metadata("design:type", Number)
], Notification.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id', type: 'bigint', transformer: numeric_transformer_1.bigintTransformer, nullable: true }),
    __metadata("design:type", Object)
], Notification.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'technician_id', type: 'bigint', transformer: numeric_transformer_1.bigintTransformer, nullable: true }),
    __metadata("design:type", Object)
], Notification.prototype, "technicianId", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 150 }),
    __metadata("design:type", String)
], Notification.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 400 }),
    __metadata("design:type", String)
], Notification.prototype, "body", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 40, default: 'order_update' }),
    __metadata("design:type", String)
], Notification.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_read', default: false }),
    __metadata("design:type", Boolean)
], Notification.prototype, "isRead", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Notification.prototype, "createdAt", void 0);
exports.Notification = Notification = __decorate([
    (0, typeorm_1.Entity)('notifications')
], Notification);
//# sourceMappingURL=notification.entity.js.map
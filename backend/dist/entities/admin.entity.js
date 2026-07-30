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
exports.Admin = void 0;
const typeorm_1 = require("typeorm");
const class_transformer_1 = require("class-transformer");
const numeric_transformer_1 = require("../common/transformers/numeric.transformer");
let Admin = class Admin {
    id;
    fullName;
    email;
    passwordHash;
    role;
    isActive;
    createdAt;
};
exports.Admin = Admin;
__decorate([
    (0, typeorm_1.PrimaryColumn)({
        type: 'bigint',
        generated: 'increment',
        transformer: numeric_transformer_1.bigintTransformer,
    }),
    __metadata("design:type", Number)
], Admin.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'full_name', length: 120 }),
    __metadata("design:type", String)
], Admin.prototype, "fullName", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 160, unique: true }),
    __metadata("design:type", String)
], Admin.prototype, "email", void 0);
__decorate([
    (0, class_transformer_1.Exclude)(),
    (0, typeorm_1.Column)({ name: 'password_hash', length: 255, select: false }),
    __metadata("design:type", String)
], Admin.prototype, "passwordHash", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ['super_admin', 'support', 'finance'], default: 'support' }),
    __metadata("design:type", String)
], Admin.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_active', default: true }),
    __metadata("design:type", Boolean)
], Admin.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Admin.prototype, "createdAt", void 0);
exports.Admin = Admin = __decorate([
    (0, typeorm_1.Entity)('admins')
], Admin);
//# sourceMappingURL=admin.entity.js.map
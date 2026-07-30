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
exports.Favorite = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
const technician_entity_1 = require("./technician.entity");
const numeric_transformer_1 = require("../common/transformers/numeric.transformer");
let Favorite = class Favorite {
    id;
    userId;
    user;
    technicianId;
    technician;
    createdAt;
};
exports.Favorite = Favorite;
__decorate([
    (0, typeorm_1.PrimaryColumn)({
        type: 'bigint',
        generated: 'increment',
        transformer: numeric_transformer_1.bigintTransformer,
    }),
    __metadata("design:type", Number)
], Favorite.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id', type: 'bigint', transformer: numeric_transformer_1.bigintTransformer }),
    __metadata("design:type", Number)
], Favorite.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.User)
], Favorite.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'technician_id', type: 'bigint', transformer: numeric_transformer_1.bigintTransformer }),
    __metadata("design:type", Number)
], Favorite.prototype, "technicianId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => technician_entity_1.Technician, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'technician_id' }),
    __metadata("design:type", technician_entity_1.Technician)
], Favorite.prototype, "technician", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Favorite.prototype, "createdAt", void 0);
exports.Favorite = Favorite = __decorate([
    (0, typeorm_1.Entity)('favorites')
], Favorite);
//# sourceMappingURL=favorite.entity.js.map
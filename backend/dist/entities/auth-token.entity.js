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
exports.AuthToken = void 0;
const typeorm_1 = require("typeorm");
const numeric_transformer_1 = require("../common/transformers/numeric.transformer");
let AuthToken = class AuthToken {
    id;
    actorType;
    actorId;
    refreshTokenHash;
    userAgent;
    ipAddress;
    expiresAt;
    revokedAt;
    createdAt;
};
exports.AuthToken = AuthToken;
__decorate([
    (0, typeorm_1.PrimaryColumn)({
        type: 'bigint',
        generated: 'increment',
        transformer: numeric_transformer_1.bigintTransformer,
    }),
    __metadata("design:type", Number)
], AuthToken.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'actor_type', type: 'enum', enum: ['user', 'technician', 'admin'] }),
    __metadata("design:type", String)
], AuthToken.prototype, "actorType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'actor_id', type: 'bigint', transformer: numeric_transformer_1.bigintTransformer }),
    __metadata("design:type", Number)
], AuthToken.prototype, "actorId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'refresh_token_hash', type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], AuthToken.prototype, "refreshTokenHash", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_agent', type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", Object)
], AuthToken.prototype, "userAgent", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ip_address', type: 'varchar', length: 45, nullable: true }),
    __metadata("design:type", Object)
], AuthToken.prototype, "ipAddress", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'expires_at', type: 'datetime' }),
    __metadata("design:type", Date)
], AuthToken.prototype, "expiresAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'revoked_at', type: 'datetime', nullable: true }),
    __metadata("design:type", Object)
], AuthToken.prototype, "revokedAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], AuthToken.prototype, "createdAt", void 0);
exports.AuthToken = AuthToken = __decorate([
    (0, typeorm_1.Entity)('auth_tokens')
], AuthToken);
//# sourceMappingURL=auth-token.entity.js.map
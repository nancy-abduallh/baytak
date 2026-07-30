"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const bcrypt = __importStar(require("bcrypt"));
const crypto = __importStar(require("crypto"));
const user_entity_1 = require("../../entities/user.entity");
const auth_token_entity_1 = require("../../entities/auth-token.entity");
const SALT_ROUNDS = 12;
let AuthService = class AuthService {
    users;
    authTokens;
    jwt;
    config;
    constructor(users, authTokens, jwt, config) {
        this.users = users;
        this.authTokens = authTokens;
        this.jwt = jwt;
        this.config = config;
    }
    async register(dto, meta) {
        const existing = await this.users.findOne({ where: { phone: dto.phone } });
        if (existing)
            throw new common_1.ConflictException('رقم الجوال مسجل بالفعل');
        const passwordHash = await bcrypt.hash(dto.password, SALT_ROUNDS);
        const user = await this.users.save(this.users.create({
            fullName: dto.fullName,
            phone: dto.phone,
            email: dto.email ?? null,
            passwordHash,
            city: dto.city ?? null,
            district: dto.district ?? null,
        }));
        return this.issueTokenPair(user, meta);
    }
    async login(dto, meta) {
        const user = await this.users
            .createQueryBuilder('u')
            .addSelect('u.passwordHash')
            .where('u.phone = :phone', { phone: dto.phone })
            .getOne();
        if (!user || !(await bcrypt.compare(dto.password, user.passwordHash))) {
            throw new common_1.UnauthorizedException('رقم الجوال أو كلمة المرور غير صحيحة');
        }
        user.lastLoginAt = new Date();
        await this.users.save(user);
        return this.issueTokenPair(user, meta);
    }
    async refresh(userId, presentedToken, meta) {
        const tokenHash = this.hashToken(presentedToken);
        const stored = await this.authTokens.findOne({
            where: { actorType: 'user', actorId: userId, refreshTokenHash: tokenHash },
        });
        if (!stored || stored.revokedAt || stored.expiresAt < new Date()) {
            throw new common_1.UnauthorizedException('جلسة الدخول منتهية، الرجاء تسجيل الدخول مجددًا');
        }
        stored.revokedAt = new Date();
        await this.authTokens.save(stored);
        const user = await this.users.findOneByOrFail({ id: userId });
        return this.issueTokenPair(user, meta);
    }
    async logout(userId, presentedToken) {
        const tokenHash = this.hashToken(presentedToken);
        await this.authTokens.update({ actorType: 'user', actorId: userId, refreshTokenHash: tokenHash }, { revokedAt: new Date() });
        return { success: true };
    }
    async issueTokenPair(user, meta) {
        const accessToken = this.jwt.sign({ sub: user.id, phone: user.phone, actorType: 'user' }, { secret: this.config.get('jwt.accessSecret'), expiresIn: this.config.get('jwt.accessExpiresIn') });
        const refreshToken = this.jwt.sign({ sub: user.id, actorType: 'user' }, { secret: this.config.get('jwt.refreshSecret'), expiresIn: this.config.get('jwt.refreshExpiresIn') });
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 30);
        await this.authTokens.save(this.authTokens.create({
            actorType: 'user',
            actorId: user.id,
            refreshTokenHash: this.hashToken(refreshToken),
            userAgent: meta.userAgent ?? null,
            ipAddress: meta.ip ?? null,
            expiresAt,
        }));
        return {
            accessToken,
            refreshToken,
            user: { id: user.id, fullName: user.fullName, phone: user.phone, email: user.email, city: user.city, district: user.district },
        };
    }
    hashToken(token) {
        return crypto.createHash('sha256').update(token).digest('hex');
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(auth_token_entity_1.AuthToken)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map
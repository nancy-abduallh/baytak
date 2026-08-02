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
exports.AdminsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bcrypt = __importStar(require("bcrypt"));
const admin_entity_1 = require("../../entities/admin.entity");
const permissions_constants_1 = require("./permissions.constants");
const SALT_ROUNDS = 12;
let AdminsService = class AdminsService {
    admins;
    constructor(admins) {
        this.admins = admins;
    }
    getPermissionsCatalogue() {
        return permissions_constants_1.ADMIN_PERMISSIONS.map((key) => ({ key, label: permissions_constants_1.ADMIN_PERMISSION_LABELS[key] }));
    }
    async list() {
        const rows = await this.admins.find({ order: { createdAt: 'ASC' } });
        return rows.map((a) => this.toRow(a));
    }
    async me(id) {
        const admin = await this.admins.findOne({ where: { id } });
        if (!admin)
            throw new common_1.NotFoundException('الحساب غير موجود');
        return this.toRow(admin);
    }
    async create(dto, actor) {
        if (dto.role === 'super_admin' && actor.role !== 'super_admin') {
            throw new common_1.ForbiddenException('فقط المدير العام يمكنه إنشاء حساب مدير عام آخر');
        }
        const existing = await this.admins.findOne({ where: { email: dto.email } });
        if (existing)
            throw new common_1.ConflictException('البريد الإلكتروني مستخدم بالفعل');
        const passwordHash = await bcrypt.hash(dto.password, SALT_ROUNDS);
        const admin = this.admins.create({
            fullName: dto.fullName,
            email: dto.email,
            passwordHash,
            role: dto.role,
            permissions: dto.role === 'super_admin' ? [] : dto.permissions ?? [],
            isActive: dto.isActive ?? true,
        });
        const saved = await this.admins.save(admin);
        return this.toRow(saved);
    }
    async update(id, dto, actor) {
        const admin = await this.admins.findOne({ where: { id } });
        if (!admin)
            throw new common_1.NotFoundException('الحساب غير موجود');
        if (admin.role === 'super_admin' && actor.role !== 'super_admin') {
            throw new common_1.ForbiddenException('لا تملك صلاحية تعديل حساب مدير عام');
        }
        if (dto.role === 'super_admin' && actor.role !== 'super_admin') {
            throw new common_1.ForbiddenException('فقط المدير العام يمكنه منح صلاحية مدير عام');
        }
        const demotingFromSuperAdmin = admin.role === 'super_admin' && dto.role && dto.role !== 'super_admin';
        const deactivatingSuperAdmin = admin.role === 'super_admin' && dto.isActive === false;
        if (demotingFromSuperAdmin || deactivatingSuperAdmin) {
            await this.assertNotLastSuperAdmin(admin.id);
        }
        if (dto.email && dto.email !== admin.email) {
            const existing = await this.admins.findOne({ where: { email: dto.email } });
            if (existing && existing.id !== id)
                throw new common_1.ConflictException('البريد الإلكتروني مستخدم بالفعل');
            admin.email = dto.email;
        }
        if (dto.fullName)
            admin.fullName = dto.fullName;
        if (dto.password)
            admin.passwordHash = await bcrypt.hash(dto.password, SALT_ROUNDS);
        if (dto.role)
            admin.role = dto.role;
        if (dto.permissions)
            admin.permissions = admin.role === 'super_admin' ? [] : dto.permissions;
        if (dto.isActive !== undefined)
            admin.isActive = dto.isActive;
        if (admin.role === 'super_admin')
            admin.permissions = [];
        const saved = await this.admins.save(admin);
        return this.toRow(saved);
    }
    async remove(id, actor) {
        if (id === actor.id)
            throw new common_1.BadRequestException('لا يمكنك حذف حسابك الخاص من هنا');
        const admin = await this.admins.findOne({ where: { id } });
        if (!admin)
            throw new common_1.NotFoundException('الحساب غير موجود');
        if (admin.role === 'super_admin') {
            if (actor.role !== 'super_admin')
                throw new common_1.ForbiddenException('لا تملك صلاحية حذف حساب مدير عام');
            await this.assertNotLastSuperAdmin(admin.id);
        }
        await this.admins.remove(admin);
        return { id, deleted: true };
    }
    async updateOwnProfile(id, dto) {
        const admin = await this.admins
            .createQueryBuilder('a')
            .addSelect('a.passwordHash')
            .where('a.id = :id', { id })
            .getOne();
        if (!admin)
            throw new common_1.NotFoundException('الحساب غير موجود');
        if (dto.newPassword) {
            const matches = await bcrypt.compare(dto.currentPassword ?? '', admin.passwordHash);
            if (!matches)
                throw new common_1.UnauthorizedException('كلمة المرور الحالية غير صحيحة');
            admin.passwordHash = await bcrypt.hash(dto.newPassword, SALT_ROUNDS);
        }
        if (dto.fullName)
            admin.fullName = dto.fullName;
        const saved = await this.admins.save(admin);
        return this.toRow(saved);
    }
    async assertNotLastSuperAdmin(excludingId) {
        const otherSuperAdmins = await this.admins.count({
            where: { role: 'super_admin' },
        });
        if (otherSuperAdmins <= 1) {
            throw new common_1.BadRequestException('لا يمكن إزالة آخر حساب مدير عام في النظام');
        }
        void excludingId;
    }
    toRow(a) {
        return {
            id: a.id,
            fullName: a.fullName,
            email: a.email,
            role: a.role,
            permissions: a.role === 'super_admin' ? [...permissions_constants_1.ADMIN_PERMISSIONS] : a.permissions ?? [],
            isActive: a.isActive,
            createdAt: a.createdAt?.toISOString().slice(0, 10),
        };
    }
};
exports.AdminsService = AdminsService;
exports.AdminsService = AdminsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(admin_entity_1.Admin)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], AdminsService);
//# sourceMappingURL=admins.service.js.map
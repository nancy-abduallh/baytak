import {
    BadRequestException,
    ConflictException,
    ForbiddenException,
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Admin } from '../../entities/admin.entity';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { UpdateOwnProfileDto } from './dto/update-own-profile.dto';
import { ADMIN_PERMISSIONS, ADMIN_PERMISSION_LABELS } from './permissions.constants';

const SALT_ROUNDS = 12;

export interface RequestingAdmin {
    id: number;
    role: string;
}

@Injectable()
export class AdminsService {
    constructor(@InjectRepository(Admin) private readonly admins: Repository<Admin>) { }

    // ---------- Reference data ----------
    getPermissionsCatalogue() {
        return ADMIN_PERMISSIONS.map((key) => ({ key, label: ADMIN_PERMISSION_LABELS[key] }));
    }

    // ---------- Listing ----------
    async list() {
        const rows = await this.admins.find({ order: { createdAt: 'ASC' } });
        return rows.map((a) => this.toRow(a));
    }

    async me(id: number) {
        const admin = await this.admins.findOne({ where: { id } });
        if (!admin) throw new NotFoundException('الحساب غير موجود');
        return this.toRow(admin);
    }

    // ---------- Create (super admin / holders of admins.manage only) ----------
    async create(dto: CreateAdminDto, actor: RequestingAdmin) {
        if (dto.role === 'super_admin' && actor.role !== 'super_admin') {
            throw new ForbiddenException('فقط المدير العام يمكنه إنشاء حساب مدير عام آخر');
        }

        const existing = await this.admins.findOne({ where: { email: dto.email } });
        if (existing) throw new ConflictException('البريد الإلكتروني مستخدم بالفعل');

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

    // ---------- Update another admin's account ----------
    async update(id: number, dto: UpdateAdminDto, actor: RequestingAdmin) {
        const admin = await this.admins.findOne({ where: { id } });
        if (!admin) throw new NotFoundException('الحساب غير موجود');

        if (admin.role === 'super_admin' && actor.role !== 'super_admin') {
            throw new ForbiddenException('لا تملك صلاحية تعديل حساب مدير عام');
        }
        if (dto.role === 'super_admin' && actor.role !== 'super_admin') {
            throw new ForbiddenException('فقط المدير العام يمكنه منح صلاحية مدير عام');
        }

        // Guard against locking the platform out of every super admin.
        const demotingFromSuperAdmin = admin.role === 'super_admin' && dto.role && dto.role !== 'super_admin';
        const deactivatingSuperAdmin = admin.role === 'super_admin' && dto.isActive === false;
        if (demotingFromSuperAdmin || deactivatingSuperAdmin) {
            await this.assertNotLastSuperAdmin(admin.id);
        }

        if (dto.email && dto.email !== admin.email) {
            const existing = await this.admins.findOne({ where: { email: dto.email } });
            if (existing && existing.id !== id) throw new ConflictException('البريد الإلكتروني مستخدم بالفعل');
            admin.email = dto.email;
        }

        if (dto.fullName) admin.fullName = dto.fullName;
        if (dto.password) admin.passwordHash = await bcrypt.hash(dto.password, SALT_ROUNDS);
        if (dto.role) admin.role = dto.role;
        if (dto.permissions) admin.permissions = admin.role === 'super_admin' ? [] : dto.permissions;
        if (dto.isActive !== undefined) admin.isActive = dto.isActive;

        // super_admin never carries a stale permissions array.
        if (admin.role === 'super_admin') admin.permissions = [];

        const saved = await this.admins.save(admin);
        return this.toRow(saved);
    }

    // ---------- Delete another admin's account ----------
    async remove(id: number, actor: RequestingAdmin) {
        if (id === actor.id) throw new BadRequestException('لا يمكنك حذف حسابك الخاص من هنا');

        const admin = await this.admins.findOne({ where: { id } });
        if (!admin) throw new NotFoundException('الحساب غير موجود');

        if (admin.role === 'super_admin') {
            if (actor.role !== 'super_admin') throw new ForbiddenException('لا تملك صلاحية حذف حساب مدير عام');
            await this.assertNotLastSuperAdmin(admin.id);
        }

        await this.admins.remove(admin);
        return { id, deleted: true };
    }

    // ---------- Self-service profile edits (any authenticated admin) ----------
    async updateOwnProfile(id: number, dto: UpdateOwnProfileDto) {
        const admin = await this.admins
            .createQueryBuilder('a')
            .addSelect('a.passwordHash')
            .where('a.id = :id', { id })
            .getOne();
        if (!admin) throw new NotFoundException('الحساب غير موجود');

        if (dto.newPassword) {
            const matches = await bcrypt.compare(dto.currentPassword ?? '', admin.passwordHash);
            if (!matches) throw new UnauthorizedException('كلمة المرور الحالية غير صحيحة');
            admin.passwordHash = await bcrypt.hash(dto.newPassword, SALT_ROUNDS);
        }

        if (dto.fullName) admin.fullName = dto.fullName;

        const saved = await this.admins.save(admin);
        return this.toRow(saved);
    }

    private async assertNotLastSuperAdmin(excludingId: number) {
        const otherSuperAdmins = await this.admins.count({
            where: { role: 'super_admin' as any },
        });
        // otherSuperAdmins currently includes `excludingId` itself, so we
        // need at least 2 super admins in total to safely demote/disable/delete one.
        if (otherSuperAdmins <= 1) {
            throw new BadRequestException('لا يمكن إزالة آخر حساب مدير عام في النظام');
        }
        void excludingId;
    }

    private toRow(a: Admin) {
        return {
            id: a.id,
            fullName: a.fullName,
            email: a.email,
            role: a.role,
            permissions: a.role === 'super_admin' ? [...ADMIN_PERMISSIONS] : a.permissions ?? [],
            isActive: a.isActive,
            createdAt: a.createdAt?.toISOString().slice(0, 10),
        };
    }
}

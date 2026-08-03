import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { User } from '../../entities/user.entity';
import { AuthToken } from '../../entities/auth-token.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

const SALT_ROUNDS = 12;

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User) private readonly users: Repository<User>,
        @InjectRepository(AuthToken) private readonly authTokens: Repository<AuthToken>,
        private readonly jwt: JwtService,
        private readonly config: ConfigService,
    ) { }

    async register(dto: RegisterDto, meta: { userAgent?: string; ip?: string }) {
        const existing = await this.users.findOne({ where: { phone: dto.phone } });
        if (existing) throw new ConflictException('رقم الجوال مسجل بالفعل');

        const passwordHash = await bcrypt.hash(dto.password, SALT_ROUNDS);
        const user = await this.users.save(
            this.users.create({
                fullName: dto.fullName,
                phone: dto.phone,
                email: dto.email ?? null,
                passwordHash,
                city: dto.city ?? null,
                district: dto.district ?? null,
            }),
        );

        return this.issueTokenPair(user, meta);
    }

    async login(dto: LoginDto, meta: { userAgent?: string; ip?: string }) {
        const user = await this.users
            .createQueryBuilder('u')
            .addSelect('u.passwordHash')
            .where('u.phone = :phone', { phone: dto.phone })
            .getOne();

        if (!user || !(await bcrypt.compare(dto.password, user.passwordHash))) {
            throw new UnauthorizedException('رقم الجوال أو كلمة المرور غير صحيحة');
        }

        user.lastLoginAt = new Date();
        await this.users.save(user);

        return this.issueTokenPair(user, meta);
    }

    async refresh(userId: number, presentedToken: string, meta: { userAgent?: string; ip?: string }) {
        const tokenHash = this.hashToken(presentedToken);

        const stored = await this.authTokens.findOne({
            where: { actorType: 'user', actorId: userId, refreshTokenHash: tokenHash },
        });

        if (!stored || stored.revokedAt || stored.expiresAt < new Date()) {
            throw new UnauthorizedException('جلسة الدخول منتهية، الرجاء تسجيل الدخول مجددًا');
        }

        // Rotation: the used token is revoked immediately, so it can never be replayed.
        stored.revokedAt = new Date();
        await this.authTokens.save(stored);

        const user = await this.users.findOneByOrFail({ id: userId });
        return this.issueTokenPair(user, meta);
    }

    async logout(userId: number, presentedToken: string) {
        const tokenHash = this.hashToken(presentedToken);
        await this.authTokens.update(
            { actorType: 'user', actorId: userId, refreshTokenHash: tokenHash },
            { revokedAt: new Date() },
        );
        return { success: true };
    }

    async updateProfile(userId: number, dto: UpdateProfileDto) {
        const user = await this.users.findOneByOrFail({ id: userId });

        if (dto.phone && dto.phone !== user.phone) {
            const existing = await this.users.findOne({ where: { phone: dto.phone } });
            if (existing) throw new ConflictException('رقم الجوال مستخدم بالفعل');
        }
        if (dto.email && dto.email !== user.email) {
            const existing = await this.users.findOne({ where: { email: dto.email } });
            if (existing) throw new ConflictException('البريد الإلكتروني مستخدم بالفعل');
        }

        Object.assign(user, {
            fullName: dto.fullName ?? user.fullName,
            phone: dto.phone ?? user.phone,
            email: dto.email ?? user.email,
            city: dto.city ?? user.city,
            district: dto.district ?? user.district,
        });

        await this.users.save(user);
        return { id: user.id, fullName: user.fullName, phone: user.phone, email: user.email, city: user.city, district: user.district };
    }

    private async issueTokenPair(user: User, meta: { userAgent?: string; ip?: string }) {
        const accessToken = this.jwt.sign(
            { sub: user.id, phone: user.phone, actorType: 'user' },
            { secret: this.config.get('jwt.accessSecret'), expiresIn: this.config.get('jwt.accessExpiresIn') },
        );

        const refreshToken = this.jwt.sign(
            { sub: user.id, actorType: 'user' },
            { secret: this.config.get('jwt.refreshSecret'), expiresIn: this.config.get('jwt.refreshExpiresIn') },
        );

        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 30);

        await this.authTokens.save(
            this.authTokens.create({
                actorType: 'user',
                actorId: user.id,
                refreshTokenHash: this.hashToken(refreshToken),
                userAgent: meta.userAgent ?? null,
                ipAddress: meta.ip ?? null,
                expiresAt,
            }),
        );

        return {
            accessToken,
            refreshToken,
            user: { id: user.id, fullName: user.fullName, phone: user.phone, email: user.email, city: user.city, district: user.district },
        };
    }

    private hashToken(token: string) {
        return crypto.createHash('sha256').update(token).digest('hex');
    }
}
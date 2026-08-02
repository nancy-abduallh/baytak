import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin } from '../../../entities/admin.entity';
import { AdminPermission } from '../permissions.constants';

export interface AdminTokenPayload {
    sub: number;
    email: string;
    role: string;
    actorType: string;
    permissions?: AdminPermission[];
}

@Injectable()
export class JwtAdminStrategy extends PassportStrategy(Strategy, 'jwt-admin') {
    constructor(
        config: ConfigService,
        @InjectRepository(Admin) private readonly admins: Repository<Admin>,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: config.getOrThrow<string>('jwt.accessSecret'),
        });
    }

    async validate(payload: AdminTokenPayload) {
        // Reuses the same JWT secret as customer tokens, so we must make sure
        // a customer's access token can never be used against admin routes.
        if (payload.actorType !== 'admin') {
            throw new UnauthorizedException('رمز الدخول غير صالح للوحة التحكم');
        }

        // Re-check the account on every request (not just at login) so a
        // deactivated admin or one whose permissions were just revoked by a
        // super admin is locked out immediately instead of waiting for
        // their 8h token to expire.
        const admin = await this.admins.findOne({ where: { id: payload.sub } });
        if (!admin || !admin.isActive) {
            throw new UnauthorizedException('هذا الحساب غير نشط أو غير موجود');
        }

        return {
            id: admin.id,
            email: admin.email,
            role: admin.role,
            actorType: payload.actorType,
            permissions: admin.role === 'super_admin' ? [] : admin.permissions ?? [],
        };
    }
}

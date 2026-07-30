import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

export interface AdminTokenPayload {
    sub: number;
    email: string;
    role: string;
    actorType: string;
}

@Injectable()
export class JwtAdminStrategy extends PassportStrategy(Strategy, 'jwt-admin') {
    constructor(config: ConfigService) {
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
        return { id: payload.sub, email: payload.email, role: payload.role, actorType: payload.actorType };
    }
}
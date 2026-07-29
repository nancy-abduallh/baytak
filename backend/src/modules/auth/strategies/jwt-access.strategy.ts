import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

export interface AccessTokenPayload {
    sub: number;
    phone: string;
    actorType: 'user';
}

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(Strategy, 'jwt-access') {
    constructor(config: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: config.getOrThrow<string>('jwt.accessSecret'),
        });
    }

    async validate(payload: AccessTokenPayload) {
        return { id: payload.sub, phone: payload.phone, actorType: payload.actorType };
    }
}
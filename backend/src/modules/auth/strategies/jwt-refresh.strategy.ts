import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

export interface RefreshTokenPayload {
    sub: number;
    actorType: 'user';
}

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
    constructor(config: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
            ignoreExpiration: false,
            secretOrKey: config.getOrThrow<string>('jwt.refreshSecret'),
            passReqToCallback: true,
        });
    }

    async validate(req: Request, payload: RefreshTokenPayload) {
        return { id: payload.sub, actorType: payload.actorType, refreshToken: req.body?.refreshToken };
    }
}
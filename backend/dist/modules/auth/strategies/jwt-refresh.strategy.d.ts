import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
export interface RefreshTokenPayload {
    sub: number;
    actorType: 'user';
}
declare const JwtRefreshStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtRefreshStrategy extends JwtRefreshStrategy_base {
    constructor(config: ConfigService);
    validate(req: Request, payload: RefreshTokenPayload): Promise<{
        id: number;
        actorType: "user";
        refreshToken: any;
    }>;
}
export {};

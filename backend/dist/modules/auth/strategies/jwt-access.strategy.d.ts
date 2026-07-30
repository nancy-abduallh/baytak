import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
export interface AccessTokenPayload {
    sub: number;
    phone: string;
    actorType: 'user';
}
declare const JwtAccessStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtAccessStrategy extends JwtAccessStrategy_base {
    constructor(config: ConfigService);
    validate(payload: AccessTokenPayload): Promise<{
        id: number;
        phone: string;
        actorType: "user";
    }>;
}
export {};

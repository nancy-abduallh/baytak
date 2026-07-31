import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
export interface AdminTokenPayload {
    sub: number;
    email: string;
    role: string;
    actorType: string;
}
declare const JwtAdminStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtAdminStrategy extends JwtAdminStrategy_base {
    constructor(config: ConfigService);
    validate(payload: AdminTokenPayload): Promise<{
        id: number;
        email: string;
        role: string;
        actorType: string;
    }>;
}
export {};

import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
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
declare const JwtAdminStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtAdminStrategy extends JwtAdminStrategy_base {
    private readonly admins;
    constructor(config: ConfigService, admins: Repository<Admin>);
    validate(payload: AdminTokenPayload): Promise<{
        id: number;
        email: string;
        role: import("../../../entities/admin.entity").AdminRole;
        actorType: string;
        permissions: ("dashboard.view" | "orders.view" | "orders.update_status" | "orders.delete" | "technicians.manage" | "users.manage" | "categories.manage" | "admins.manage")[];
    }>;
}
export {};

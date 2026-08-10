import { AdminAuthService } from './admin-auth.service';
import { AdminLoginDto } from './dto/admin-login.dto';
export declare class AdminAuthController {
    private readonly service;
    constructor(service: AdminAuthService);
    login(dto: AdminLoginDto): Promise<{
        accessToken: string;
        admin: {
            id: number;
            fullName: string;
            email: string;
            role: import("../../entities/admin.entity").AdminRole;
            permissions: ("dashboard.view" | "orders.view" | "orders.update_status" | "orders.delete" | "technicians.manage" | "users.manage" | "categories.manage" | "admins.manage" | "settings.manage")[];
            isActive: true;
        };
    }>;
}

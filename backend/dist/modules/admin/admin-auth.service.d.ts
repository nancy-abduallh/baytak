import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Admin } from '../../entities/admin.entity';
import { AdminLoginDto } from './dto/admin-login.dto';
export declare class AdminAuthService {
    private readonly admins;
    private readonly jwt;
    private readonly config;
    constructor(admins: Repository<Admin>, jwt: JwtService, config: ConfigService);
    login(dto: AdminLoginDto): Promise<{
        accessToken: string;
        admin: {
            id: number;
            fullName: string;
            email: string;
            role: import("../../entities/admin.entity").AdminRole;
        };
    }>;
}

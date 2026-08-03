import type { Request } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
export declare class AuthController {
    private readonly auth;
    constructor(auth: AuthService);
    register(dto: RegisterDto, req: Request): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: number;
            fullName: string;
            phone: string;
            email: string | null;
            city: string | null;
            district: string | null;
        };
    }>;
    login(dto: LoginDto, req: Request): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: number;
            fullName: string;
            phone: string;
            email: string | null;
            city: string | null;
            district: string | null;
        };
    }>;
    refresh(user: {
        id: number;
        refreshToken: string;
    }, req: Request): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: number;
            fullName: string;
            phone: string;
            email: string | null;
            city: string | null;
            district: string | null;
        };
    }>;
    logout(user: {
        id: number;
        refreshToken: string;
    }): Promise<{
        success: boolean;
    }>;
    me(user: {
        id: number;
        phone: string;
    }): {
        id: number;
        phone: string;
    };
    updateMe(user: {
        id: number;
    }, dto: UpdateProfileDto): Promise<{
        id: number;
        fullName: string;
        phone: string;
        email: string | null;
        city: string | null;
        district: string | null;
    }>;
}

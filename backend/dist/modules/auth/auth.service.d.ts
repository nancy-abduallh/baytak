import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User } from '../../entities/user.entity';
import { AuthToken } from '../../entities/auth-token.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
export declare class AuthService {
    private readonly users;
    private readonly authTokens;
    private readonly jwt;
    private readonly config;
    constructor(users: Repository<User>, authTokens: Repository<AuthToken>, jwt: JwtService, config: ConfigService);
    register(dto: RegisterDto, meta: {
        userAgent?: string;
        ip?: string;
    }): Promise<{
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
    login(dto: LoginDto, meta: {
        userAgent?: string;
        ip?: string;
    }): Promise<{
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
    refresh(userId: number, presentedToken: string, meta: {
        userAgent?: string;
        ip?: string;
    }): Promise<{
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
    logout(userId: number, presentedToken: string): Promise<{
        success: boolean;
    }>;
    updateProfile(userId: number, dto: UpdateProfileDto): Promise<{
        id: number;
        fullName: string;
        phone: string;
        email: string | null;
        city: string | null;
        district: string | null;
    }>;
    private issueTokenPair;
    private hashToken;
}

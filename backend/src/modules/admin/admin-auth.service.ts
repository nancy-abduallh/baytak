import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { Admin } from '../../entities/admin.entity';
import { AdminLoginDto } from './dto/admin-login.dto';

@Injectable()
export class AdminAuthService {
    constructor(
        @InjectRepository(Admin) private readonly admins: Repository<Admin>,
        private readonly jwt: JwtService,
        private readonly config: ConfigService,
    ) { }

    async login(dto: AdminLoginDto) {
        const admin = await this.admins
            .createQueryBuilder('a')
            .addSelect('a.passwordHash')
            .where('a.email = :email', { email: dto.email })
            .getOne();

        if (!admin || !admin.isActive || !(await bcrypt.compare(dto.password, admin.passwordHash))) {
            throw new UnauthorizedException('البريد الإلكتروني أو كلمة المرور غير صحيحة');
        }

        const accessToken = this.jwt.sign(
            { sub: admin.id, email: admin.email, role: admin.role, actorType: 'admin' },
            { secret: this.config.get('jwt.accessSecret'), expiresIn: '8h' },
        );

        return {
            accessToken,
            admin: { id: admin.id, fullName: admin.fullName, email: admin.email, role: admin.role },
        };
    }
}
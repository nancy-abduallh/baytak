import { Body, Controller, Get, HttpCode, HttpStatus, Patch, Post, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtAccessGuard } from './guards/jwt-access.guard';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('auth')
export class AuthController {
    constructor(private readonly auth: AuthService) { }

    @Post('register')
    register(@Body() dto: RegisterDto, @Req() req: Request) {
        return this.auth.register(dto, { userAgent: req.headers['user-agent'], ip: req.ip });
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    login(@Body() dto: LoginDto, @Req() req: Request) {
        return this.auth.login(dto, { userAgent: req.headers['user-agent'], ip: req.ip });
    }

    @UseGuards(JwtRefreshGuard)
    @Post('refresh')
    @HttpCode(HttpStatus.OK)
    refresh(@CurrentUser() user: { id: number; refreshToken: string }, @Req() req: Request) {
        return this.auth.refresh(user.id, user.refreshToken, { userAgent: req.headers['user-agent'], ip: req.ip });
    }

    @UseGuards(JwtRefreshGuard)
    @Post('logout')
    @HttpCode(HttpStatus.OK)
    logout(@CurrentUser() user: { id: number; refreshToken: string }) {
        return this.auth.logout(user.id, user.refreshToken);
    }

    @UseGuards(JwtAccessGuard)
    @Get('me')
    me(@CurrentUser() user: { id: number; phone: string }) {
        return user;
    }

    @UseGuards(JwtAccessGuard)
    @Patch('me')
    updateMe(@CurrentUser() user: { id: number }, @Body() dto: UpdateProfileDto) {
        return this.auth.updateProfile(user.id, dto);
    }
}
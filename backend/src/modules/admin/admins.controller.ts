import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtAdminGuard } from './guards/jwt-admin.guard';
import { PermissionsGuard } from './guards/permissions.guard';
import { RequirePermission } from './decorators/require-permission.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AdminsService } from './admins.service';
import type { RequestingAdmin } from './admins.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { UpdateOwnProfileDto } from './dto/update-own-profile.dto';

@UseGuards(JwtAdminGuard, PermissionsGuard)
@Controller('admin')
export class AdminsController {
    constructor(private readonly service: AdminsService) { }

    // ---------- Own profile — any authenticated admin, no special permission required ----------
    @Get('me')
    me(@CurrentUser() user: RequestingAdmin) {
        return this.service.me(user.id);
    }

    @Patch('me')
    updateMe(@CurrentUser() user: RequestingAdmin, @Body() dto: UpdateOwnProfileDto) {
        return this.service.updateOwnProfile(user.id, dto);
    }

    // ---------- Permission catalogue, for building the role/permissions form ----------
    @Get('permissions')
    @RequirePermission('admins.manage')
    getPermissionsCatalogue() {
        return this.service.getPermissionsCatalogue();
    }

    // ---------- Admin management — requires admins.manage (super_admin always has it) ----------
    @Get('admins')
    @RequirePermission('admins.manage')
    list() {
        return this.service.list();
    }

    @Post('admins')
    @RequirePermission('admins.manage')
    create(@Body() dto: CreateAdminDto, @CurrentUser() user: RequestingAdmin) {
        return this.service.create(dto, user);
    }

    @Patch('admins/:id')
    @RequirePermission('admins.manage')
    update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateAdminDto, @CurrentUser() user: RequestingAdmin) {
        return this.service.update(id, dto, user);
    }

    @Delete('admins/:id')
    @RequirePermission('admins.manage')
    remove(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: RequestingAdmin) {
        return this.service.remove(id, user);
    }
}

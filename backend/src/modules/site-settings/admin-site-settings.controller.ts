import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { JwtAdminGuard } from '../admin/guards/jwt-admin.guard';
import { PermissionsGuard } from '../admin/guards/permissions.guard';
import { RequirePermission } from '../admin/decorators/require-permission.decorator';
import { UpdateSiteSettingsDto } from '../admin/dto/update-site-settings.dto';
import { SiteSettingsService } from './site-settings.service';

@UseGuards(JwtAdminGuard, PermissionsGuard)
@Controller('admin/site-settings')
export class AdminSiteSettingsController {
    constructor(private readonly service: SiteSettingsService) { }

    @Get()
    @RequirePermission('settings.manage')
    getSettings() {
        return this.service.getSettings();
    }

    @Patch()
    @RequirePermission('settings.manage')
    updateSettings(@Body() dto: UpdateSiteSettingsDto) {
        return this.service.updateSettings(dto);
    }
}
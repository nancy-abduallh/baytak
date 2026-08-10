import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SiteSetting } from '../../entities/site-setting.entity';
import { SiteSettingsService } from './site-settings.service';
import { SiteSettingsController } from './site-settings.controller';
import { AdminSiteSettingsController } from './admin-site-settings.controller';
import { PermissionsGuard } from '../admin/guards/permissions.guard';


@Module({
    imports: [TypeOrmModule.forFeature([SiteSetting])],
    controllers: [SiteSettingsController, AdminSiteSettingsController],
    providers: [SiteSettingsService, PermissionsGuard],
})
export class SiteSettingsModule { }
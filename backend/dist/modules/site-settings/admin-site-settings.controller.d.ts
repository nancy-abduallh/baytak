import { UpdateSiteSettingsDto } from '../admin/dto/update-site-settings.dto';
import { SiteSettingsService } from './site-settings.service';
export declare class AdminSiteSettingsController {
    private readonly service;
    constructor(service: SiteSettingsService);
    getSettings(): Promise<import("../../entities/site-setting.entity").SiteSetting>;
    updateSettings(dto: UpdateSiteSettingsDto): Promise<import("../../entities/site-setting.entity").SiteSetting>;
}

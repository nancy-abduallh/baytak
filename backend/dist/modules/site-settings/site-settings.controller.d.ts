import { SiteSettingsService } from './site-settings.service';
export declare class SiteSettingsController {
    private readonly service;
    constructor(service: SiteSettingsService);
    getSettings(): Promise<import("../../entities/site-setting.entity").SiteSetting>;
}

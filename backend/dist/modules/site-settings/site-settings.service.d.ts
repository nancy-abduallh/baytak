import { Repository } from 'typeorm';
import { SiteSetting } from '../../entities/site-setting.entity';
import { UpdateSiteSettingsDto } from '../admin/dto/update-site-settings.dto';
export declare class SiteSettingsService {
    private readonly repo;
    constructor(repo: Repository<SiteSetting>);
    getSettings(): Promise<SiteSetting>;
    updateSettings(dto: UpdateSiteSettingsDto): Promise<SiteSetting>;
}

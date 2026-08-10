import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SiteSetting } from '../../entities/site-setting.entity';
import { UpdateSiteSettingsDto } from '../admin/dto/update-site-settings.dto';

const SETTINGS_ID = 1;

const DEFAULTS: Omit<SiteSetting, 'id' | 'updatedAt'> = {
    siteName: 'بيتك',
    footerDescription:
        'تطبيق متكامل لخدمات صيانة وتشغيل المنازل، يقدم لك حلولًا سريعة وموثوقة لجميع احتياجات منزلك، بإشراف بيتك.',
    availabilityNote: 'متوفر في جميع مناطق المملكة',
    contactPhone: '9200 12345',
    contactWhatsapp: null,
    contactEmail: 'info@baytak.sa',
    websiteUrl: 'www.baytak.sa',
    address: null,
    workingHours: null,
    facebookUrl: null,
    twitterUrl: null,
    instagramUrl: null,
    tiktokUrl: null,
    copyrightText: null,
};

@Injectable()
export class SiteSettingsService {
    constructor(
        @InjectRepository(SiteSetting)
        private readonly repo: Repository<SiteSetting>,
    ) { }

    async getSettings(): Promise<SiteSetting> {
        let settings = await this.repo.findOne({ where: { id: SETTINGS_ID } });
        if (!settings) {
            settings = this.repo.create({ id: SETTINGS_ID, ...DEFAULTS });
            settings = await this.repo.save(settings);
        }
        return settings;
    }

    async updateSettings(dto: UpdateSiteSettingsDto): Promise<SiteSetting> {
        const settings = await this.getSettings();
        Object.assign(settings, dto);
        return this.repo.save(settings);
    }
}
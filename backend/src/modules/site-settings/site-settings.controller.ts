import { Controller, Get } from '@nestjs/common';
import { SiteSettingsService } from './site-settings.service';

// Public — no auth guard. The marketing/user frontend calls this to render
// the footer, contact info, and social links.
@Controller('site-settings')
export class SiteSettingsController {
    constructor(private readonly service: SiteSettingsService) { }

    @Get()
    getSettings() {
        return this.service.getSettings();
    }
}
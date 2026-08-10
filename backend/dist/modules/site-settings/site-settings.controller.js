"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SiteSettingsController = void 0;
const common_1 = require("@nestjs/common");
const site_settings_service_1 = require("./site-settings.service");
let SiteSettingsController = class SiteSettingsController {
    service;
    constructor(service) {
        this.service = service;
    }
    getSettings() {
        return this.service.getSettings();
    }
};
exports.SiteSettingsController = SiteSettingsController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SiteSettingsController.prototype, "getSettings", null);
exports.SiteSettingsController = SiteSettingsController = __decorate([
    (0, common_1.Controller)('site-settings'),
    __metadata("design:paramtypes", [site_settings_service_1.SiteSettingsService])
], SiteSettingsController);
//# sourceMappingURL=site-settings.controller.js.map
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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminSiteSettingsController = void 0;
const common_1 = require("@nestjs/common");
const jwt_admin_guard_1 = require("../admin/guards/jwt-admin.guard");
const permissions_guard_1 = require("../admin/guards/permissions.guard");
const require_permission_decorator_1 = require("../admin/decorators/require-permission.decorator");
const update_site_settings_dto_1 = require("../admin/dto/update-site-settings.dto");
const site_settings_service_1 = require("./site-settings.service");
let AdminSiteSettingsController = class AdminSiteSettingsController {
    service;
    constructor(service) {
        this.service = service;
    }
    getSettings() {
        return this.service.getSettings();
    }
    updateSettings(dto) {
        return this.service.updateSettings(dto);
    }
};
exports.AdminSiteSettingsController = AdminSiteSettingsController;
__decorate([
    (0, common_1.Get)(),
    (0, require_permission_decorator_1.RequirePermission)('settings.manage'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminSiteSettingsController.prototype, "getSettings", null);
__decorate([
    (0, common_1.Patch)(),
    (0, require_permission_decorator_1.RequirePermission)('settings.manage'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_site_settings_dto_1.UpdateSiteSettingsDto]),
    __metadata("design:returntype", void 0)
], AdminSiteSettingsController.prototype, "updateSettings", null);
exports.AdminSiteSettingsController = AdminSiteSettingsController = __decorate([
    (0, common_1.UseGuards)(jwt_admin_guard_1.JwtAdminGuard, permissions_guard_1.PermissionsGuard),
    (0, common_1.Controller)('admin/site-settings'),
    __metadata("design:paramtypes", [site_settings_service_1.SiteSettingsService])
], AdminSiteSettingsController);
//# sourceMappingURL=admin-site-settings.controller.js.map
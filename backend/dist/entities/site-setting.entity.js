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
exports.SiteSetting = void 0;
const typeorm_1 = require("typeorm");
let SiteSetting = class SiteSetting {
    id;
    siteName;
    footerDescription;
    availabilityNote;
    contactPhone;
    contactWhatsapp;
    contactEmail;
    websiteUrl;
    address;
    workingHours;
    facebookUrl;
    twitterUrl;
    instagramUrl;
    tiktokUrl;
    copyrightText;
    updatedAt;
};
exports.SiteSetting = SiteSetting;
__decorate([
    (0, typeorm_1.PrimaryColumn)({ type: 'tinyint', default: 1 }),
    __metadata("design:type", Number)
], SiteSetting.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'site_name', type: 'varchar', length: 80, default: 'بيتك' }),
    __metadata("design:type", String)
], SiteSetting.prototype, "siteName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'footer_description', type: 'text', nullable: true }),
    __metadata("design:type", Object)
], SiteSetting.prototype, "footerDescription", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'availability_note',
        type: 'varchar',
        length: 160,
        nullable: true,
    }),
    __metadata("design:type", Object)
], SiteSetting.prototype, "availabilityNote", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'contact_phone',
        type: 'varchar',
        length: 30,
        nullable: true,
    }),
    __metadata("design:type", Object)
], SiteSetting.prototype, "contactPhone", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'contact_whatsapp',
        type: 'varchar',
        length: 30,
        nullable: true,
    }),
    __metadata("design:type", Object)
], SiteSetting.prototype, "contactWhatsapp", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'contact_email',
        type: 'varchar',
        length: 160,
        nullable: true,
    }),
    __metadata("design:type", Object)
], SiteSetting.prototype, "contactEmail", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'website_url', type: 'varchar', length: 200, nullable: true }),
    __metadata("design:type", Object)
], SiteSetting.prototype, "websiteUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'address', type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", Object)
], SiteSetting.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'working_hours',
        type: 'varchar',
        length: 120,
        nullable: true,
    }),
    __metadata("design:type", Object)
], SiteSetting.prototype, "workingHours", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'facebook_url',
        type: 'varchar',
        length: 255,
        nullable: true,
    }),
    __metadata("design:type", Object)
], SiteSetting.prototype, "facebookUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'twitter_url', type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", Object)
], SiteSetting.prototype, "twitterUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'instagram_url',
        type: 'varchar',
        length: 255,
        nullable: true,
    }),
    __metadata("design:type", Object)
], SiteSetting.prototype, "instagramUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'tiktok_url', type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", Object)
], SiteSetting.prototype, "tiktokUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'copyright_text',
        type: 'varchar',
        length: 160,
        nullable: true,
    }),
    __metadata("design:type", Object)
], SiteSetting.prototype, "copyrightText", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], SiteSetting.prototype, "updatedAt", void 0);
exports.SiteSetting = SiteSetting = __decorate([
    (0, typeorm_1.Entity)('site_settings')
], SiteSetting);
//# sourceMappingURL=site-setting.entity.js.map
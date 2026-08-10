import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateSiteSettingsDto {
    @IsOptional()
    @IsString()
    @MaxLength(80)
    siteName?: string;

    @IsOptional()
    @IsString()
    @MaxLength(2000)
    footerDescription?: string;

    @IsOptional()
    @IsString()
    @MaxLength(160)
    availabilityNote?: string;

    // ---------- Contact us ----------
    @IsOptional()
    @IsString()
    @MaxLength(30)
    contactPhone?: string;

    @IsOptional()
    @IsString()
    @MaxLength(30)
    contactWhatsapp?: string;

    @IsOptional()
    @IsString()
    @MaxLength(160)
    contactEmail?: string;

    @IsOptional()
    @IsString()
    @MaxLength(200)
    websiteUrl?: string;

    @IsOptional()
    @IsString()
    @MaxLength(255)
    address?: string;

    @IsOptional()
    @IsString()
    @MaxLength(120)
    workingHours?: string;

    // ---------- Social links ----------
    @IsOptional()
    @IsString()
    @MaxLength(255)
    facebookUrl?: string;

    @IsOptional()
    @IsString()
    @MaxLength(255)
    twitterUrl?: string;

    @IsOptional()
    @IsString()
    @MaxLength(255)
    instagramUrl?: string;

    @IsOptional()
    @IsString()
    @MaxLength(255)
    tiktokUrl?: string;

    // ---------- Misc ----------
    @IsOptional()
    @IsString()
    @MaxLength(160)
    copyrightText?: string;
}
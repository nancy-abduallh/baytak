import { IsEmail, IsOptional, IsString, Length, Matches } from 'class-validator';

export class UpdateProfileDto {
    @IsOptional()
    @IsString()
    @Length(2, 120)
    fullName?: string;

    @IsOptional()
    @Matches(/^05\d{8}$/, { message: 'أدخل رقم جوال سعودي صحيح (يبدأ بـ 05 ويتكون من 10 أرقام)' })
    phone?: string;

    @IsOptional()
    @IsEmail({}, { message: 'البريد الإلكتروني غير صحيح' })
    email?: string;

    @IsOptional()
    @IsString()
    @Length(2, 80)
    city?: string;

    @IsOptional()
    @IsString()
    @Length(2, 80)
    district?: string;
}
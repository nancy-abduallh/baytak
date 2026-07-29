import { IsEmail, IsOptional, IsString, Matches, MinLength } from 'class-validator';

export class RegisterDto {
    @IsString()
    @MinLength(3)
    fullName: string;

    @Matches(/^05\d{8}$/, { message: 'أدخل رقم جوال سعودي صحيح (يبدأ بـ 05 ويتكون من 10 أرقام)' })
    phone: string;

    @IsOptional()
    @IsEmail()
    email?: string;

    @IsString()
    @MinLength(8, { message: 'كلمة المرور يجب ألا تقل عن 8 أحرف' })
    password: string;

    @IsOptional()
    @IsString()
    city?: string;

    @IsOptional()
    @IsString()
    district?: string;
}
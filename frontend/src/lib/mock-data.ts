import { ServiceCategory, Technician, Order, User } from "./types";

export const MOCK_CATEGORIES: ServiceCategory[] = [
    { id: 1, slug: "plumbing", nameAr: "سباكة", description: "إصلاح التسريبات، تركيب وصيانة الأدوات الصحية، وحل انسدادات الصرف.", iconKey: "droplet", priceFrom: 80, priceUnit: "ر.س" },
    { id: 2, slug: "electrical", nameAr: "كهرباء", description: "تمديدات كهربائية، إصلاح الأعطال المفاجئة، وتركيب الإضاءة والقواطع.", iconKey: "zap", priceFrom: 100, priceUnit: "ر.س" },
    { id: 3, slug: "ac", nameAr: "تكييف", description: "تنظيف وصيانة دورية، تعبئة فريون، وتركيب مكيفات جديدة باحترافية.", iconKey: "snowflake", priceFrom: 120, priceUnit: "ر.س" },
    { id: 4, slug: "carpentry", nameAr: "نجارة", description: "تصليح الأبواب والأثاث المخصص، وتركيب الخزائن حسب الطلب.", iconKey: "hammer", priceFrom: 90, priceUnit: "ر.س" },
    { id: 5, slug: "painting", nameAr: "دهانات", description: "دهانات داخلية وخارجية بخامات مضمونة وفريق تنفيذ نظيف وسريع.", iconKey: "paint-roller", priceFrom: 1.2, priceUnit: "ر.س/م²" },
    { id: 6, slug: "cleaning", nameAr: "تنظيف", description: "تنظيف شامل للمنزل أو تنظيف ما بعد التشطيب بمعدات احترافية.", iconKey: "sparkles", priceFrom: 150, priceUnit: "ر.س" },
];

export const MOCK_TECHNICIANS: Technician[] = [
    { id: 1, fullName: "محمد أحمد", initials: "م.أ", primaryCategoryId: 2, categorySlug: "electrical", categoryLabel: "كهرباء", yearsExperience: 6, city: "الرياض", district: "حي النرجس", distanceKm: 2, priceFrom: 100, isVerified: true, averageRating: 4.8, reviewCount: 210 },
    { id: 2, fullName: "سعيد القرني", initials: "س.ق", primaryCategoryId: 2, categorySlug: "electrical", categoryLabel: "كهرباء", yearsExperience: 4, city: "الرياض", district: "حي الملقا", distanceKm: 3.4, priceFrom: 100, isVerified: true, averageRating: 4.7, reviewCount: 164 },
    { id: 3, fullName: "عادل الشهري", initials: "ع.ش", primaryCategoryId: 2, categorySlug: "electrical", categoryLabel: "كهرباء", yearsExperience: 9, city: "الرياض", district: "حي الياسمين", distanceKm: 1.2, priceFrom: 120, isVerified: true, averageRating: 4.9, reviewCount: 305 },
    { id: 4, fullName: "خالد النعيمي", initials: "خ.ن", primaryCategoryId: 2, categorySlug: "electrical", categoryLabel: "كهرباء", yearsExperience: 3, city: "الرياض", district: "حي الربيع", distanceKm: 4.1, priceFrom: 90, isVerified: true, averageRating: 4.6, reviewCount: 98 },
];

export const MOCK_USER: User = {
    id: 1, fullName: "أحمد محمد", initials: "أح", phone: "0555555555", city: "الرياض", district: "حي الربيع",
};

export const MOCK_ORDERS: Order[] = [
    { id: 1010, orderNumber: "#1010", categoryId: 2, categorySlug: "electrical", categoryLabel: "كهرباء", categoryIconKey: "zap", technician: { id: 1, fullName: "محمد أحمد" }, description: "المشكلة في الإضاءة لا تعمل. يحتاج فحص وإصلاح مع استبدال القاطع إن لزم الأمر.", status: "in_progress", address: "الرياض - حي النرجس", amount: 200, scheduledDate: "2024-05-12" },
    { id: 1000, orderNumber: "#1000", categoryId: 1, categorySlug: "plumbing", categoryLabel: "سباكة", categoryIconKey: "droplet", technician: { id: 2, fullName: "سعيد القرني" }, description: "تسريب أسفل حوض المطبخ", status: "completed", address: "الرياض - حي النرجس", amount: 150, scheduledDate: "2024-05-10" },
    { id: 999, orderNumber: "#0999", categoryId: 3, categorySlug: "ac", categoryLabel: "تكييف", categoryIconKey: "snowflake", technician: { id: 3, fullName: "عادل الشهري" }, description: "صيانة دورية وتنظيف فلاتر", status: "completed", address: "الرياض - حي النرجس", amount: 210, scheduledDate: "2024-05-05" },
];
-- =====================================================================
-- BAYTAK — Sample Seed Data
-- MySQL 8.x / Railway
--
-- IMPORTANT:
-- Run AFTER schema.sql
--
-- This file:
-- 1. Removes existing demo/application data
-- 2. Inserts fresh sample data
-- 3. Uses UTF-8 / utf8mb4 for Arabic
-- 4. Can be safely re-run for demo deployment
-- =====================================================================

USE railway;

-- Force UTF-8 communication between MySQL client and server.
SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

SET FOREIGN_KEY_CHECKS = 0;


-- =====================================================================
-- 1. RESET EXISTING APPLICATION DATA
-- =====================================================================

TRUNCATE TABLE order_status_history;
TRUNCATE TABLE order_images;
TRUNCATE TABLE reviews;
TRUNCATE TABLE favorites;
TRUNCATE TABLE orders;
TRUNCATE TABLE payment_methods;
TRUNCATE TABLE technician_availability;
TRUNCATE TABLE technician_categories;
TRUNCATE TABLE addresses;
TRUNCATE TABLE notifications;
TRUNCATE TABLE auth_tokens;
TRUNCATE TABLE technicians;
TRUNCATE TABLE users;
TRUNCATE TABLE admins;
TRUNCATE TABLE service_categories;


-- =====================================================================
-- 2. SERVICE CATEGORIES
-- =====================================================================

INSERT INTO service_categories
(
    id,
    slug,
    name_ar,
    description,
    icon_key,
    price_from,
    price_unit,
    sort_order,
    is_active
)
VALUES

(
    1,
    'plumbing',
    'سباكة',
    'إصلاح التسريبات، تركيب وصيانة الأدوات الصحية، وحل انسدادات الصرف.',
    'droplet',
    80.00,
    'ر.س',
    1,
    1
),

(
    2,
    'electrical',
    'كهرباء',
    'تمديدات كهربائية، إصلاح الأعطال المفاجئة، وتركيب الإضاءة والقواطع.',
    'zap',
    100.00,
    'ر.س',
    2,
    1
),

(
    3,
    'ac',
    'تكييف',
    'تنظيف وصيانة دورية، تعبئة فريون، وتركيب مكيفات جديدة باحترافية.',
    'snowflake',
    120.00,
    'ر.س',
    3,
    1
),

(
    4,
    'carpentry',
    'نجارة',
    'تصليح الأبواب والأثاث المخصص، وتركيب الخزائن حسب الطلب.',
    'hammer',
    90.00,
    'ر.س',
    4,
    1
),

(
    5,
    'painting',
    'دهانات',
    'دهانات داخلية وخارجية بخامات مضمونة وفريق تنفيذ نظيف وسريع.',
    'paint-roller',
    1.20,
    'ر.س/م2',
    5,
    1
),

(
    6,
    'cleaning',
    'تنظيف',
    'تنظيف شامل للمنزل أو تنظيف ما بعد التشطيب بمعدات احترافية.',
    'sparkles',
    150.00,
    'ر.س',
    6,
    1
);


-- =====================================================================
-- 3. TECHNICIANS
-- =====================================================================

INSERT INTO technicians
(
    id,
    full_name,
    initials,
    phone,
    email,
    password_hash,
    primary_category_id,
    years_experience,
    city,
    district,
    price_from,
    is_verified,
    is_active,
    average_rating,
    review_count
)
VALUES

(
    1,
    'محمد أحمد',
    'م.أ',
    '0501111111',
    'mohammed.ahmed@baytak.sa',
    '$2b$12$replaceWithRealBcryptHash',
    2,
    6,
    'الرياض',
    'حي النرجس',
    100.00,
    1,
    1,
    4.8,
    210
),

(
    2,
    'سعيد القرني',
    'س.ق',
    '0502222222',
    'saeed.alqarni@baytak.sa',
    '$2b$12$replaceWithRealBcryptHash',
    2,
    4,
    'الرياض',
    'حي الملقا',
    100.00,
    1,
    1,
    4.7,
    164
),

(
    3,
    'عادل الشهري',
    'ع.ش',
    '0503333333',
    'adel.alshehri@baytak.sa',
    '$2b$12$replaceWithRealBcryptHash',
    2,
    9,
    'الرياض',
    'حي الياسمين',
    120.00,
    1,
    1,
    4.9,
    305
),

(
    4,
    'خالد النعيمي',
    'خ.ن',
    '0504444444',
    'khaled.alnuaimi@baytak.sa',
    '$2b$12$replaceWithRealBcryptHash',
    2,
    3,
    'الرياض',
    'حي الربيع',
    90.00,
    1,
    1,
    4.6,
    98
);


-- =====================================================================
-- 4. TECHNICIAN CATEGORIES
-- =====================================================================

INSERT INTO technician_categories
(
    technician_id,
    category_id
)
VALUES
(1, 2),
(2, 2),
(3, 2),
(4, 2);


-- =====================================================================
-- 5. CUSTOMER
-- =====================================================================

INSERT INTO users
(
    id,
    full_name,
    phone,
    email,
    password_hash,
    city,
    district,
    is_phone_verified,
    is_active
)
VALUES
(
    1,
    'أحمد محمد',
    '0555555555',
    'ahmed.m@example.com',
    '$2b$12$replaceWithRealBcryptHash',
    'الرياض',
    'حي الربيع',
    1,
    1
);


-- =====================================================================
-- 6. CUSTOMER ADDRESS
-- =====================================================================

INSERT INTO addresses
(
    id,
    user_id,
    label,
    city,
    district,
    street,
    is_default
)
VALUES
(
    1,
    1,
    'المنزل',
    'الرياض',
    'حي النرجس',
    'شارع الأمير سلطان',
    1
);


-- =====================================================================
-- 7. ORDERS
-- =====================================================================

INSERT INTO orders
(
    id,
    user_id,
    technician_id,
    category_id,
    address_id,
    description,
    status,
    scheduled_date,
    scheduled_slot,
    amount,
    payment_status
)
VALUES

(
    1000,
    1,
    2,
    1,
    1,
    'تسريب أسفل حوض المطبخ',
    'completed',
    '2024-05-10',
    'صباحًا',
    150.00,
    'paid'
),

(
    1009,
    1,
    3,
    3,
    1,
    'صيانة دورية وتنظيف فلاتر',
    'completed',
    '2024-05-05',
    'مساءً',
    210.00,
    'paid'
),

(
    1010,
    1,
    1,
    2,
    1,
    'المشكلة في الإضاءة لا تعمل. يحتاج فحص وإصلاح مع استبدال القاطع إن لزم الأمر.',
    'in_progress',
    '2024-05-12',
    'أقرب موعد',
    200.00,
    'unpaid'
);


-- =====================================================================
-- 8. ORDER STATUS HISTORY
-- =====================================================================

INSERT INTO order_status_history
(
    order_id,
    status,
    note
)
VALUES

(
    1010,
    'pending',
    'تم إنشاء الطلب'
),

(
    1010,
    'confirmed',
    'تم تعيين الفني محمد أحمد'
),

(
    1010,
    'in_progress',
    'الفني في الطريق إليك'
);


-- =====================================================================
-- 9. REVIEWS
-- =====================================================================

INSERT INTO reviews
(
    order_id,
    user_id,
    technician_id,
    rating,
    comment
)
VALUES

(
    1000,
    1,
    2,
    5,
    'سرعة في الاستجابة والتنفيذ، ممتاز.'
),

(
    1009,
    1,
    3,
    5,
    'فني محترف ونظيف في العمل.'
);


-- =====================================================================
-- 10. ADMIN
-- =====================================================================

INSERT INTO admins
(
    id,
    full_name,
    email,
    password_hash,
    role,
    is_active
)
VALUES
(
    1,
    'مدير النظام',
    'admin@baytak.sa',
    '$2b$12$oqvx914qmpmQ2rcK08JQGuUE3O4a.ZGhZBKXzpSy2uuDRq0agEPM2',
    'super_admin',
    1
);

-- Login email: admin@baytak.sa -- Login password: Admin@12345


-- =====================================================================
-- 11. ADMIN PERMISSIONS
-- =====================================================================

UPDATE admins
SET permissions = JSON_ARRAY(
    'dashboard.view',
    'orders.view',
    'orders.update_status',
    'orders.delete',
    'technicians.manage',
    'users.manage',
    'categories.manage',
    'admins.manage',
    'settings.manage'
)
WHERE email = 'admin@baytak.sa';


-- =====================================================================
-- 12. SITE SETTINGS
-- =====================================================================

UPDATE site_settings
SET
    site_name = 'بيتك',
    footer_description =
        'تطبيق متكامل لخدمات صيانة وتشغيل المنازل، يقدم لك حلولًا سريعة وموثوقة لجميع احتياجات منزلك، بإشراف بيتك.',
    availability_note = 'متوفر في جميع مناطق المملكة',
    contact_phone = '9200 12345',
    contact_email = 'info@baytak.sa',
    website_url = 'www.baytak.sa'
WHERE id = 1;


-- =====================================================================
-- 13. RESET AUTO-INCREMENT
-- =====================================================================

ALTER TABLE service_categories AUTO_INCREMENT = 7;
ALTER TABLE technicians AUTO_INCREMENT = 5;
ALTER TABLE users AUTO_INCREMENT = 2;
ALTER TABLE addresses AUTO_INCREMENT = 2;
ALTER TABLE orders AUTO_INCREMENT = 1011;
ALTER TABLE admins AUTO_INCREMENT = 2;


-- =====================================================================
-- 14. RESTORE FOREIGN KEY CHECKS
-- =====================================================================

SET FOREIGN_KEY_CHECKS = 1;


-- =====================================================================
-- 15. VERIFICATION
-- =====================================================================

SELECT
    'service_categories' AS table_name,
    COUNT(*) AS row_count
FROM service_categories

UNION ALL

SELECT
    'technicians',
    COUNT(*)
FROM technicians

UNION ALL

SELECT
    'users',
    COUNT(*)
FROM users

UNION ALL

SELECT
    'addresses',
    COUNT(*)
FROM addresses

UNION ALL

SELECT
    'orders',
    COUNT(*)
FROM orders

UNION ALL

SELECT
    'reviews',
    COUNT(*)
FROM reviews

UNION ALL

SELECT
    'admins',
    COUNT(*)
FROM admins;


-- =====================================================================
-- 16. UTF-8 VERIFICATION
-- =====================================================================

SELECT
    id,
    slug,
    name_ar,
    description
FROM service_categories
ORDER BY sort_order;
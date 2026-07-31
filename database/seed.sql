-- =====================================================================
--  BAYTAK — sample seed data (matches the design mockups)
--  Run AFTER schema.sql
-- =====================================================================
USE baytak_db;
SET NAMES utf8mb4;

-- ---------- Service categories ----------
INSERT INTO service_categories (slug, name_ar, description, icon_key, price_from, price_unit, sort_order) VALUES
('plumbing',   'سباكة',  'إصلاح التسريبات، تركيب وصيانة الأدوات الصحية، وحل انسدادات الصرف.',            'droplet',      80.00,  'ر.س',    1),
('electrical', 'كهرباء', 'تمديدات كهربائية، إصلاح الأعطال المفاجئة، وتركيب الإضاءة والقواطع.',            'zap',         100.00,  'ر.س',    2),
('ac',         'تكييف',  'تنظيف وصيانة دورية، تعبئة فريون، وتركيب مكيفات جديدة باحترافية.',               'snowflake',   120.00,  'ر.س',    3),
('carpentry',  'نجارة',  'تصليح الأبواب والأثاث المخصص، وتركيب الخزائن حسب الطلب.',                       'hammer',       90.00,  'ر.س',    4),
('painting',   'دهانات', 'دهانات داخلية وخارجية بخامات مضمونة وفريق تنفيذ نظيف وسريع.',                    'paint-roller',  1.20,  'ر.س/م2', 5),
('cleaning',   'تنظيف',  'تنظيف شامل للمنزل أو تنظيف ما بعد التشطيب بمعدات احترافية.',                     'sparkles',    150.00,  'ر.س',    6);

-- ---------- Technicians (password: Passw0rd!  — bcrypt hash placeholder, replace on real signup) ----------
INSERT INTO technicians (full_name, initials, phone, email, password_hash, primary_category_id, years_experience, city, district, price_from, is_verified, average_rating, review_count) VALUES
('محمد أحمد',   'م.أ', '0501111111', 'mohammed.ahmed@baytak.sa', '$2b$12$replaceWithRealBcryptHash', 2, 6, 'الرياض', 'حي النرجس', 100.00, 1, 4.8, 210),
('سعيد القرني', 'س.ق', '0502222222', 'saeed.alqarni@baytak.sa',  '$2b$12$replaceWithRealBcryptHash', 2, 4, 'الرياض', 'حي الملقا', 100.00, 1, 4.7, 164),
('عادل الشهري', 'ع.ش', '0503333333', 'adel.alshehri@baytak.sa',  '$2b$12$replaceWithRealBcryptHash', 2, 9, 'الرياض', 'حي الياسمين', 120.00, 1, 4.9, 305),
('خالد النعيمي','خ.ن', '0504444444', 'khaled.alnuaimi@baytak.sa','$2b$12$replaceWithRealBcryptHash', 2, 3, 'الرياض', 'حي الربيع', 90.00, 1, 4.6, 98);

INSERT INTO technician_categories (technician_id, category_id) VALUES
(1,2),(2,2),(3,2),(4,2);

-- ---------- A customer ----------
INSERT INTO users (full_name, phone, email, password_hash, city, district, is_phone_verified) VALUES
('أحمد محمد', '0555555555', 'ahmed.m@example.com', '$2b$12$replaceWithRealBcryptHash', 'الرياض', 'حي الربيع', 1);

INSERT INTO addresses (user_id, label, city, district, street, is_default) VALUES
(1, 'المنزل', 'الرياض', 'حي النرجس', 'شارع الأمير سلطان', 1);

-- ---------- Orders (matches #1010 / #1000 / #0999 in the mockup) ----------
INSERT INTO orders (id, user_id, technician_id, category_id, address_id, description, status, scheduled_date, scheduled_slot, amount, payment_status) VALUES
(1000, 1, 2, 1, 1, 'تسريب أسفل حوض المطبخ',                                    'completed',   '2024-05-10', 'صباحًا', 150.00, 'paid'),
(1009, 1, 3, 3, 1, 'صيانة دورية وتنظيف فلاتر',                                  'completed',   '2024-05-05', 'مساءً',  210.00, 'paid'),
(1010, 1, 1, 2, 1, 'المشكلة في الإضاءة لا تعمل. يحتاج فحص وإصلاح مع استبدال القاطع إن لزم الأمر.', 'in_progress', '2024-05-12', 'أقرب موعت', 200.00, 'unpaid');

INSERT INTO order_status_history (order_id, status, note) VALUES
(1010, 'pending',   'تم إنشاء الطلب'),
(1010, 'confirmed', 'تم تعيين الفني محمد أحمد'),
(1010, 'in_progress','الفني في الطريق إليك');

-- ---------- Reviews ----------
INSERT INTO reviews (order_id, user_id, technician_id, rating, comment) VALUES
(1000, 1, 2, 5, 'سرعة في الاستجابة والتنفيذ، ممتاز.'),
(1009, 1, 3, 5, 'فني محترف ونظيف في العمل.');

-- ---------- Admin (super_admin) ----------
-- Login email: admin@baytak.sa
-- Login password: Admin@12345   
INSERT INTO admins (full_name, email, password_hash, role, is_active) VALUES
('مدير النظام', 'admin@baytak.sa', '$2b$12$oqvx914qmpmQ2rcK08JQGuUE3O4a.ZGhZBKXzpSy2uuDRq0agEPM2', 'super_admin', 1);

-- =====================================================================
--  BAYTAK (بيتك) — Home Maintenance & Services Platform
--  MySQL 8.x schema — designed for XAMPP / phpMyAdmin
--  Engine  : InnoDB   (transactions + foreign keys)
--  Charset : utf8mb4  (full Arabic script + emoji support)
-- =====================================================================

CREATE DATABASE IF NOT EXISTS baytak_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE baytak_db;

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ---------------------------------------------------------------------
-- 1. USERS  (customers)
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS users;
CREATE TABLE users (
  id                 BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  full_name          VARCHAR(120)  NOT NULL,
  phone              VARCHAR(20)   NOT NULL,
  email              VARCHAR(160)  NULL,
  password_hash      VARCHAR(255)  NOT NULL,   -- bcrypt/argon2 hash only, never plain text
  avatar_url         VARCHAR(255)  NULL,
  city               VARCHAR(80)   NULL,
  district           VARCHAR(80)   NULL,
  is_active          TINYINT(1)    NOT NULL DEFAULT 1,
  is_phone_verified  TINYINT(1)    NOT NULL DEFAULT 0,
  last_login_at      DATETIME      NULL,
  created_at         TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at         TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at         TIMESTAMP     NULL,       -- soft delete
  UNIQUE KEY uq_users_phone (phone),
  UNIQUE KEY uq_users_email (email)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 2. ADDRESSES  (a user can save several addresses)
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS addresses;
CREATE TABLE addresses (
  id           BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id      BIGINT UNSIGNED NOT NULL,
  label        VARCHAR(60)   NOT NULL DEFAULT 'المنزل',
  city         VARCHAR(80)   NOT NULL,
  district     VARCHAR(80)   NOT NULL,
  street       VARCHAR(160)  NULL,
  building_no  VARCHAR(30)   NULL,
  lat          DECIMAL(10,7) NULL,
  lng          DECIMAL(10,7) NULL,
  is_default   TINYINT(1)    NOT NULL DEFAULT 0,
  created_at   TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_addresses_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  KEY idx_addresses_user (user_id)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 3. SERVICE CATEGORIES  (سباكة، كهرباء، تكييف، نجارة، دهانات، تنظيف ...)
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS service_categories;
CREATE TABLE service_categories (
  id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  slug         VARCHAR(60)   NOT NULL,          -- e.g. 'electrical'
  name_ar      VARCHAR(80)   NOT NULL,          -- e.g. 'كهرباء'
  description  VARCHAR(255)  NULL,
  icon_key     VARCHAR(40)   NOT NULL,          -- maps to a lucide-react icon on the frontend
  price_from   DECIMAL(10,2) NOT NULL,
  price_unit   VARCHAR(20)   NOT NULL DEFAULT 'ر.س',  -- 'ر.س' or 'ر.س/م2'
  sort_order   SMALLINT      NOT NULL DEFAULT 0,
  is_active    TINYINT(1)    NOT NULL DEFAULT 1,
  UNIQUE KEY uq_categories_slug (slug)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 4. TECHNICIANS
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS technicians;
CREATE TABLE technicians (
  id                 BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  full_name          VARCHAR(120)  NOT NULL,
  initials           VARCHAR(6)    NOT NULL,     -- 'م.أ' avatar fallback
  phone              VARCHAR(20)   NOT NULL,
  email              VARCHAR(160)  NULL,
  password_hash      VARCHAR(255)  NOT NULL,
  avatar_url         VARCHAR(255)  NULL,
  primary_category_id INT UNSIGNED NOT NULL,
  years_experience   SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  city               VARCHAR(80)   NOT NULL,
  district           VARCHAR(80)   NOT NULL,
  lat                DECIMAL(10,7) NULL,
  lng                DECIMAL(10,7) NULL,
  price_from         DECIMAL(10,2) NOT NULL,
  is_verified        TINYINT(1)    NOT NULL DEFAULT 0,
  is_active          TINYINT(1)    NOT NULL DEFAULT 1,
  average_rating     DECIMAL(2,1)  NOT NULL DEFAULT 0.0,  -- denormalized, refreshed by trigger/app
  review_count       INT UNSIGNED  NOT NULL DEFAULT 0,
  created_at         TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at         TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_tech_category FOREIGN KEY (primary_category_id) REFERENCES service_categories(id),
  UNIQUE KEY uq_tech_phone (phone),
  UNIQUE KEY uq_tech_email (email),
  KEY idx_tech_category (primary_category_id),
  KEY idx_tech_city_district (city, district)
) ENGINE=InnoDB;

-- A technician may serve more than one category (many-to-many)
DROP TABLE IF EXISTS technician_categories;
CREATE TABLE technician_categories (
  technician_id BIGINT UNSIGNED NOT NULL,
  category_id   INT UNSIGNED NOT NULL,
  PRIMARY KEY (technician_id, category_id),
  CONSTRAINT fk_tc_tech FOREIGN KEY (technician_id) REFERENCES technicians(id) ON DELETE CASCADE,
  CONSTRAINT fk_tc_cat  FOREIGN KEY (category_id)   REFERENCES service_categories(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Simple weekly availability template per technician
DROP TABLE IF EXISTS technician_availability;
CREATE TABLE technician_availability (
  id             BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  technician_id  BIGINT UNSIGNED NOT NULL,
  day_of_week    TINYINT UNSIGNED NOT NULL,   -- 0=Sunday ... 6=Saturday
  start_time     TIME NOT NULL,
  end_time       TIME NOT NULL,
  is_available   TINYINT(1) NOT NULL DEFAULT 1,
  CONSTRAINT fk_avail_tech FOREIGN KEY (technician_id) REFERENCES technicians(id) ON DELETE CASCADE,
  KEY idx_avail_tech (technician_id)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 5. ORDERS  (service bookings)
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS orders;
CREATE TABLE orders (
  id               BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id          BIGINT UNSIGNED NOT NULL,
  technician_id    BIGINT UNSIGNED NULL,
  category_id      INT UNSIGNED NOT NULL,
  address_id       BIGINT UNSIGNED NOT NULL,
  description      TEXT NULL,
  status           ENUM('pending','confirmed','in_progress','completed','cancelled')
                     NOT NULL DEFAULT 'pending',
  scheduled_date   DATE NOT NULL,
  scheduled_slot   VARCHAR(30) NULL,           -- 'صباحًا' / 'مساءً' / '10:00 - 12:00'
  amount           DECIMAL(10,2) NOT NULL,
  payment_status   ENUM('unpaid','paid','refunded') NOT NULL DEFAULT 'unpaid',
  payment_method_id BIGINT UNSIGNED NULL,
  created_at       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_orders_user       FOREIGN KEY (user_id)       REFERENCES users(id),
  CONSTRAINT fk_orders_tech       FOREIGN KEY (technician_id) REFERENCES technicians(id),
  CONSTRAINT fk_orders_category   FOREIGN KEY (category_id)   REFERENCES service_categories(id),
  CONSTRAINT fk_orders_address    FOREIGN KEY (address_id)    REFERENCES addresses(id),
  KEY idx_orders_user (user_id),
  KEY idx_orders_tech (technician_id),
  KEY idx_orders_status (status)
) ENGINE=InnoDB AUTO_INCREMENT = 1000;   -- so the first order reads as #1000, matching the design

-- Optional photos attached to an order ("إضافة صور بالاختيار")
DROP TABLE IF EXISTS order_images;
CREATE TABLE order_images (
  id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  order_id    BIGINT UNSIGNED NOT NULL,
  image_url   VARCHAR(255) NOT NULL,
  uploaded_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_oi_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Status timeline, powers live tracking ("فني في الطريق إليك")
DROP TABLE IF EXISTS order_status_history;
CREATE TABLE order_status_history (
  id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  order_id    BIGINT UNSIGNED NOT NULL,
  status      ENUM('pending','confirmed','in_progress','completed','cancelled') NOT NULL,
  note        VARCHAR(255) NULL,
  changed_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_osh_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  KEY idx_osh_order (order_id)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 6. REVIEWS
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS reviews;
CREATE TABLE reviews (
  id             BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  order_id       BIGINT UNSIGNED NOT NULL,
  user_id        BIGINT UNSIGNED NOT NULL,
  technician_id  BIGINT UNSIGNED NOT NULL,
  rating         TINYINT UNSIGNED NOT NULL,     -- 1..5, enforced by CHECK below
  comment        VARCHAR(500) NULL,
  created_at     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_rev_order FOREIGN KEY (order_id)      REFERENCES orders(id) ON DELETE CASCADE,
  CONSTRAINT fk_rev_user  FOREIGN KEY (user_id)        REFERENCES users(id),
  CONSTRAINT fk_rev_tech  FOREIGN KEY (technician_id)  REFERENCES technicians(id),
  CONSTRAINT chk_rev_rating CHECK (rating BETWEEN 1 AND 5),
  UNIQUE KEY uq_review_per_order (order_id)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 7. FAVORITES
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS favorites;
CREATE TABLE favorites (
  id             BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id        BIGINT UNSIGNED NOT NULL,
  technician_id  BIGINT UNSIGNED NOT NULL,
  created_at     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_fav_user FOREIGN KEY (user_id)       REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_fav_tech FOREIGN KEY (technician_id) REFERENCES technicians(id) ON DELETE CASCADE,
  UNIQUE KEY uq_fav (user_id, technician_id)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 8. PAYMENT METHODS
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS payment_methods;
CREATE TABLE payment_methods (
  id           BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id      BIGINT UNSIGNED NOT NULL,
  type         ENUM('card','apple_pay','stc_pay','cash') NOT NULL,
  card_brand   VARCHAR(30) NULL,      -- 'Visa' / 'Mastercard' / 'mada'
  card_last4   CHAR(4) NULL,
  is_default   TINYINT(1) NOT NULL DEFAULT 0,
  created_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_pm_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- add the FK from orders to payment_methods now that the table exists
ALTER TABLE orders
  ADD CONSTRAINT fk_orders_payment FOREIGN KEY (payment_method_id) REFERENCES payment_methods(id);

-- ---------------------------------------------------------------------
-- 9. NOTIFICATIONS
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS notifications;
CREATE TABLE notifications (
  id             BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id        BIGINT UNSIGNED NULL,
  technician_id  BIGINT UNSIGNED NULL,
  title          VARCHAR(150) NOT NULL,
  body           VARCHAR(400) NOT NULL,
  type           VARCHAR(40)  NOT NULL DEFAULT 'order_update',
  is_read        TINYINT(1)   NOT NULL DEFAULT 0,
  created_at     TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_notif_user FOREIGN KEY (user_id)       REFERENCES users(id)       ON DELETE CASCADE,
  CONSTRAINT fk_notif_tech FOREIGN KEY (technician_id) REFERENCES technicians(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 10. ADMINS (back-office)
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS admins;
CREATE TABLE admins (
  id             BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  full_name      VARCHAR(120) NOT NULL,
  email          VARCHAR(160) NOT NULL,
  password_hash  VARCHAR(255) NOT NULL,
  role           ENUM('super_admin','support','finance') NOT NULL DEFAULT 'support',
  is_active      TINYINT(1) NOT NULL DEFAULT 1,
  created_at     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_admin_email (email)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 11. AUTH TOKENS (JWT refresh-token rotation, one table for every actor)
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS auth_tokens;
CREATE TABLE auth_tokens (
  id                  BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  actor_type          ENUM('user','technician','admin') NOT NULL,
  actor_id            BIGINT UNSIGNED NOT NULL,
  refresh_token_hash  VARCHAR(255) NOT NULL,   -- store a SHA-256 hash, never the raw token
  user_agent          VARCHAR(255) NULL,
  ip_address          VARCHAR(45)  NULL,
  expires_at          DATETIME NOT NULL,
  revoked_at          DATETIME NULL,
  created_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_auth_actor (actor_type, actor_id)
) ENGINE=InnoDB;

SET FOREIGN_KEY_CHECKS = 1;

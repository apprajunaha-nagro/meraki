-- ============================================================
-- Meraki by Kritika — MySQL Database Schema
-- Version: 1.0 | Created: 2025-01-19
-- Charset: utf8mb4_unicode_ci
-- ============================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ─── Users ────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS `users` (
  `id`                    INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  `name`                  VARCHAR(255)    NOT NULL,
  `email`                 VARCHAR(255)    NOT NULL UNIQUE,
  `phone`                 VARCHAR(20)     DEFAULT NULL,
  `password_hash`         VARCHAR(255)    NOT NULL,
  `role`                  ENUM('customer','admin','staff') NOT NULL DEFAULT 'customer',
  `newsletter_subscribed` TINYINT(1)      NOT NULL DEFAULT 0,
  `google_id`             VARCHAR(255)    DEFAULT NULL,
  `created_at`            TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`            TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_email` (`email`),
  INDEX `idx_role`  (`role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── Addresses ────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS `addresses` (
  `id`         INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  `user_id`    INT UNSIGNED  NOT NULL,
  `label`      VARCHAR(50)   NOT NULL DEFAULT 'Home',
  `name`       VARCHAR(255)  NOT NULL,
  `line1`      VARCHAR(255)  NOT NULL,
  `line2`      VARCHAR(255)  DEFAULT NULL,
  `city`       VARCHAR(100)  NOT NULL,
  `state`      VARCHAR(100)  NOT NULL,
  `pincode`    CHAR(6)       NOT NULL,
  `phone`      VARCHAR(20)   NOT NULL,
  `is_default` TINYINT(1)    NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_address_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  INDEX `idx_address_user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── Categories ───────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS `categories` (
  `id`          INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  `name`        VARCHAR(255)  NOT NULL,
  `slug`        VARCHAR(255)  NOT NULL UNIQUE,
  `parent_id`   INT UNSIGNED  DEFAULT NULL,
  `image`       VARCHAR(500)  DEFAULT NULL,
  `description` TEXT          DEFAULT NULL,
  `sort_order`  INT           NOT NULL DEFAULT 0,
  `is_active`   TINYINT(1)    NOT NULL DEFAULT 1,
  `created_at`  TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_slug`      (`slug`),
  INDEX `idx_parent`    (`parent_id`),
  CONSTRAINT `fk_category_parent` FOREIGN KEY (`parent_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── Products ─────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS `products` (
  `id`               INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  `name`             VARCHAR(500)    NOT NULL,
  `slug`             VARCHAR(500)    NOT NULL UNIQUE,
  `description`      TEXT            DEFAULT NULL,
  `fabric`           VARCHAR(255)    DEFAULT NULL,
  `care_instructions` TEXT           DEFAULT NULL,
  `category_id`      INT UNSIGNED    NOT NULL,
  `base_price`       DECIMAL(10,2)   NOT NULL,
  `mrp`              DECIMAL(10,2)   NOT NULL,
  `sku`              VARCHAR(100)    NOT NULL UNIQUE,
  `status`           ENUM('active','draft','archived') NOT NULL DEFAULT 'draft',
  `is_featured`      TINYINT(1)      NOT NULL DEFAULT 0,
  `is_bestseller`    TINYINT(1)      NOT NULL DEFAULT 0,
  `is_new_arrival`   TINYINT(1)      NOT NULL DEFAULT 0,
  `meta_title`       VARCHAR(500)    DEFAULT NULL,
  `meta_description` TEXT            DEFAULT NULL,
  `tags`             JSON            DEFAULT NULL,
  `created_at`       TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`       TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_slug`        (`slug`(191)),
  INDEX `idx_category`    (`category_id`),
  INDEX `idx_status`      (`status`),
  INDEX `idx_featured`    (`is_featured`),
  INDEX `idx_bestseller`  (`is_bestseller`),
  INDEX `idx_new_arrival` (`is_new_arrival`),
  CONSTRAINT `fk_product_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── Product Variants ─────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS `product_variants` (
  `id`             INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  `product_id`     INT UNSIGNED    NOT NULL,
  `size`           VARCHAR(50)     NOT NULL,
  `color`          VARCHAR(100)    DEFAULT NULL,
  `color_hex`      CHAR(7)         DEFAULT NULL,
  `sku`            VARCHAR(150)    NOT NULL UNIQUE,
  `stock_qty`      INT             NOT NULL DEFAULT 0,
  `price_override` DECIMAL(10,2)   DEFAULT NULL,
  `created_at`     TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`     TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_variant_product` (`product_id`),
  INDEX `idx_variant_sku`     (`sku`),
  CONSTRAINT `fk_variant_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── Product Images ───────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS `product_images` (
  `id`         INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  `product_id` INT UNSIGNED  NOT NULL,
  `image_url`  VARCHAR(1000) NOT NULL,
  `sort_order` TINYINT       NOT NULL DEFAULT 0,
  `alt_text`   VARCHAR(500)  DEFAULT NULL,
  `created_at` TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_image_product` (`product_id`),
  CONSTRAINT `fk_image_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── Coupons ──────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS `coupons` (
  `id`                     INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  `code`                   VARCHAR(100)    NOT NULL UNIQUE,
  `type`                   ENUM('flat','percent') NOT NULL,
  `value`                  DECIMAL(10,2)   NOT NULL,
  `min_cart_value`         DECIMAL(10,2)   DEFAULT NULL,
  `usage_limit`            INT             DEFAULT NULL,
  `usage_count`            INT             NOT NULL DEFAULT 0,
  `per_user_limit`         INT             DEFAULT 1,
  `expiry_date`            DATE            DEFAULT NULL,
  `applicable_categories`  JSON            DEFAULT NULL,
  `applicable_products`    JSON            DEFAULT NULL,
  `active`                 TINYINT(1)      NOT NULL DEFAULT 1,
  `description`            VARCHAR(500)    DEFAULT NULL,
  `created_at`             TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_coupon_code` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── Orders ───────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS `orders` (
  `id`                  INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  `user_id`             INT UNSIGNED    DEFAULT NULL,
  `guest_email`         VARCHAR(255)    DEFAULT NULL,
  `order_number`        VARCHAR(30)     NOT NULL UNIQUE,
  `status`              ENUM('pending','confirmed','packed','shipped','delivered','cancelled','returned') NOT NULL DEFAULT 'pending',
  `payment_status`      ENUM('pending','paid','failed','refunded') NOT NULL DEFAULT 'pending',
  `payment_method`      ENUM('razorpay','cod','gift_card','upi','card') NOT NULL,
  `razorpay_payment_id` VARCHAR(255)    DEFAULT NULL,
  `razorpay_order_id`   VARCHAR(255)    DEFAULT NULL,
  `subtotal`            DECIMAL(10,2)   NOT NULL,
  `discount`            DECIMAL(10,2)   NOT NULL DEFAULT 0.00,
  `shipping_fee`        DECIMAL(10,2)   NOT NULL DEFAULT 0.00,
  `tax`                 DECIMAL(10,2)   NOT NULL DEFAULT 0.00,
  `total`               DECIMAL(10,2)   NOT NULL,
  `coupon_code`         VARCHAR(100)    DEFAULT NULL,
  `tracking_number`     VARCHAR(255)    DEFAULT NULL,
  `courier`             VARCHAR(100)    DEFAULT NULL,
  `shipping_name`       VARCHAR(255)    NOT NULL,
  `shipping_line1`      VARCHAR(500)    NOT NULL,
  `shipping_line2`      VARCHAR(500)    DEFAULT NULL,
  `shipping_city`       VARCHAR(100)    NOT NULL,
  `shipping_state`      VARCHAR(100)    NOT NULL,
  `shipping_pincode`    CHAR(6)         NOT NULL,
  `shipping_phone`      VARCHAR(20)     NOT NULL,
  `notes`               TEXT            DEFAULT NULL,
  `created_at`          TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`          TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_order_number`  (`order_number`),
  INDEX `idx_order_user`    (`user_id`),
  INDEX `idx_order_status`  (`status`),
  INDEX `idx_order_date`    (`created_at`),
  CONSTRAINT `fk_order_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── Order Items ──────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS `order_items` (
  `id`                 INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  `order_id`           INT UNSIGNED    NOT NULL,
  `product_id`         INT UNSIGNED    NOT NULL,
  `variant_id`         INT UNSIGNED    NOT NULL,
  `qty`                TINYINT         NOT NULL DEFAULT 1,
  `price_at_purchase`  DECIMAL(10,2)   NOT NULL,
  `product_name`       VARCHAR(500)    NOT NULL,
  `variant_size`       VARCHAR(50)     DEFAULT NULL,
  `variant_color`      VARCHAR(100)    DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `idx_order_item_order` (`order_id`),
  CONSTRAINT `fk_order_item_order`   FOREIGN KEY (`order_id`)   REFERENCES `orders` (`id`)           ON DELETE CASCADE,
  CONSTRAINT `fk_order_item_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  CONSTRAINT `fk_order_item_variant` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── Reviews ──────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS `reviews` (
  `id`         INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  `product_id` INT UNSIGNED  NOT NULL,
  `user_id`    INT UNSIGNED  DEFAULT NULL,
  `user_name`  VARCHAR(255)  DEFAULT NULL,
  `rating`     TINYINT       NOT NULL CHECK (`rating` BETWEEN 1 AND 5),
  `comment`    TEXT          NOT NULL,
  `image_url`  VARCHAR(1000) DEFAULT NULL,
  `status`     ENUM('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  `admin_reply` TEXT         DEFAULT NULL,
  `created_at` TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_review_product` (`product_id`),
  INDEX `idx_review_status`  (`status`),
  CONSTRAINT `fk_review_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_review_user`    FOREIGN KEY (`user_id`)    REFERENCES `users` (`id`)    ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── Wishlists ────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS `wishlists` (
  `id`         INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  `user_id`    INT UNSIGNED  NOT NULL,
  `product_id` INT UNSIGNED  NOT NULL,
  `variant_id` INT UNSIGNED  DEFAULT NULL,
  `created_at` TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_wishlist` (`user_id`, `product_id`),
  CONSTRAINT `fk_wishlist_user`    FOREIGN KEY (`user_id`)    REFERENCES `users` (`id`)    ON DELETE CASCADE,
  CONSTRAINT `fk_wishlist_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── Gift Cards ───────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS `gift_cards` (
  `id`              INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  `code`            VARCHAR(20)     NOT NULL UNIQUE,
  `initial_balance` DECIMAL(10,2)   NOT NULL,
  `current_balance` DECIMAL(10,2)   NOT NULL,
  `expiry_date`     DATE            DEFAULT NULL,
  `issued_to_email` VARCHAR(255)    DEFAULT NULL,
  `status`          ENUM('active','used','expired') NOT NULL DEFAULT 'active',
  `created_at`      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_gift_code` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── Newsletter Subscribers ───────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS `newsletter_subscribers` (
  `id`             INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  `email`          VARCHAR(255)  NOT NULL UNIQUE,
  `subscribed_at`  TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `unsubscribed_at` TIMESTAMP    DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `idx_newsletter_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── Contact Messages ─────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS `contact_messages` (
  `id`         INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  `name`       VARCHAR(255)  NOT NULL,
  `email`      VARCHAR(255)  NOT NULL,
  `phone`      VARCHAR(20)   DEFAULT NULL,
  `message`    TEXT          NOT NULL,
  `status`     ENUM('new','read','replied') NOT NULL DEFAULT 'new',
  `created_at` TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── Settings ─────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS `settings` (
  `key`        VARCHAR(100) NOT NULL,
  `value`      TEXT         DEFAULT NULL,
  `updated_at` TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── Activity Log ─────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS `activity_log` (
  `id`          INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  `user_id`     INT UNSIGNED  DEFAULT NULL,
  `action`      VARCHAR(255)  NOT NULL,
  `subject`     VARCHAR(255)  DEFAULT NULL,
  `subject_id`  INT UNSIGNED  DEFAULT NULL,
  `description` TEXT          DEFAULT NULL,
  `ip_address`  VARCHAR(45)   DEFAULT NULL,
  `created_at`  TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_log_user`    (`user_id`),
  INDEX `idx_log_action`  (`action`),
  INDEX `idx_log_date`    (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── Return Requests ──────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS `return_requests` (
  `id`            INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  `order_id`      INT UNSIGNED  NOT NULL,
  `order_item_id` INT UNSIGNED  NOT NULL,
  `reason`        TEXT          NOT NULL,
  `status`        ENUM('pending','approved','rejected','refund_processed') NOT NULL DEFAULT 'pending',
  `admin_notes`   TEXT          DEFAULT NULL,
  `created_at`    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_return_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_return_item`  FOREIGN KEY (`order_item_id`) REFERENCES `order_items` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── Curated Edits (Shop by Edit) ────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS `curated_edits` (
  `id`         INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  `slug`       VARCHAR(255)  NOT NULL UNIQUE,
  `title`      VARCHAR(255)  NOT NULL,
  `subtitle`   VARCHAR(500)  DEFAULT NULL,
  `image`      VARCHAR(1000) DEFAULT NULL,
  `sort_order` INT           NOT NULL DEFAULT 0,
  `is_active`  TINYINT(1)    NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `curated_edit_products` (
  `edit_id`    INT UNSIGNED NOT NULL,
  `product_id` INT UNSIGNED NOT NULL,
  `sort_order` INT          NOT NULL DEFAULT 0,
  PRIMARY KEY (`edit_id`, `product_id`),
  CONSTRAINT `fk_edit_edit`    FOREIGN KEY (`edit_id`)    REFERENCES `curated_edits` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_edit_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)      ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- SEED DATA
-- ============================================================

-- Settings
INSERT IGNORE INTO `settings` (`key`, `value`) VALUES
  ('store_name',          'Meraki by Kritika'),
  ('store_tagline',       'Made with Soul, Worn with Ease'),
  ('store_address',       'Dhanbad, Jharkhand - 826001, India'),
  ('store_email',         'hello@merakibykritika.in'),
  ('store_phone',         '+919900000000'),
  ('store_whatsapp',      '+919900000000'),
  ('gstin',               '20AAXXXX0000X1Z5'),
  ('gst_rate',            '5'),
  ('free_shipping_above', '1499'),
  ('standard_shipping_fee', '99'),
  ('express_shipping_fee',  '199'),
  ('cod_order_limit',     '10000'),
  ('currency',            'INR'),
  ('instagram_url',       'https://instagram.com/merakibykritika'),
  ('facebook_url',        'https://facebook.com/merakibykritika');

-- Categories
INSERT IGNORE INTO `categories` (`id`, `name`, `slug`, `sort_order`) VALUES
  (1, 'Kurta Sets',    'kurta-sets',    1),
  (2, 'Co-ords',       'co-ords',       2),
  (3, 'Sarees',        'sarees',        3),
  (4, 'Lehengas',      'lehengas',      4),
  (5, 'Dresses',       'dresses',       5),
  (6, 'Gowns',         'gowns',         6),
  (7, 'Tops & Jackets','tops-jackets',  7),
  (8, 'Bottoms',       'bottoms',       8),
  (9, 'Fusion Wear',   'fusion-wear',   9);

-- Default coupons
INSERT IGNORE INTO `coupons` (`code`, `type`, `value`, `min_cart_value`, `per_user_limit`, `description`, `active`) VALUES
  ('WELCOME10', 'percent', 10, 2000, 1, '10% off on first order (min cart ₹2,000)', 1),
  ('FESTIVE500', 'flat', 500, 5000, NULL, '₹500 off on orders above ₹5,000', 1),
  ('FREESHIP', 'flat', 150, 1500, NULL, 'Free shipping on orders above ₹1,500', 1);

-- Seed Admin User
INSERT IGNORE INTO `users` (`name`, `email`, `password_hash`, `role`) VALUES
  ('Meraki Admin', 'merakidhanbad2026', '$2b$10$L4pts68Le.3rNJ421XN6Bu.yenzcvK1c2tWjW/vB2GdXnoctBNxha', 'admin');

SET FOREIGN_KEY_CHECKS = 1;

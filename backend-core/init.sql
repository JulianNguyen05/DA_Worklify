-- =========================================
-- CREATE DATABASE
-- =========================================
CREATE DATABASE IF NOT EXISTS smartmatch_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

-- =========================================
-- CREATE APPLICATION USER
-- =========================================
CREATE USER IF NOT EXISTS 'smartmatch'@'%'
IDENTIFIED BY 'smartmatch_password';

GRANT ALL PRIVILEGES ON smartmatch_db.* TO 'smartmatch'@'%';

FLUSH PRIVILEGES;

-- =========================================
-- USE DATABASE
-- =========================================
USE smartmatch_db;

-- =========================================
-- USERS TABLE
-- =========================================
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(191) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
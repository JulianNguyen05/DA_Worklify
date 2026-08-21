-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: mysql:3306
-- Generation Time: Aug 20, 2026 at 03:17 AM
-- Server version: 8.4.8
-- PHP Version: 8.3.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `worklify_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `applications`
--

CREATE TABLE `applications` (
  `id` bigint NOT NULL,
  `candidate_id` bigint NOT NULL,
  `job_id` bigint NOT NULL,
  `cv_id` bigint DEFAULT NULL,
  `cover_letter` text COLLATE utf8mb4_unicode_ci,
  `status` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT 'PENDING' COMMENT 'PENDING, REVIEWED, INTERVIEW_SCHEDULED, ACCEPTED, REJECTED',
  `applied_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `blind_test_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `applications`
--

INSERT INTO `applications` (`id`, `candidate_id`, `job_id`, `cv_id`, `cover_letter`, `status`, `applied_at`, `blind_test_url`) VALUES
(15, 1, 1, NULL, 'string', 'PENDING', '2026-07-29 07:35:23', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `candidate_activities`
--

CREATE TABLE `candidate_activities` (
  `id` bigint NOT NULL,
  `candidate_id` bigint NOT NULL,
  `organization` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `is_current` tinyint(1) DEFAULT '0',
  `description` text COLLATE utf8mb4_unicode_ci,
  `display_order` int DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `candidate_activities`
--

INSERT INTO `candidate_activities` (`id`, `candidate_id`, `organization`, `role`, `start_date`, `end_date`, `is_current`, `description`, `display_order`) VALUES
(3, 1, 'Cộng đồng IT Vietnam', 'Speaker', '2021-06-01', NULL, 0, 'Tham gia làm diễn giả chia sẻ về kinh nghiệm tối ưu hoá hệ thống chịu tải cao.', 0);

-- --------------------------------------------------------

--
-- Table structure for table `candidate_awards`
--

CREATE TABLE `candidate_awards` (
  `id` bigint NOT NULL,
  `candidate_id` bigint NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `issuer` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `awarded_date` date DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `display_order` int DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `candidate_awards`
--

INSERT INTO `candidate_awards` (`id`, `candidate_id`, `title`, `issuer`, `awarded_date`, `description`, `display_order`) VALUES
(3, 1, 'Nhân viên xuất sắc năm 2023', 'Global E-commerce', '2023-12-25', 'Vinh danh cá nhân có đóng góp kỹ thuật quan trọng nhất trong năm.', 0);

-- --------------------------------------------------------

--
-- Table structure for table `candidate_certifications`
--

CREATE TABLE `candidate_certifications` (
  `id` bigint NOT NULL,
  `candidate_id` bigint NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `issuing_org` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `issue_date` date DEFAULT NULL,
  `expiry_date` date DEFAULT NULL,
  `credential_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `credential_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `display_order` int DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `candidate_certifications`
--

INSERT INTO `candidate_certifications` (`id`, `candidate_id`, `name`, `issuing_org`, `issue_date`, `expiry_date`, `credential_id`, `credential_url`, `display_order`) VALUES
(2, 1, 'AWS Certified Solutions Architect', 'Amazon Web Services', '2023-05-10', '2026-05-10', 'AWS-12345-XYZ', 'https://aws.amazon.com/verification', 1);

-- --------------------------------------------------------

--
-- Table structure for table `candidate_educations`
--

CREATE TABLE `candidate_educations` (
  `id` bigint NOT NULL,
  `candidate_id` bigint NOT NULL,
  `school_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `major` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `degree` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Trung cấp, Cao đẳng, Đại học, Thạc sĩ, Tiến sĩ,... (dropdown cố định)',
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `is_current` tinyint(1) DEFAULT '0',
  `gpa` decimal(3,2) DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `display_order` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `candidate_educations`
--

INSERT INTO `candidate_educations` (`id`, `candidate_id`, `school_name`, `major`, `degree`, `start_date`, `end_date`, `is_current`, `gpa`, `description`, `display_order`, `created_at`, `updated_at`) VALUES
(2, 1, 'Đại học Khoa học Tự nhiên TP.HCM', 'Công nghệ thông tin', 'Đại học', '2014-09-01', '2018-07-30', 0, 3.40, 'Tốt nghiệp loại Khá. Từng đạt giải Nhì cuộc thi Hackathon trường.', 0, '2026-07-20 01:39:10', '2026-07-30 02:55:54');

-- --------------------------------------------------------

--
-- Table structure for table `candidate_experiences`
--

CREATE TABLE `candidate_experiences` (
  `id` bigint NOT NULL,
  `candidate_id` bigint NOT NULL,
  `company_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `position` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `employment_type` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'FULL_TIME, PART_TIME, INTERNSHIP, FREELANCE (dropdown cố định)',
  `location` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `is_current` tinyint(1) DEFAULT '0',
  `description` text COLLATE utf8mb4_unicode_ci,
  `display_order` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `candidate_experiences`
--

INSERT INTO `candidate_experiences` (`id`, `candidate_id`, `company_name`, `position`, `employment_type`, `location`, `start_date`, `end_date`, `is_current`, `description`, `display_order`, `created_at`, `updated_at`) VALUES
(2, 1, 'Tech Asia Solutions', 'Backend Developer', 'FULL_TIME', 'TP. Hồ Chí Minh', '2018-08-01', '2022-01-31', 0, 'Phát triển RESTful API cho ứng dụng di động. Tối ưu hoá truy vấn MySQL giúp giảm 30% thời gian load.', 0, '2026-07-20 01:39:10', '2026-07-20 02:22:31'),
(3, 1, 'Global E-commerce', 'Senior Fullstack Developer', 'FULL_TIME', 'TP. Hồ Chí Minh', '2022-02-01', NULL, 1, 'Leader nhóm 4 thành viên. Xây dựng kiến trúc microservices và áp dụng CI/CD cho dự án ERP.', 1, '2026-07-20 01:39:10', '2026-07-20 01:39:10');

-- --------------------------------------------------------

--
-- Table structure for table `candidate_hobbies`
--

CREATE TABLE `candidate_hobbies` (
  `id` bigint NOT NULL,
  `candidate_id` bigint NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `display_order` int DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `candidate_hobbies`
--

INSERT INTO `candidate_hobbies` (`id`, `candidate_id`, `name`, `display_order`) VALUES
(3, 1, 'Đọc sách công nghệ', 1),
(4, 1, 'Chơi Bida', 0);

-- --------------------------------------------------------

--
-- Table structure for table `candidate_languages`
--

CREATE TABLE `candidate_languages` (
  `id` bigint NOT NULL,
  `candidate_id` bigint NOT NULL,
  `language_id` bigint NOT NULL,
  `proficiency` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Cơ bản, Trung cấp, Thành thạo, Bản ngữ (dropdown cố định)',
  `display_order` int DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `candidate_languages`
--

INSERT INTO `candidate_languages` (`id`, `candidate_id`, `language_id`, `proficiency`, `display_order`) VALUES
(2, 1, 1, 'Thành thạo', 1);

-- --------------------------------------------------------

--
-- Table structure for table `candidate_profiles`
--

CREATE TABLE `candidate_profiles` (
  `id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  `full_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `avatar_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Ảnh đại diện',
  `headline` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Chức danh / vị trí mong muốn',
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email_contact` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Email liên hệ, có thể khác email đăng nhập',
  `gender` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `dob` date DEFAULT NULL,
  `address` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `website_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Website / portfolio cá nhân',
  `linkedin_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `github_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `summary` text COLLATE utf8mb4_unicode_ci
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `candidate_profiles`
--

INSERT INTO `candidate_profiles` (`id`, `user_id`, `full_name`, `avatar_url`, `headline`, `phone`, `email_contact`, `gender`, `dob`, `address`, `website_url`, `linkedin_url`, `github_url`, `summary`) VALUES
(1, 1, 'Nguyễn HữuTrọng', '/uploads/avatars/1_2854679.jpg', 'Senior Fullstack Developer', '0901234567', 'trong.nguyen@email.com', 'Nam', '1996-05-20', 'Quận 1, TP. Hồ Chí Minh', '', '', 'https://github.com/JulianNguyen05', 'Lập trình viên Fullstack với hơn 5 năm kinh nghiệm phát triển các ứng dụng web. Có kinh nghiệm với Laravel, VueJS và thiết kế hệ thống tối ưu hiệu suất cao.'),
(2, 2, 'admin', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `candidate_profile_layouts`
--

CREATE TABLE `candidate_profile_layouts` (
  `id` bigint NOT NULL,
  `candidate_id` bigint NOT NULL,
  `block_type` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'PERSONAL_INFO, AVATAR, SOCIAL_LINKS, ACTIVITY, AWARD, SKILL, CERTIFICATION, EDUCATION, EXPERIENCE, HOBBY, LANGUAGE, PROJECT',
  `position` int NOT NULL DEFAULT '0',
  `visible` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `candidate_profile_layouts`
--

INSERT INTO `candidate_profile_layouts` (`id`, `candidate_id`, `block_type`, `position`, `visible`, `created_at`, `updated_at`) VALUES
(1, 1, 'PERSONAL_INFO', 2, 1, '2026-07-13 07:02:57', '2026-08-18 07:13:15'),
(2, 1, 'AVATAR', 0, 1, '2026-07-13 07:02:57', '2026-08-18 07:13:15'),
(3, 1, 'SOCIAL_LINKS', 3, 1, '2026-07-13 07:02:57', '2026-08-18 07:13:15'),
(4, 1, 'EXPERIENCE', 4, 1, '2026-07-13 07:02:57', '2026-08-18 07:13:15'),
(5, 1, 'EDUCATION', 1, 1, '2026-07-13 07:02:57', '2026-08-18 07:13:15'),
(6, 1, 'SKILL', 5, 1, '2026-07-13 07:02:57', '2026-08-18 07:13:15'),
(7, 1, 'PROJECT', 6, 1, '2026-07-13 07:02:57', '2026-08-18 07:13:15'),
(8, 1, 'CERTIFICATION', 9, 1, '2026-07-13 07:02:57', '2026-08-18 07:13:15'),
(9, 1, 'AWARD', 7, 1, '2026-07-13 07:02:57', '2026-08-18 07:13:15'),
(10, 1, 'ACTIVITY', 11, 1, '2026-07-13 07:02:57', '2026-08-18 07:13:15'),
(11, 1, 'LANGUAGE', 8, 1, '2026-07-13 07:02:57', '2026-08-18 07:13:15'),
(12, 1, 'HOBBY', 10, 1, '2026-07-13 07:02:57', '2026-08-18 07:13:15'),
(13, 2, 'PERSONAL_INFO', 0, 1, '2026-08-20 03:09:50', '2026-08-20 03:09:50'),
(14, 2, 'AVATAR', 1, 1, '2026-08-20 03:09:50', '2026-08-20 03:09:50'),
(15, 2, 'SOCIAL_LINKS', 2, 1, '2026-08-20 03:09:50', '2026-08-20 03:09:50'),
(16, 2, 'EXPERIENCE', 3, 1, '2026-08-20 03:09:50', '2026-08-20 03:09:50'),
(17, 2, 'EDUCATION', 4, 1, '2026-08-20 03:09:50', '2026-08-20 03:09:50'),
(18, 2, 'SKILL', 5, 1, '2026-08-20 03:09:50', '2026-08-20 03:09:50'),
(19, 2, 'PROJECT', 6, 1, '2026-08-20 03:09:50', '2026-08-20 03:09:50'),
(20, 2, 'CERTIFICATION', 7, 1, '2026-08-20 03:09:50', '2026-08-20 03:09:50'),
(21, 2, 'AWARD', 8, 1, '2026-08-20 03:09:50', '2026-08-20 03:09:50'),
(22, 2, 'ACTIVITY', 9, 1, '2026-08-20 03:09:50', '2026-08-20 03:09:50'),
(23, 2, 'LANGUAGE', 10, 1, '2026-08-20 03:09:50', '2026-08-20 03:09:50'),
(24, 2, 'HOBBY', 11, 1, '2026-08-20 03:09:50', '2026-08-20 03:09:50');

-- --------------------------------------------------------

--
-- Table structure for table `candidate_projects`
--

CREATE TABLE `candidate_projects` (
  `id` bigint NOT NULL,
  `candidate_id` bigint NOT NULL,
  `project_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tech_stack` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Danh sách công nghệ, phân tách bởi dấu phẩy',
  `project_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `is_current` tinyint(1) DEFAULT '0',
  `description` text COLLATE utf8mb4_unicode_ci,
  `display_order` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `candidate_projects`
--

INSERT INTO `candidate_projects` (`id`, `candidate_id`, `project_name`, `role`, `tech_stack`, `project_url`, `start_date`, `end_date`, `is_current`, `description`, `display_order`, `created_at`, `updated_at`) VALUES
(2, 1, 'Hệ thống Quản lý Bán hàng nội bộ', 'Tech Lead', 'Laravel, VueJS, Redis, Docker', 'https://github.com/trongnguyen/erp-system', '2023-01-15', '2023-11-20', 0, 'Hệ thống hỗ trợ quản lý kho, nhân sự và chuỗi cung ứng cho 15.000 user.', 1, '2026-07-20 01:39:10', '2026-07-20 01:39:10');

-- --------------------------------------------------------

--
-- Table structure for table `candidate_skills`
--

CREATE TABLE `candidate_skills` (
  `candidate_id` bigint NOT NULL,
  `skill_id` bigint NOT NULL,
  `level` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `years_of_ex` int DEFAULT '0',
  `note` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `display_order` int DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `candidate_skills`
--

INSERT INTO `candidate_skills` (`candidate_id`, `skill_id`, `level`, `years_of_ex`, `note`, `display_order`) VALUES
(1, 2, 'Thành thạo', 5, 'Dùng hàng ngày làm core backend', 1),
(1, 3, 'Khá', 3, 'Thành thạo Vue 3 & Nuxt', 2),
(1, 4, 'Thành thạo', 4, 'Biết cách thiết kế schema và đánh index', 3);

-- --------------------------------------------------------

--
-- Table structure for table `company_likes`
--

CREATE TABLE `company_likes` (
  `id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  `company_id` bigint NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `company_profiles`
--

CREATE TABLE `company_profiles` (
  `id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  `company_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `logo_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `website` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `verification_status` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT 'PENDING' COMMENT 'PENDING, APPROVED, REJECTED'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `company_profiles`
--

INSERT INTO `company_profiles` (`id`, `user_id`, `company_name`, `logo_url`, `website`, `description`, `verification_status`) VALUES
(1, 3, 'Công ty Cổ phần Công nghệ Worklify', 'https://example.com/logo.png', 'https://worklify.vn', 'Công ty chuyên cung cấp nền tảng tuyển dụng thông minh.', 'APPROVED'),
(2, 4, 'TechNova Solutions', 'https://example.com/technova_logo.png', 'https://technova.vn', 'TechNova là công ty công nghệ tiên phong trong lĩnh vực AI và phát triển phần mềm doanh nghiệp tại Việt Nam.', 'APPROVED'),
(3, 5, 'Công ty A', '/uploads/companies/logos/logo_owner_5_2854679.jpg', '', 'Đây là giới thiệu của công ty A', 'APPROVED');

-- --------------------------------------------------------

--
-- Table structure for table `cv_documents`
--

CREATE TABLE `cv_documents` (
  `id` bigint NOT NULL,
  `candidate_id` bigint NOT NULL,
  `file_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `file_path` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cv_data` json DEFAULT NULL COMMENT 'Lưu toàn bộ state của CV Builder (layout, content, settings)',
  `is_generated` tinyint(1) DEFAULT '0',
  `thumbnail_path` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `digital_pdf_path` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `cv_documents`
--

INSERT INTO `cv_documents` (`id`, `candidate_id`, `file_name`, `file_path`, `cv_data`, `is_generated`, `thumbnail_path`, `digital_pdf_path`, `created_at`) VALUES
(10, 1, 'test', NULL, '{\"data\": {\"avatar\": {\"url\": \"http://localhost:8080/uploads/logos/user.jpg\"}, \"awards\": [], \"skills\": [{\"name\": \"[rr] [Geasca\", \"description\": \"\"}, {\"name\": \"[aoe\", \"description\": \"\"}, {\"name\": \"[ess ] [vee\", \"description\": \"\"}], \"hobbies\": [], \"projects\": [], \"education\": [{\"gpa\": \"\", \"major\": \"\", \"school\": \"\", \"duration\": \"\", \"description\": \"os/2014- Ho Chi Minh City University of Science\\no7j2018 Information Technology\"}, {\"gpa\": \"\", \"major\": \"\", \"school\": \"\", \"duration\": \"\", \"description\": \"GPA 3.4\"}, {\"gpa\": \"\", \"major\": \"\", \"school\": \"\", \"duration\": \"\", \"description\": \"Graduated with Good classification. Won Second Prize in the university Hackathon.\"}], \"objective\": \"Fullstack Developer with over 5 years of experience in web application development. Experienced with Laravel, VueUS, and\\ndesigning highly optimized systems\", \"activities\": [], \"experience\": [{\"role\": \"Developer\", \"company\": \"\", \"duration\": \"\", \"description\": \"Developer\"}, {\"role\": \"Develo\", \"company\": \"\", \"duration\": \"\", \"description\": \"Develo\"}, {\"role\": \"Global\", \"company\": \"\", \"duration\": \"\", \"description\": \"Global\"}, {\"role\": \"Full\", \"company\": \"\", \"duration\": \"\", \"description\": \"Full\"}, {\"role\": \"Develo\", \"company\": \"\", \"duration\": \"\", \"description\": \"Develo\"}], \"references\": [], \"contactInfo\": [{\"label\": \"Ngày sinh\", \"value\": \"\"}, {\"label\": \"Giới tính\", \"value\": \"\"}, {\"label\": \"Số điện thoại\", \"value\": \"0901234567\"}, {\"label\": \"Email\", \"value\": \"trong.nguyen@email.com\"}, {\"label\": \"Website\", \"value\": \"https://github.com/JulianNguyen05\"}, {\"label\": \"Địa chỉ\", \"value\": \"\"}], \"personalInfo\": {\"fullName\": \"aaaa\", \"jobTitle\": \"\"}, \"sectionTitles\": {}, \"certifications\": []}, \"layout\": {\"activeRows\": [{\"id\": \"row-1\", \"ratio\": \"30-70\", \"leftItems\": [\"avatar\"], \"rightItems\": [\"personalInfo\", \"contactInfo\"]}, {\"id\": \"row-2\", \"ratio\": \"10-0\", \"leftItems\": [\"objective\", \"education\", \"experience\", \"activities\", \"certifications\", \"awards\", \"skills\", \"references\", \"hobbies\", \"projects\"], \"rightItems\": []}], \"unusedItems\": [\"customSection\"]}, \"settings\": {\"font\": \"Roboto\", \"fontSize\": \"medium\", \"template\": \"simple\", \"avatarSize\": 120, \"accentColor\": \"#06B6D4\", \"avatarShape\": \"square\", \"primaryColor\": \"#2563EB\"}}', 1, '/uploads/cv_thumbnails/1/10.jpg', NULL, '2026-08-12 01:39:41'),
(11, 1, 'CV chưa có tên', NULL, '{\"data\": {\"avatar\": {\"url\": \"/uploads/avatars/1_2854679.jpg\"}, \"awards\": [{\"date\": \"12/2023\", \"title\": \"Nhân viên xuất sắc năm 2023\", \"issuer\": \"Global E-commerce\"}], \"skills\": [{\"name\": \"PHP / Laravel\", \"description\": \"Thành thạo — Dùng hàng ngày làm core backend\"}, {\"name\": \"JavaScript / VueJS\", \"description\": \"Khá — Thành thạo Vue 3 & Nuxt\"}, {\"name\": \"MySQL / Tối ưu hoá DB\", \"description\": \"Thành thạo — Biết cách thiết kế schema và đánh index\"}], \"hobbies\": [{\"name\": \"Đọc sách công nghệ\"}, {\"name\": \"Chơi Bida\"}], \"projects\": [{\"name\": \"Hệ thống Quản lý Bán hàng nội bộ\", \"role\": \"Tech Lead\", \"duration\": \"01/2023 - 11/2023\", \"description\": \"Hệ thống hỗ trợ quản lý kho, nhân sự và chuỗi cung ứng cho 15.000 user.\\nCông nghệ: Laravel, VueJS, Redis, Docker\"}], \"education\": [{\"gpa\": \"3.4\", \"major\": \"Công nghệ thông tin\", \"school\": \"Đại học Khoa học Tự nhiên TP.HCM\", \"duration\": \"09/2014 - 07/2018\", \"description\": \"Tốt nghiệp loại Khá. Từng đạt giải Nhì cuộc thi Hackathon trường.\"}], \"objective\": \"Lập trình viên Fullstack với hơn 5 năm kinh nghiệm phát triển các ứng dụng web. Có kinh nghiệm với Laravel, VueJS và thiết kế hệ thống tối ưu hiệu suất cao.\", \"activities\": [{\"role\": \"Speaker\", \"duration\": \"06/2021\", \"description\": \"Tham gia làm diễn giả chia sẻ về kinh nghiệm tối ưu hoá hệ thống chịu tải cao.\", \"organization\": \"Cộng đồng IT Vietnam\"}], \"experience\": [{\"role\": \"Backend Developer\", \"company\": \"Tech Asia Solutions\", \"duration\": \"08/2018 - 01/2022\", \"description\": \"Phát triển RESTful API cho ứng dụng di động. Tối ưu hoá truy vấn MySQL giúp giảm 30% thời gian load.\"}, {\"role\": \"Senior Fullstack Developer\", \"company\": \"Global E-commerce\", \"duration\": \"02/2022\", \"description\": \"Leader nhóm 4 thành viên. Xây dựng kiến trúc microservices và áp dụng CI/CD cho dự án ERP.\"}], \"references\": [], \"contactInfo\": [{\"label\": \"Ngày sinh\", \"value\": \"20/05/1996\"}, {\"label\": \"Giới tính\", \"value\": \"Nam\"}, {\"label\": \"Số điện thoại\", \"value\": \"0901234567\"}, {\"label\": \"Email\", \"value\": \"trong.nguyen@email.com\"}, {\"label\": \"Website\", \"value\": \"\"}, {\"label\": \"Địa chỉ\", \"value\": \"Quận 1, TP. Hồ Chí Minh\"}, {\"label\": \"GitHub\", \"value\": \"https://github.com/JulianNguyen05\"}], \"personalInfo\": {\"fullName\": \"Nguyễn Hữu Trọng\", \"jobTitle\": \"Senior Fullstack Developer\"}, \"sectionTitles\": {\"objective\": \"MỤC TIÊU NGHỀ NGHIỆP\", \"experience\": \"KINH NGHIỆM LÀM VIỆC\"}, \"certifications\": [{\"date\": \"05/2023\", \"name\": \"AWS Certified Solutions Architect\", \"issuer\": \"Amazon Web Services\"}]}, \"layout\": {\"activeRows\": [{\"id\": \"row-1\", \"ratio\": \"30-70\", \"leftItems\": [\"avatar\"], \"rightItems\": [\"personalInfo\", \"contactInfo\"]}, {\"id\": \"row-2\", \"ratio\": \"10-0\", \"leftItems\": [\"objective\", \"education\", \"experience\", \"activities\", \"certifications\", \"awards\", \"skills\", \"references\", \"hobbies\", \"projects\"], \"rightItems\": []}], \"unusedItems\": [\"customSection\"]}, \"settings\": {\"font\": \"Times New Roman\", \"fontSize\": \"medium\", \"template\": \"simple\", \"avatarSize\": 120, \"accentColor\": \"#06B6D4\", \"avatarShape\": \"square\", \"primaryColor\": \"#2563EB\"}}', 1, '/uploads/cv_thumbnails/1/11.jpg', '/uploads/cv_digital_pdf/1/cv_11.pdf', '2026-08-17 03:59:21'),
(12, 1, 'CV chưa có tên', NULL, '{\"data\": {\"avatar\": {\"url\": \"/uploads/avatars/1_2854679.jpg\"}, \"awards\": [{\"date\": \"12/2023\", \"title\": \"Nhân viên xuất sắc năm 2023\", \"issuer\": \"Global E-commerce\"}], \"skills\": [{\"name\": \"PHP / Laravel\", \"description\": \"Thành thạo — Dùng hàng ngày làm core backend\"}, {\"name\": \"JavaScript / VueJS\", \"description\": \"Khá — Thành thạo Vue 3 & Nuxt\"}, {\"name\": \"MySQL / Tối ưu hoá DB\", \"description\": \"Thành thạo — Biết cách thiết kế schema và đánh index\"}], \"hobbies\": [{\"name\": \"Đọc sách công nghệ\"}, {\"name\": \"Chơi Bida\"}], \"projects\": [{\"name\": \"Hệ thống Quản lý Bán hàng nội bộ\", \"role\": \"Tech Lead\", \"duration\": \"01/2023 - 11/2023\", \"description\": \"Hệ thống hỗ trợ quản lý kho, nhân sự và chuỗi cung ứng cho 15.000 user.\\nCông nghệ: Laravel, VueJS, Redis, Docker\"}], \"education\": [{\"gpa\": \"3.4\", \"major\": \"Công nghệ thông tin\", \"school\": \"Đại học Khoa học Tự nhiên TP.HCM\", \"duration\": \"09/2014 - 07/2018\", \"description\": \"Tốt nghiệp loại Khá. Từng đạt giải Nhì cuộc thi Hackathon trường.\"}], \"objective\": \"Lập trình viên Fullstack với hơn 5 năm kinh nghiệm phát triển các ứng dụng web. Có kinh nghiệm với Laravel, VueJS và thiết kế hệ thống tối ưu hiệu suất cao.\", \"activities\": [{\"role\": \"Speaker\", \"duration\": \"06/2021\", \"description\": \"Tham gia làm diễn giả chia sẻ về kinh nghiệm tối ưu hoá hệ thống chịu tải cao.\", \"organization\": \"Cộng đồng IT Vietnam\"}], \"experience\": [{\"role\": \"Backend Developer\", \"company\": \"Tech Asia Solutions\", \"duration\": \"08/2018 - 01/2022\", \"description\": \"Phát triển RESTful API cho ứng dụng di động. Tối ưu hoá truy vấn MySQL giúp giảm 30% thời gian load.\"}, {\"role\": \"Senior Fullstack Developer\", \"company\": \"Global E-commerce\", \"duration\": \"02/2022\", \"description\": \"Leader nhóm 4 thành viên. Xây dựng kiến trúc microservices và áp dụng CI/CD cho dự án ERP.\"}], \"references\": [], \"contactInfo\": [{\"label\": \"Ngày sinh\", \"value\": \"20/05/1996\"}, {\"label\": \"Giới tính\", \"value\": \"Nam\"}, {\"label\": \"Số điện thoại\", \"value\": \"0901234567\"}, {\"label\": \"Email\", \"value\": \"trong.nguyen@email.com\"}, {\"label\": \"Website\", \"value\": \"\"}, {\"label\": \"Địa chỉ\", \"value\": \"Quận 1, TP. Hồ Chí Minh\"}, {\"label\": \"GitHub\", \"value\": \"https://github.com/JulianNguyen05\"}], \"personalInfo\": {\"fullName\": \"Nguyễn Hữu Trọng\", \"jobTitle\": \"Senior Fullstack Developer\"}, \"sectionTitles\": {\"objective\": \"MỤC TIÊU NGHỀ NGHIỆP\", \"experience\": \"KINH NGHIỆM LÀM VIỆC\"}, \"certifications\": [{\"date\": \"05/2023\", \"name\": \"AWS Certified Solutions Architect\", \"issuer\": \"Amazon Web Services\"}]}, \"layout\": {\"activeRows\": [{\"id\": \"row-1\", \"ratio\": \"30-70\", \"leftItems\": [\"avatar\", \"personalInfo\", \"contactInfo\", \"education\", \"skills\"], \"rightItems\": [\"objective\", \"experience\", \"awards\", \"activities\", \"projects\", \"certifications\", \"references\", \"hobbies\"]}], \"unusedItems\": [\"customSection\"]}, \"settings\": {\"font\": \"Roboto\", \"fontSize\": \"medium\", \"template\": \"professional\", \"avatarSize\": 110, \"accentColor\": \"#F2C185\", \"avatarShape\": \"circle\", \"primaryColor\": \"#7C2D12\"}}', 1, '/uploads/cv_thumbnails/1/12.jpg', '/uploads/cv_digital_pdf/1/cv_12.pdf', '2026-08-17 04:01:08'),
(13, 1, 'CV chưa có tên', NULL, '{\"data\": {\"avatar\": {\"url\": \"/uploads/avatars/1_2854679.jpg\"}, \"awards\": [{\"date\": \"12/2023\", \"title\": \"Nhân viên xuất sắc năm 2023\", \"issuer\": \"Global E-commerce\"}], \"skills\": [{\"name\": \"PHP / Laravel\", \"description\": \"Thành thạo — Dùng hàng ngày làm core backend\"}, {\"name\": \"JavaScript / VueJS\", \"description\": \"Khá — Thành thạo Vue 3 & Nuxt\"}, {\"name\": \"MySQL / Tối ưu hoá DB\", \"description\": \"Thành thạo — Biết cách thiết kế schema và đánh index\"}], \"hobbies\": [{\"name\": \"Đọc sách công nghệ\"}, {\"name\": \"Chơi Bida\"}], \"projects\": [{\"name\": \"Hệ thống Quản lý Bán hàng nội bộ\", \"role\": \"Tech Lead\", \"duration\": \"01/2023 - 11/2023\", \"description\": \"Hệ thống hỗ trợ quản lý kho, nhân sự và chuỗi cung ứng cho 15.000 user.\\nCông nghệ: Laravel, VueJS, Redis, Docker\"}], \"education\": [{\"gpa\": \"3.4\", \"major\": \"Công nghệ thông tin\", \"school\": \"Đại học Khoa học Tự nhiên TP.HCM\", \"duration\": \"09/2014 - 07/2018\", \"description\": \"Tốt nghiệp loại Khá. Từng đạt giải Nhì cuộc thi Hackathon trường.\"}], \"objective\": \"Lập trình viên Fullstack với hơn 5 năm kinh nghiệm phát triển các ứng dụng web. Có kinh nghiệm với Laravel, VueJS và thiết kế hệ thống tối ưu hiệu suất cao.\", \"activities\": [{\"role\": \"Speaker\", \"duration\": \"06/2021\", \"description\": \"Tham gia làm diễn giả chia sẻ về kinh nghiệm tối ưu hoá hệ thống chịu tải cao.\", \"organization\": \"Cộng đồng IT Vietnam\"}], \"experience\": [{\"role\": \"Backend Developer\", \"company\": \"Tech Asia Solutions\", \"duration\": \"08/2018 - 01/2022\", \"description\": \"Phát triển RESTful API cho ứng dụng di động. Tối ưu hoá truy vấn MySQL giúp giảm 30% thời gian load.\"}, {\"role\": \"Senior Fullstack Developer\", \"company\": \"Global E-commerce\", \"duration\": \"02/2022\", \"description\": \"Leader nhóm 4 thành viên. Xây dựng kiến trúc microservices và áp dụng CI/CD cho dự án ERP.\"}], \"references\": [], \"contactInfo\": [{\"label\": \"Ngày sinh\", \"value\": \"20/05/1996\"}, {\"label\": \"Giới tính\", \"value\": \"Nam\"}, {\"label\": \"Số điện thoại\", \"value\": \"0901234567\"}, {\"label\": \"Email\", \"value\": \"trong.nguyen@email.com\"}, {\"label\": \"Website\", \"value\": \"\"}, {\"label\": \"Địa chỉ\", \"value\": \"Quận 1, TP. Hồ Chí Minh\"}, {\"label\": \"GitHub\", \"value\": \"https://github.com/JulianNguyen05\"}], \"personalInfo\": {\"fullName\": \"Nguyễn Hữu Trọng\", \"jobTitle\": \"Senior Fullstack Developer\"}, \"sectionTitles\": {\"objective\": \"MỤC TIÊU NGHỀ NGHIỆP\", \"experience\": \"KINH NGHIỆM LÀM VIỆC\"}, \"certifications\": [{\"date\": \"05/2023\", \"name\": \"AWS Certified Solutions Architect\", \"issuer\": \"Amazon Web Services\"}]}, \"layout\": {\"activeRows\": [{\"id\": \"row-1\", \"ratio\": \"10-0\", \"leftItems\": [\"personalInfo\", \"contactInfo\"], \"rightItems\": []}, {\"id\": \"row-2\", \"ratio\": \"10-0\", \"leftItems\": [\"objective\", \"education\", \"experience\", \"activities\", \"awards\", \"skills\", \"references\"], \"rightItems\": []}], \"unusedItems\": [\"avatar\", \"certifications\", \"projects\", \"hobbies\", \"customSection\"]}, \"settings\": {\"font\": \"Times New Roman\", \"fontSize\": \"medium\", \"template\": \"harvard\", \"avatarSize\": 100, \"accentColor\": \"#111827\", \"avatarShape\": \"square\", \"primaryColor\": \"#111827\"}}', 1, '/uploads/cv_thumbnails/1/13.jpg', '/uploads/cv_digital_pdf/1/cv_13.pdf', '2026-08-17 04:02:11');

-- --------------------------------------------------------

--
-- Table structure for table `demo_products`
--

CREATE TABLE `demo_products` (
  `id` bigint NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` double DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `demo_products`
--

INSERT INTO `demo_products` (`id`, `name`, `price`) VALUES
(1, 'test2', 12333332222),
(2, 'abcde', 12345);

-- --------------------------------------------------------

--
-- Table structure for table `job_postings`
--

CREATE TABLE `job_postings` (
  `id` bigint NOT NULL,
  `company_id` bigint NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `requirements` text COLLATE utf8mb4_unicode_ci,
  `salary_range` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `location` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `work_type` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT 'PENDING' COMMENT 'PENDING, ACTIVE, CLOSED, REJECTED',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `expires_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `job_postings`
--

INSERT INTO `job_postings` (`id`, `company_id`, `title`, `description`, `requirements`, `salary_range`, `location`, `work_type`, `status`, `created_at`, `expires_at`) VALUES
(1, 1, 'Senior Backend Developer (Python/FastAPI)', 'Tham gia phát triển Core API và các microservices cho hệ thống tuyển dụng bằng AI.', 'Ít nhất 3 năm kinh nghiệm làm việc với Python, FastAPI và MySQL. Có kinh nghiệm với RabbitMQ và Docker là một lợi thế.', '1500 - 2500 USD', 'Quận 1, TP. Hồ Chí Minh', 'FULL_TIME', 'ACTIVE', '2026-07-24 06:39:32', '2026-12-31 23:59:59'),
(2, 2, 'Frontend Developer (ReactJS)', 'Tham gia phát triển giao diện người dùng cho nền tảng quản trị doanh nghiệp.', 'Có ít nhất 2 năm kinh nghiệm làm việc với ReactJS, Redux. Nắm vững HTML/CSS/JavaScript.', '1000 - 1500 USD', 'Quận 3, TP. Hồ Chí Minh', 'FULL_TIME', 'ACTIVE', '2026-07-27 08:47:50', '2026-12-31 23:59:59'),
(3, 2, 'Java Backend Developer (Spring Boot)', 'Xây dựng và duy trì hệ thống Backend Microservices chịu tải cao.', 'Tối thiểu 3 năm kinh nghiệm Java/Spring Boot. Ưu tiên ứng viên có kinh nghiệm với Kafka, Redis.', '1500 - 2500 USD', 'Quận 3, TP. Hồ Chí Minh', 'FULL_TIME', 'ACTIVE', '2026-07-27 08:47:50', '2026-11-30 23:59:59'),
(4, 2, 'UI/UX Designer', 'Thiết kế trải nghiệm và giao diện người dùng cho ứng dụng Mobile và Web.', 'Sử dụng thành thạo Figma. Có tư duy thẩm mỹ tốt, am hiểu về UX Research là một lợi thế.', '800 - 1200 USD', 'Quận Cầu Giấy, Hà Nội', 'FULL_TIME', 'ACTIVE', '2026-07-27 08:47:50', '2026-10-15 23:59:59'),
(5, 2, 'DevOps Engineer', 'Quản lý, vận hành và tối ưu hóa quy trình CI/CD, hệ thống hạ tầng Cloud.', 'Kinh nghiệm với AWS, Docker, Kubernetes, Jenkins/GitLab CI.', '2000 - 3000 USD', 'Quận 3, TP. Hồ Chí Minh', 'FULL_TIME', 'ACTIVE', '2026-07-27 08:47:50', '2026-12-31 23:59:59'),
(6, 2, 'Data Scientist (AI/ML)', 'Nghiên cứu và phát triển các mô hình học máy ứng dụng vào phân tích dữ liệu khách hàng.', 'Thành thạo Python, các thư viện Pandas, Scikit-learn, TensorFlow hoặc PyTorch.', '2000 - 3500 USD', 'Quận Cầu Giấy, Hà Nội', 'FULL_TIME', 'ACTIVE', '2026-07-27 08:47:50', '2026-12-31 23:59:59'),
(7, 2, 'Mobile App Developer (Flutter)', 'Phát triển ứng dụng di động đa nền tảng (iOS/Android) bằng Flutter framework.', 'Ít nhất 1 năm kinh nghiệm làm Flutter. Đã từng public app lên App Store và Google Play.', '1000 - 1800 USD', 'Quận 3, TP. Hồ Chí Minh', 'FULL_TIME', 'ACTIVE', '2026-07-27 08:47:50', '2026-09-30 23:59:59'),
(8, 2, 'QA/QC Tester (Manual & Automation)', 'Đảm bảo chất lượng sản phẩm phần mềm trước khi phát hành đến tay người dùng.', 'Kinh nghiệm 2 năm QA/QC. Biết sử dụng Selenium, Postman là một điểm cộng.', '700 - 1000 USD', 'Quận Cầu Giấy, Hà Nội', 'FULL_TIME', 'ACTIVE', '2026-07-27 08:47:50', '2026-10-31 23:59:59'),
(9, 2, 'Product Manager', 'Quản lý vòng đời phát triển sản phẩm, làm việc với các đội Dev, Design, Marketing.', 'Có kinh nghiệm quản lý sản phẩm phần mềm B2B/B2C, kỹ năng giao tiếp và phân tích số liệu tốt.', '2500 - 4000 USD', 'Quận 3, TP. Hồ Chí Minh', 'FULL_TIME', 'ACTIVE', '2026-07-27 08:47:50', '2026-12-31 23:59:59'),
(10, 2, 'System Analyst (BA)', 'Phân tích yêu cầu khách hàng, viết tài liệu đặc tả hệ thống (SRS) cho team phát triển.', 'Kinh nghiệm làm BA từ 2 năm trở lên. Kỹ năng vẽ biểu đồ UML, BPMN tốt.', '1200 - 2000 USD', 'Quận 3, TP. Hồ Chí Minh', 'FULL_TIME', 'ACTIVE', '2026-07-27 08:47:50', '2026-11-15 23:59:59'),
(11, 2, 'IT Support Specialist', 'Hỗ trợ xử lý các vấn đề kỹ thuật mạng, phần cứng, phần mềm nội bộ cho nhân viên công ty.', 'Am hiểu hệ điều hành Windows/MacOS, mạng LAN cơ bản. Giao tiếp tốt, nhiệt tình.', '500 - 800 USD', 'Quận Cầu Giấy, Hà Nội', 'FULL_TIME', 'ACTIVE', '2026-07-27 08:47:50', '2026-08-30 23:59:59'),
(12, 3, 'Nhân viên Marketing Online (Part-time)', '<p>Chúng tôi đang tìm kiếm một <strong>Nhân viên Marketing Online</strong> làm việc bán thời gian, hỗ trợ đội ngũ xây dựng và triển khai nội dung trên các nền tảng mạng xã hội.</p><p>Công việc bao gồm:</p><ul><li>Lên ý tưởng và <em>xây dựng nội dung</em> cho Fanpage, TikTok, Instagram</li><li>Theo dõi hiệu suất chiến dịch quảng cáo hàng tuần</li><li>Phối hợp với team Design để sản xuất hình ảnh, video ngắn</li></ul>', '<p>Ứng viên phù hợp cần đáp ứng các tiêu chí sau:</p><ul><li>Sinh viên năm 3, 4 hoặc mới tốt nghiệp ngành Marketing, Truyền thông</li><li>Có <strong>kỹ năng viết content</strong> tốt, tư duy hình ảnh nhạy bén</li><li>Chủ động, chịu được áp lực deadline</li><li>Ưu tiên ứng viên đã từng vận hành Fanpage/TikTok cá nhân</li></ul>', '4,000,000 - 6,000,000 VND', 'Quận Bình Thạnh, TP. Hồ Chí Minh', 'PART_TIME', 'ACTIVE', '2026-08-04 07:31:10', '2026-12-31 23:59:59');

-- --------------------------------------------------------

--
-- Table structure for table `reference_values`
--

CREATE TABLE `reference_values` (
  `id` bigint NOT NULL,
  `type` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `reference_values`
--

INSERT INTO `reference_values` (`id`, `type`, `name`) VALUES
(1, 'LANGUAGE', 'Tiếng Anh'),
(3, 'SKILL', 'JavaScript / VueJS'),
(4, 'SKILL', 'MySQL / Tối ưu hoá DB'),
(2, 'SKILL', 'PHP / Laravel');

-- --------------------------------------------------------

--
-- Table structure for table `reference_value_suggestions`
--

CREATE TABLE `reference_value_suggestions` (
  `id` bigint NOT NULL,
  `type` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `requested_by_user_id` bigint NOT NULL,
  `request_type` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'CREATE',
  `target_reference_value_id` bigint DEFAULT NULL,
  `status` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PENDING' COMMENT 'PENDING, APPROVED, REJECTED',
  `reviewed_by_admin_id` bigint DEFAULT NULL,
  `review_note` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `reviewed_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `reference_value_suggestions`
--

INSERT INTO `reference_value_suggestions` (`id`, `type`, `name`, `requested_by_user_id`, `request_type`, `target_reference_value_id`, `status`, `reviewed_by_admin_id`, `review_note`, `created_at`, `reviewed_at`) VALUES
(1, 'LANGUAGE', 'Tiếng Anh', 1, 'CREATE', NULL, 'APPROVED', 1, NULL, '2026-07-14 08:40:56', '2026-07-16 01:38:32'),
(2, 'LANGUAGE', 'T', 1, 'CREATE', NULL, 'REJECTED', 1, '', '2026-07-14 08:41:15', '2026-07-16 01:38:36'),
(3, 'SKILL', 'aa', 1, 'CREATE', NULL, 'APPROVED', 1, NULL, '2026-07-16 01:42:52', '2026-07-16 01:43:17');

-- --------------------------------------------------------

--
-- Table structure for table `saved_jobs`
--

CREATE TABLE `saved_jobs` (
  `id` bigint NOT NULL,
  `candidate_id` bigint NOT NULL,
  `job_id` bigint NOT NULL,
  `saved_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `system_logs`
--

CREATE TABLE `system_logs` (
  `id` bigint NOT NULL,
  `user_id` bigint DEFAULT NULL,
  `action` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `details` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `system_logs`
--

INSERT INTO `system_logs` (`id`, `user_id`, `action`, `details`, `created_at`) VALUES
(1, 1, 'APPROVE_SUGGESTION_CREATE', 'Suggestion ID: 1 (LANGUAGE: Tiếng Anh)', '2026-07-16 01:38:32'),
(2, 1, 'REJECT_SUGGESTION', 'Suggestion ID: 2. Lý do: ', '2026-07-16 01:38:36'),
(3, 1, 'APPROVE_SUGGESTION_CREATE', 'Suggestion ID: 3 (SKILL: aa)', '2026-07-16 01:43:17');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `password_hash` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'ADMIN, EMPLOYER, CANDIDATE',
  `status` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT 'ACTIVE' COMMENT 'ACTIVE, INACTIVE, BANNED',
  `is_mfa_enabled` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `email`, `phone`, `password_hash`, `role`, `status`, `is_mfa_enabled`, `created_at`, `updated_at`) VALUES
(1, 'user1@gmail.com', NULL, '$2a$10$ZI4mUSszCLaHMJJ3LF7Ke.RII1hLS.taSVWFZI4jFaVdxmlYkUCM.', 'CANDIDATE', 'ACTIVE', 0, '2026-07-13 02:45:44', '2026-07-13 02:45:44'),
(2, 'admin@gmail.com', NULL, '$2a$10$siBh5GXNBBIlX/81fNtR2uba.hSywYGnIV/ZBqr3eDMpOu208ZtiO', 'ADMIN', 'ACTIVE', 0, '2026-07-15 06:46:12', '2026-07-15 06:58:04'),
(3, 'employer@gmail.com', '0987654321', '$2a$10$dummyhashpassword123', 'EMPLOYER', 'ACTIVE', 0, '2026-07-24 06:39:32', '2026-07-24 06:39:32'),
(4, 'hr@technova.vn', '0912345678', '$2a$10$dummyhashpassword123', 'EMPLOYER', 'ACTIVE', 0, '2026-07-27 08:47:50', '2026-07-27 08:47:50'),
(5, 'ctyA@gmail.com', NULL, '$2a$10$cc9kD4z4PHqKVFUS/WG5oOSuaEjdt2UGv9TIvYzQdcf9sOseWAM.u', 'EMPLOYER', 'ACTIVE', 0, '2026-08-04 06:45:36', '2026-08-04 06:45:36');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `applications`
--
ALTER TABLE `applications`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uk_job_candidate` (`job_id`,`candidate_id`),
  ADD UNIQUE KEY `UKkphvsdbcird8yi4ye3ip913d7` (`job_id`,`candidate_id`),
  ADD KEY `fk_app_candidate` (`candidate_id`),
  ADD KEY `fk_app_cv` (`cv_id`);

--
-- Indexes for table `candidate_activities`
--
ALTER TABLE `candidate_activities`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_act_candidate` (`candidate_id`);

--
-- Indexes for table `candidate_awards`
--
ALTER TABLE `candidate_awards`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_award_candidate` (`candidate_id`);

--
-- Indexes for table `candidate_certifications`
--
ALTER TABLE `candidate_certifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_cert_candidate` (`candidate_id`);

--
-- Indexes for table `candidate_educations`
--
ALTER TABLE `candidate_educations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_edu_candidate` (`candidate_id`);

--
-- Indexes for table `candidate_experiences`
--
ALTER TABLE `candidate_experiences`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_exp_candidate` (`candidate_id`);

--
-- Indexes for table `candidate_hobbies`
--
ALTER TABLE `candidate_hobbies`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_hobby_candidate` (`candidate_id`);

--
-- Indexes for table `candidate_languages`
--
ALTER TABLE `candidate_languages`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_candidate_language` (`candidate_id`,`language_id`),
  ADD KEY `fk_lang_ref` (`language_id`);

--
-- Indexes for table `candidate_profiles`
--
ALTER TABLE `candidate_profiles`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_candidate_user` (`user_id`);

--
-- Indexes for table `candidate_profile_layouts`
--
ALTER TABLE `candidate_profile_layouts`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_candidate_block` (`candidate_id`,`block_type`);

--
-- Indexes for table `candidate_projects`
--
ALTER TABLE `candidate_projects`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_proj_candidate` (`candidate_id`);

--
-- Indexes for table `candidate_skills`
--
ALTER TABLE `candidate_skills`
  ADD PRIMARY KEY (`candidate_id`,`skill_id`),
  ADD KEY `fk_cs_skill` (`skill_id`);

--
-- Indexes for table `company_likes`
--
ALTER TABLE `company_likes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_user_company` (`user_id`,`company_id`),
  ADD UNIQUE KEY `UKdvh2xesu9h9a7k4wkbareclsf` (`user_id`,`company_id`),
  ADD KEY `fk_like_company` (`company_id`);

--
-- Indexes for table `company_profiles`
--
ALTER TABLE `company_profiles`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_company_user` (`user_id`);

--
-- Indexes for table `cv_documents`
--
ALTER TABLE `cv_documents`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_cv_candidate` (`candidate_id`);

--
-- Indexes for table `demo_products`
--
ALTER TABLE `demo_products`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `job_postings`
--
ALTER TABLE `job_postings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_job_company` (`company_id`);

--
-- Indexes for table `reference_values`
--
ALTER TABLE `reference_values`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_type_name` (`type`,`name`);

--
-- Indexes for table `reference_value_suggestions`
--
ALTER TABLE `reference_value_suggestions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_suggestion_user` (`requested_by_user_id`),
  ADD KEY `fk_suggestion_target` (`target_reference_value_id`);

--
-- Indexes for table `saved_jobs`
--
ALTER TABLE `saved_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_candidate_job` (`candidate_id`,`job_id`),
  ADD UNIQUE KEY `UK6e7b2qng7km656gwv8c4cv8kj` (`candidate_id`,`job_id`),
  ADD KEY `fk_saved_job` (`job_id`);

--
-- Indexes for table `system_logs`
--
ALTER TABLE `system_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_log_user` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `applications`
--
ALTER TABLE `applications`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `candidate_activities`
--
ALTER TABLE `candidate_activities`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `candidate_awards`
--
ALTER TABLE `candidate_awards`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `candidate_certifications`
--
ALTER TABLE `candidate_certifications`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `candidate_educations`
--
ALTER TABLE `candidate_educations`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `candidate_experiences`
--
ALTER TABLE `candidate_experiences`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `candidate_hobbies`
--
ALTER TABLE `candidate_hobbies`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `candidate_languages`
--
ALTER TABLE `candidate_languages`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `candidate_profiles`
--
ALTER TABLE `candidate_profiles`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `candidate_profile_layouts`
--
ALTER TABLE `candidate_profile_layouts`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `candidate_projects`
--
ALTER TABLE `candidate_projects`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `company_likes`
--
ALTER TABLE `company_likes`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `company_profiles`
--
ALTER TABLE `company_profiles`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `cv_documents`
--
ALTER TABLE `cv_documents`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `demo_products`
--
ALTER TABLE `demo_products`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `job_postings`
--
ALTER TABLE `job_postings`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `reference_values`
--
ALTER TABLE `reference_values`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `reference_value_suggestions`
--
ALTER TABLE `reference_value_suggestions`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `saved_jobs`
--
ALTER TABLE `saved_jobs`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `system_logs`
--
ALTER TABLE `system_logs`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `applications`
--
ALTER TABLE `applications`
  ADD CONSTRAINT `fk_app_candidate` FOREIGN KEY (`candidate_id`) REFERENCES `candidate_profiles` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_app_cv` FOREIGN KEY (`cv_id`) REFERENCES `cv_documents` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_app_job` FOREIGN KEY (`job_id`) REFERENCES `job_postings` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `candidate_activities`
--
ALTER TABLE `candidate_activities`
  ADD CONSTRAINT `fk_act_candidate` FOREIGN KEY (`candidate_id`) REFERENCES `candidate_profiles` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `candidate_awards`
--
ALTER TABLE `candidate_awards`
  ADD CONSTRAINT `fk_award_candidate` FOREIGN KEY (`candidate_id`) REFERENCES `candidate_profiles` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `candidate_certifications`
--
ALTER TABLE `candidate_certifications`
  ADD CONSTRAINT `fk_cert_candidate` FOREIGN KEY (`candidate_id`) REFERENCES `candidate_profiles` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `candidate_educations`
--
ALTER TABLE `candidate_educations`
  ADD CONSTRAINT `fk_edu_candidate` FOREIGN KEY (`candidate_id`) REFERENCES `candidate_profiles` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `candidate_experiences`
--
ALTER TABLE `candidate_experiences`
  ADD CONSTRAINT `fk_exp_candidate` FOREIGN KEY (`candidate_id`) REFERENCES `candidate_profiles` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `candidate_hobbies`
--
ALTER TABLE `candidate_hobbies`
  ADD CONSTRAINT `fk_hobby_candidate` FOREIGN KEY (`candidate_id`) REFERENCES `candidate_profiles` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `candidate_languages`
--
ALTER TABLE `candidate_languages`
  ADD CONSTRAINT `fk_lang_candidate` FOREIGN KEY (`candidate_id`) REFERENCES `candidate_profiles` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_lang_ref` FOREIGN KEY (`language_id`) REFERENCES `reference_values` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `candidate_profiles`
--
ALTER TABLE `candidate_profiles`
  ADD CONSTRAINT `fk_candidate_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `candidate_profile_layouts`
--
ALTER TABLE `candidate_profile_layouts`
  ADD CONSTRAINT `fk_layout_candidate` FOREIGN KEY (`candidate_id`) REFERENCES `candidate_profiles` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `candidate_projects`
--
ALTER TABLE `candidate_projects`
  ADD CONSTRAINT `fk_proj_candidate` FOREIGN KEY (`candidate_id`) REFERENCES `candidate_profiles` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `candidate_skills`
--
ALTER TABLE `candidate_skills`
  ADD CONSTRAINT `fk_cs_candidate` FOREIGN KEY (`candidate_id`) REFERENCES `candidate_profiles` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_cs_skill` FOREIGN KEY (`skill_id`) REFERENCES `reference_values` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `company_likes`
--
ALTER TABLE `company_likes`
  ADD CONSTRAINT `fk_like_company` FOREIGN KEY (`company_id`) REFERENCES `company_profiles` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_like_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `company_profiles`
--
ALTER TABLE `company_profiles`
  ADD CONSTRAINT `fk_company_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `cv_documents`
--
ALTER TABLE `cv_documents`
  ADD CONSTRAINT `fk_cv_candidate` FOREIGN KEY (`candidate_id`) REFERENCES `candidate_profiles` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `job_postings`
--
ALTER TABLE `job_postings`
  ADD CONSTRAINT `fk_job_company` FOREIGN KEY (`company_id`) REFERENCES `company_profiles` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `reference_value_suggestions`
--
ALTER TABLE `reference_value_suggestions`
  ADD CONSTRAINT `fk_suggestion_target` FOREIGN KEY (`target_reference_value_id`) REFERENCES `reference_values` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_suggestion_user` FOREIGN KEY (`requested_by_user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `saved_jobs`
--
ALTER TABLE `saved_jobs`
  ADD CONSTRAINT `fk_saved_candidate` FOREIGN KEY (`candidate_id`) REFERENCES `candidate_profiles` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_saved_job` FOREIGN KEY (`job_id`) REFERENCES `job_postings` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `system_logs`
--
ALTER TABLE `system_logs`
  ADD CONSTRAINT `fk_log_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

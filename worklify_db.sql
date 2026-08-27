-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: mysql:3306
-- Generation Time: Aug 26, 2026 at 02:55 AM
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
(15, 1, 1, NULL, 'string', 'PENDING', '2026-07-29 07:35:23', NULL),
(16, 13, 1, NULL, 'Đây là thư ứng tuyển mẫu bổ sung.', 'PENDING', '2026-08-24 09:00:00', NULL),
(17, 14, 2, NULL, 'Đây là thư ứng tuyển mẫu bổ sung.', 'REVIEWED', '2026-08-24 09:00:00', NULL),
(18, 15, 3, NULL, 'Đây là thư ứng tuyển mẫu bổ sung.', 'PENDING', '2026-08-24 09:00:00', NULL),
(19, 16, 4, NULL, 'Đây là thư ứng tuyển mẫu bổ sung.', 'INTERVIEW_SCHEDULED', '2026-08-24 09:00:00', NULL),
(20, 17, 5, NULL, 'Đây là thư ứng tuyển mẫu bổ sung.', 'PENDING', '2026-08-24 09:00:00', NULL),
(21, 18, 6, NULL, 'Đây là thư ứng tuyển mẫu bổ sung.', 'REJECTED', '2026-08-24 09:00:00', NULL),
(22, 19, 7, NULL, 'Đây là thư ứng tuyển mẫu bổ sung.', 'PENDING', '2026-08-24 09:00:00', NULL),
(23, 20, 8, NULL, 'Đây là thư ứng tuyển mẫu bổ sung.', 'ACCEPTED', '2026-08-24 09:00:00', NULL),
(24, 21, 9, NULL, 'Đây là thư ứng tuyển mẫu bổ sung.', 'PENDING', '2026-08-24 09:00:00', NULL),
(25, 22, 10, NULL, 'Đây là thư ứng tuyển mẫu bổ sung.', 'REVIEWED', '2026-08-24 09:00:00', NULL),
(26, 6, 24, NULL, 'Tôi mong muốn ứng tuyển vị trí Kế toán Tổng hợp tại quý công ty.', 'PENDING', '2026-08-21 10:00:00', NULL),
(27, 7, 24, NULL, 'Tôi có 3 năm kinh nghiệm kế toán, mong được trao đổi thêm.', 'REVIEWED', '2026-08-21 14:00:00', NULL),
(28, 8, 27, NULL, 'Tôi đã có kinh nghiệm vận hành kho tại công ty logistics trước đây.', 'REJECTED', '2026-08-22 11:00:00', NULL),
(29, 9, 27, NULL, 'Rất mong được làm việc trong môi trường năng động của công ty.', 'PENDING', '2026-08-22 15:00:00', NULL),
(30, 10, 12, NULL, 'Tôi là sinh viên năm 4 ngành Marketing, mong muốn được thử sức vị trí này.', 'ACCEPTED', '2026-08-10 09:00:00', NULL),
(31, 11, 12, NULL, 'Tôi từng vận hành fanpage cá nhân với hơn 10.000 followers.', 'REJECTED', '2026-08-11 09:00:00', NULL),
(32, 12, 26, NULL, 'Tôi có kinh nghiệm quản lý đội nhóm kinh doanh 5 người trong 2 năm.', 'REJECTED', '2026-08-06 09:00:00', NULL),
(33, 13, 24, NULL, 'Tôi mới tốt nghiệp chuyên ngành Kế toán, mong muốn học hỏi thêm.', 'PENDING', '2026-08-23 09:00:00', NULL),
(34, 3, 27, NULL, 'Tôi muốn thử sức ở vị trí vận hành kho dù trái ngành Frontend.', 'REJECTED', '2026-08-23 10:00:00', NULL),
(35, 4, 24, NULL, 'Tôi quan tâm đến vị trí Kế toán Tổng hợp của quý công ty.', 'REVIEWED', '2026-08-23 11:00:00', NULL),
(36, 1, 12, 13, 'qqq', 'PENDING', '2026-08-24 07:14:50', NULL),
(37, 1, 24, 12, '', 'ACCEPTED', '2026-08-25 09:49:44', NULL);

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
(3, 1, 'Cộng đồng IT Vietnam', 'Speaker', '2021-06-01', NULL, 0, 'Tham gia làm diễn giả chia sẻ về kinh nghiệm tối ưu hoá hệ thống chịu tải cao.', 0),
(4, 3, 'ReactVN Community', 'Contributor', '2022-01-01', NULL, 1, 'Đóng góp bài viết kỹ thuật và tổ chức workshop ReactJS cho cộng đồng.', 0),
(5, 4, 'Java User Group Vietnam', 'Member', '2020-05-01', NULL, 1, 'Tham gia các buổi meetup chia sẻ kiến thức về Spring Boot và kiến trúc hệ thống.', 0),
(6, 5, 'UX Vietnam Meetup', 'Speaker', '2023-03-01', NULL, 1, 'Chia sẻ chủ đề nghiên cứu người dùng tại các buổi meetup thiết kế.', 0),
(7, 6, 'AWS User Group Hanoi', 'Organizer', '2021-09-01', NULL, 1, 'Tổ chức các buổi chia sẻ kỹ thuật hàng tháng về điện toán đám mây.', 0),
(8, 7, 'Data Science Vietnam', 'Member', '2022-05-01', NULL, 1, 'Tham gia các buổi thảo luận chuyên đề về phân tích dữ liệu và machine learning.', 0),
(9, 8, 'Flutter Vietnam Community', 'Contributor', '2022-03-01', NULL, 1, 'Viết bài chia sẻ kinh nghiệm tối ưu hiệu năng ứng dụng Flutter.', 0),
(10, 9, 'Vietnam Software Testing Board', 'Member', '2020-06-01', NULL, 1, 'Tham gia biên soạn tài liệu đào tạo kiểm thử phần mềm cơ bản.', 0),
(11, 10, 'Product Vietnam Community', 'Speaker', '2021-02-01', NULL, 1, 'Chia sẻ kinh nghiệm phát triển sản phẩm tài chính số tại các sự kiện cộng đồng.', 0),
(12, 11, 'CLB Lập trình Đại học Cần Thơ', 'Thành viên', '2021-09-01', NULL, 1, 'Tham gia các buổi sinh hoạt chia sẻ kiến thức lập trình cùng bạn bè trong CLB.', 0),
(13, 12, 'HR Vietnam Network', 'Thành viên tích cực', '2019-04-01', NULL, 1, 'Tham gia các sự kiện kết nối chuyên viên nhân sự trong ngành công nghệ.', 0),
(14, 13, 'BA Vietnam Community', 'Thành viên', '2023-01-01', NULL, 1, 'Tham gia các buổi chia sẻ về phân tích nghiệp vụ ngân hàng số.', 0),
(15, 14, 'Java Vietnam Group', 'Thành viên', '2023-01-01', NULL, 1, 'Tham gia thảo luận kỹ thuật và các buổi meetup Java hàng tháng.', 0),
(16, 15, 'Vietnam Marketing Club', 'Thành viên tích cực', '2023-01-01', NULL, 1, 'Tham gia tổ chức các sự kiện chia sẻ kiến thức marketing số.', 0),
(17, 16, 'AWS Community Vietnam', 'Volunteer', '2023-01-01', NULL, 1, 'Hỗ trợ tổ chức các buổi workshop chia sẻ kiến thức về AWS Cloud.', 0),
(18, 17, 'HR Vietnam Network', 'Thành viên', '2023-01-01', NULL, 1, 'Tham gia các sự kiện kết nối chuyên viên nhân sự trong ngành.', 0),
(19, 18, 'Vietnam GameDev Group', 'Contributor', '2023-01-01', NULL, 1, 'Chia sẻ kinh nghiệm phát triển game tại các buổi gặp mặt cộng đồng.', 0),
(20, 19, 'Vietnam Content Writers Club', 'Thành viên', '2023-01-01', NULL, 1, 'Tham gia các buổi trao đổi kỹ năng viết nội dung sáng tạo.', 0),
(21, 20, 'Network Engineers Vietnam', 'Thành viên', '2023-01-01', NULL, 1, 'Tham gia thảo luận chuyên đề về bảo mật hệ thống mạng.', 0),
(22, 21, 'Startup Sài Gòn', 'Mentor', '2023-01-01', NULL, 1, 'Cố vấn cho các startup trẻ về chiến lược phát triển kinh doanh.', 0),
(23, 22, 'iOS Developers Vietnam', 'Contributor', '2023-01-01', NULL, 1, 'Chia sẻ bài viết kỹ thuật về phát triển ứng dụng iOS.', 0);

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
(3, 1, 'Nhân viên xuất sắc năm 2023', 'Global E-commerce', '2023-12-25', 'Vinh danh cá nhân có đóng góp kỹ thuật quan trọng nhất trong năm.', 0),
(4, 3, 'Nhân viên có sáng kiến tốt nhất Quý 2/2023', 'Vietnam Digital Agency', '2023-07-01', 'Đề xuất và triển khai hệ thống design token giúp đồng bộ UI toàn công ty.', 0),
(5, 4, 'Giải Nhì Hackathon Fintech Việt Nam 2022', 'Ban tổ chức Hackathon Fintech VN', '2022-10-20', 'Xây dựng giải pháp chống gian lận giao dịch bằng machine learning trong 48 giờ.', 0),
(6, 5, 'Giải Nhất cuộc thi Thiết kế UI Sinh viên toàn quốc 2020', 'Hội Mỹ thuật Việt Nam', '2020-11-15', 'Thiết kế ứng dụng hỗ trợ người khuyết tật tiếp cận dịch vụ công.', 0),
(7, 6, 'Đội thi xuất sắc nhất AWS Hackathon 2022', 'Amazon Web Services Vietnam', '2022-08-15', 'Xây dựng giải pháp auto-scaling tiết kiệm 35% chi phí hạ tầng cloud.', 0),
(8, 7, 'Nhân viên xuất sắc Quý 4/2023', 'Shopee Vietnam', '2024-01-10', 'Đóng góp mô hình dự báo giúp giảm 20% tồn kho dư thừa.', 0),
(9, 8, 'Giải Ba cuộc thi Mobile App Innovation 2023', 'Sở Khoa học Công nghệ Đà Nẵng', '2023-11-05', 'Ứng dụng hỗ trợ nông dân theo dõi giá nông sản theo thời gian thực.', 0),
(10, 9, 'Đội QA xuất sắc nhất năm 2023', 'KMS Technology', '2023-12-20', 'Đạt tỷ lệ phát hiện lỗi sớm cao nhất trong số các dự án của công ty.', 0),
(11, 10, 'Sản phẩm xuất sắc của năm 2021', 'Tiki Corporation', '2021-12-15', 'TikiXu được vinh danh là sản phẩm có tốc độ tăng trưởng tốt nhất năm.', 0),
(12, 11, 'Học bổng Khuyến khích học tập học kỳ 2 năm 2023', 'Đại học Cần Thơ', '2023-08-01', 'Đạt thành tích học tập xuất sắc trong học kỳ.', 0),
(13, 12, 'Chuyên viên tuyển dụng xuất sắc năm 2022', 'Employment Hero Vietnam', '2022-12-10', 'Hoàn thành vượt chỉ tiêu tuyển dụng 130% trong năm.', 0),
(14, 13, 'Nhân viên xuất sắc Quý 1/2024', 'Vietcombank', '2024-03-15', 'Hoàn thành xuất sắc dự án phân tích quy trình tín dụng số.', 0),
(15, 14, 'Giải Ba Hackathon Java Vietnam 2023', 'Java Vietnam Group', '2023-09-10', 'Xây dựng giải pháp quản lý kho hàng bằng Spring Boot trong 24 giờ.', 0),
(16, 15, 'Chiến dịch Marketing xuất sắc năm 2023', 'Ogilvy Vietnam', '2023-12-01', 'Chiến dịch truyền thông đạt hơn 2 triệu lượt tiếp cận trên mạng xã hội.', 0),
(17, 16, 'Kỹ sư Cloud xuất sắc năm 2023', 'Viettel IDC', '2023-11-20', 'Tối ưu chi phí vận hành hạ tầng cloud giúp tiết kiệm 25% chi phí.', 0),
(18, 17, 'Chuyên viên tuyển dụng xuất sắc năm 2023', 'Manpower Vietnam', '2023-12-10', 'Hoàn thành 120% chỉ tiêu tuyển dụng trong năm.', 0),
(19, 18, 'Giải Nhì cuộc thi Game Jam Việt Nam 2022', 'VNG Games', '2022-08-20', 'Phát triển game mobile giải trí trong khuôn khổ 48 giờ thi đấu.', 0),
(20, 19, 'Bài viết được yêu thích nhất năm 2023', 'VnExpress', '2023-10-05', 'Loạt bài viết về xu hướng công nghệ đạt lượt đọc cao nhất chuyên mục.', 0),
(21, 20, 'Chứng nhận vận hành mạng an toàn 2022', 'CMC Telecom', '2022-06-15', 'Đảm bảo hệ thống mạng vận hành ổn định không sự cố trong cả năm.', 0),
(22, 21, 'Nhân viên phát triển kinh doanh xuất sắc 2023', 'Base.vn', '2023-12-20', 'Ký kết thành công 15 hợp đồng đối tác chiến lược trong năm.', 0),
(23, 22, 'Giải Nhất cuộc thi Ứng dụng di động 2022', 'Axon Active Vietnam', '2022-11-11', 'Ứng dụng quản lý tài chính cá nhân đạt giải cao nhất cuộc thi nội bộ.', 0);

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
(2, 1, 'AWS Certified Solutions Architect', 'Amazon Web Services', '2023-05-10', '2026-05-10', 'AWS-12345-XYZ', 'https://aws.amazon.com/verification', 1),
(3, 3, 'Meta Front-End Developer Professional Certificate', 'Meta (Coursera)', '2022-04-01', NULL, 'META-FE-88213', NULL, 1),
(4, 4, 'Oracle Certified Professional: Java SE 11 Developer', 'Oracle', '2021-09-15', '2027-09-15', 'OCP-JAVA11-55421', NULL, 1),
(5, 5, 'Google UX Design Professional Certificate', 'Google (Coursera)', '2021-05-20', NULL, 'GOOGLE-UX-44192', NULL, 1),
(6, 6, 'AWS Certified DevOps Engineer - Professional', 'Amazon Web Services', '2022-11-01', '2025-11-01', 'AWS-DEVOPS-77102', NULL, 1),
(7, 7, 'Google Data Analytics Professional Certificate', 'Google (Coursera)', '2021-03-10', NULL, 'GOOGLE-DA-33871', NULL, 1),
(8, 8, 'Flutter Certified Application Developer', 'Google Developers', '2022-06-01', NULL, 'FLUTTER-CAD-19203', NULL, 1),
(9, 9, 'ISTQB Certified Tester Foundation Level', 'ISTQB', '2019-05-15', NULL, 'ISTQB-CTFL-60214', NULL, 1),
(10, 10, 'Certified Scrum Product Owner (CSPO)', 'Scrum Alliance', '2020-03-01', '2026-03-01', 'CSPO-30122', NULL, 1),
(11, 11, 'Node.js Application Development', 'freeCodeCamp', '2023-08-01', NULL, 'FCC-NODE-71029', NULL, 1),
(12, 12, 'LinkedIn Certified Professional Recruiter', 'LinkedIn Learning', '2021-02-01', NULL, 'LI-CPR-90233', NULL, 1),
(13, 13, 'CBAP - Certified Business Analysis Professional', 'IIBA', '2022-05-01', NULL, 'CBAP-90211', NULL, 1),
(14, 14, 'Oracle Certified Associate: Java SE 8 Programmer', 'Oracle', '2021-03-01', NULL, 'OCA-JAVA8-33210', NULL, 1),
(15, 15, 'Google Ads Certification', 'Google', '2022-07-01', '2025-07-01', 'GADS-77102', NULL, 1),
(16, 16, 'AWS Certified Solutions Architect - Associate', 'Amazon Web Services', '2023-02-01', '2026-02-01', 'AWS-SAA-44902', NULL, 1),
(17, 17, 'SHRM Certified Professional (SHRM-CP)', 'SHRM', '2021-09-01', NULL, 'SHRM-CP-22091', NULL, 1),
(18, 18, 'Unity Certified Programmer', 'Unity Technologies', '2022-01-01', NULL, 'UNITY-CP-10982', NULL, 1),
(19, 19, 'Content Marketing Certification', 'HubSpot Academy', '2022-04-01', NULL, 'HUB-CM-55321', NULL, 1),
(20, 20, 'CCNA - Cisco Certified Network Associate', 'Cisco', '2021-06-01', '2027-06-01', 'CCNA-88213', NULL, 1),
(21, 21, 'Certified Sales Professional', 'Vietnam Sales Association', '2022-10-01', NULL, 'CSP-30129', NULL, 1),
(22, 22, 'Apple Certified iOS Developer', 'Apple Developer Academy', '2022-08-01', NULL, 'ACID-19203', NULL, 1);

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
(2, 1, 'Đại học Khoa học Tự nhiên TP.HCM', 'Công nghệ thông tin', 'Đại học', '2014-09-01', '2018-07-30', 0, 3.40, 'Tốt nghiệp loại Khá. Từng đạt giải Nhì cuộc thi Hackathon trường.', 0, '2026-07-20 01:39:10', '2026-07-30 02:55:54'),
(3, 3, 'Đại học Bách Khoa TP.HCM', 'Khoa học máy tính', 'Đại học', '2016-09-01', '2020-06-30', 0, 3.20, 'Tốt nghiệp loại Giỏi. Thành viên CLB Lập trình trường.', 0, '2026-08-20 03:00:00', '2026-08-20 03:00:00'),
(4, 4, 'Đại học Công nghệ Thông tin - ĐHQG TP.HCM', 'Kỹ thuật phần mềm', 'Đại học', '2015-09-01', '2019-06-30', 0, 3.35, 'Đồ án tốt nghiệp đạt loại Xuất sắc, đề tài hệ thống đặt vé trực tuyến.', 0, '2026-08-20 03:00:00', '2026-08-20 03:00:00'),
(5, 5, 'Đại học Kiến trúc TP.HCM', 'Thiết kế đồ hoạ', 'Đại học', '2017-09-01', '2021-06-30', 0, 3.50, 'Tốt nghiệp loại Giỏi, giải Nhất cuộc thi thiết kế UI sinh viên toàn quốc 2020.', 0, '2026-08-20 03:00:00', '2026-08-20 03:00:00'),
(6, 6, 'Học viện Công nghệ Bưu chính Viễn thông', 'Công nghệ thông tin', 'Đại học', '2014-09-01', '2018-06-30', 0, 3.10, 'Tốt nghiệp loại Khá, chuyên ngành mạng máy tính và truyền thông.', 0, '2026-08-20 03:00:00', '2026-08-20 03:00:00'),
(7, 7, 'Đại học Kinh tế Quốc dân', 'Thống kê kinh tế', 'Đại học', '2016-09-01', '2020-06-30', 0, 3.45, 'Tốt nghiệp loại Giỏi, luận văn về mô hình dự báo doanh thu bán lẻ.', 0, '2026-08-20 03:00:00', '2026-08-20 03:00:00'),
(8, 8, 'Đại học Bách Khoa - Đại học Đà Nẵng', 'Công nghệ thông tin', 'Đại học', '2017-09-01', '2021-06-30', 0, 3.15, 'Tốt nghiệp loại Khá, đồ án tốt nghiệp ứng dụng đặt đồ ăn đa nền tảng.', 0, '2026-08-20 03:00:00', '2026-08-20 03:00:00'),
(9, 9, 'Đại học Duy Tân', 'Kỹ thuật phần mềm', 'Đại học', '2015-09-01', '2019-06-30', 0, 3.25, 'Tốt nghiệp loại Khá, chứng chỉ ISTQB Foundation Level trong năm cuối.', 0, '2026-08-20 03:00:00', '2026-08-20 03:00:00'),
(10, 10, 'Đại học Ngoại thương TP.HCM', 'Quản trị kinh doanh', 'Đại học', '2011-09-01', '2015-06-30', 0, 3.30, 'Tốt nghiệp loại Khá, từng là Chủ tịch CLB Khởi nghiệp trường.', 0, '2026-08-20 03:00:00', '2026-08-20 03:00:00'),
(11, 11, 'Đại học Cần Thơ', 'Công nghệ thông tin', 'Đại học', '2020-09-01', '2024-06-30', 0, 3.05, 'Tốt nghiệp loại Khá, đồ án tốt nghiệp hệ thống quản lý thư viện trực tuyến.', 0, '2026-08-20 03:00:00', '2026-08-20 03:00:00'),
(12, 12, 'Đại học Lao động Xã hội', 'Quản trị nhân lực', 'Đại học', '2013-09-01', '2017-06-30', 0, 3.10, 'Tốt nghiệp loại Khá, thực tập tại phòng nhân sự một công ty công nghệ trong năm cuối.', 0, '2026-08-20 03:00:00', '2026-08-20 03:00:00'),
(13, 13, 'Đại học Kinh tế TP.HCM', 'Kinh doanh quốc tế', 'Đại học', '2016-09-01', '2020-06-30', 0, 3.20, 'Tốt nghiệp loại Khá, tham gia CLB Nghiên cứu thị trường.', 0, '2026-08-24 09:00:00', '2026-08-24 09:00:00'),
(14, 14, 'Đại học Công nghiệp TP.HCM', 'Công nghệ thông tin', 'Đại học', '2013-09-01', '2017-06-30', 0, 3.05, 'Tốt nghiệp loại Khá, chuyên ngành lập trình Java.', 0, '2026-08-24 09:00:00', '2026-08-24 09:00:00'),
(15, 15, 'Đại học Kinh tế - Tài chính TP.HCM', 'Marketing', 'Đại học', '2017-09-01', '2021-06-30', 0, 3.30, 'Tốt nghiệp loại Khá, đồ án về chiến lược truyền thông số.', 0, '2026-08-24 09:00:00', '2026-08-24 09:00:00'),
(16, 16, 'Đại học Bách Khoa Hà Nội', 'Kỹ thuật máy tính', 'Đại học', '2014-09-01', '2018-06-30', 0, 3.15, 'Tốt nghiệp loại Khá, chuyên ngành hệ thống mạng và điện toán đám mây.', 0, '2026-08-24 09:00:00', '2026-08-24 09:00:00'),
(17, 17, 'Đại học Nội vụ Hà Nội', 'Quản trị nhân lực', 'Đại học', '2015-09-01', '2019-06-30', 0, 3.10, 'Tốt nghiệp loại Khá, thực tập tại phòng nhân sự doanh nghiệp FDI.', 0, '2026-08-24 09:00:00', '2026-08-24 09:00:00'),
(18, 18, 'Đại học FPT', 'Kỹ thuật phần mềm', 'Đại học', '2018-09-01', '2022-06-30', 0, 3.25, 'Tốt nghiệp loại Khá, đồ án tốt nghiệp là game mobile 2D.', 0, '2026-08-24 09:00:00', '2026-08-24 09:00:00'),
(19, 19, 'Đại học Khoa học Xã hội và Nhân văn TP.HCM', 'Báo chí truyền thông', 'Đại học', '2016-09-01', '2020-06-30', 0, 3.35, 'Tốt nghiệp loại Giỏi, cộng tác viên viết bài cho nhiều báo điện tử.', 0, '2026-08-24 09:00:00', '2026-08-24 09:00:00'),
(20, 20, 'Học viện Kỹ thuật Mật mã', 'An toàn thông tin', 'Đại học', '2012-09-01', '2016-06-30', 0, 3.00, 'Tốt nghiệp loại Khá, chuyên ngành bảo mật hệ thống mạng.', 0, '2026-08-24 09:00:00', '2026-08-24 09:00:00'),
(21, 21, 'Đại học Duy Tân', 'Quản trị kinh doanh', 'Đại học', '2014-09-01', '2018-06-30', 0, 3.20, 'Tốt nghiệp loại Khá, từng là thành viên CLB Khởi nghiệp trẻ.', 0, '2026-08-24 09:00:00', '2026-08-24 09:00:00'),
(22, 22, 'Đại học Sư phạm Kỹ thuật TP.HCM', 'Công nghệ thông tin', 'Đại học', '2017-09-01', '2021-06-30', 0, 3.10, 'Tốt nghiệp loại Khá, đồ án tốt nghiệp ứng dụng iOS quản lý chi tiêu.', 0, '2026-08-24 09:00:00', '2026-08-24 09:00:00');

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
(3, 1, 'Global E-commerce', 'Senior Fullstack Developer', 'FULL_TIME', 'TP. Hồ Chí Minh', '2022-02-01', NULL, 1, 'Leader nhóm 4 thành viên. Xây dựng kiến trúc microservices và áp dụng CI/CD cho dự án ERP.', 1, '2026-07-20 01:39:10', '2026-07-20 01:39:10'),
(4, 3, 'FPT Software', 'Frontend Developer', 'FULL_TIME', 'TP. Hồ Chí Minh', '2020-08-01', '2022-12-31', 0, 'Phát triển giao diện cho hệ thống quản lý nội bộ bằng ReactJS, Redux.', 0, '2026-08-20 03:00:00', '2026-08-20 03:00:00'),
(5, 3, 'Vietnam Digital Agency', 'Senior Frontend Developer', 'FULL_TIME', 'TP. Hồ Chí Minh', '2023-01-01', NULL, 1, 'Xây dựng thư viện component dùng chung cho 5 dự án, giảm 40% thời gian phát triển UI mới.', 1, '2026-08-20 03:00:00', '2026-08-20 03:00:00'),
(6, 4, 'Tiki Corporation', 'Backend Developer', 'FULL_TIME', 'TP. Hồ Chí Minh', '2019-08-01', '2022-05-31', 0, 'Phát triển và bảo trì hệ thống thanh toán nội bộ phục vụ hàng triệu giao dịch/ngày.', 0, '2026-08-20 03:00:00', '2026-08-20 03:00:00'),
(7, 4, 'MoMo (M_Service)', 'Senior Backend Developer', 'FULL_TIME', 'TP. Hồ Chí Minh', '2022-06-01', NULL, 1, 'Thiết kế kiến trúc microservices cho module ví điện tử, áp dụng Kafka cho xử lý sự kiện bất đồng bộ.', 1, '2026-08-20 03:00:00', '2026-08-20 03:00:00'),
(8, 5, 'Base.vn', 'UI/UX Designer', 'FULL_TIME', 'TP. Hồ Chí Minh', '2021-07-01', '2023-08-31', 0, 'Thiết kế giao diện cho các sản phẩm SaaS quản trị doanh nghiệp, thực hiện user testing định kỳ.', 0, '2026-08-20 03:00:00', '2026-08-20 03:00:00'),
(9, 5, 'Haravan', 'Senior UI/UX Designer', 'FULL_TIME', 'TP. Hồ Chí Minh', '2023-09-01', NULL, 1, 'Dẫn dắt thiết kế hệ thống design system dùng chung cho toàn bộ nền tảng thương mại điện tử.', 1, '2026-08-20 03:00:00', '2026-08-20 03:00:00'),
(10, 6, 'VNG Corporation', 'System Administrator', 'FULL_TIME', 'Hà Nội', '2018-08-01', '2021-03-31', 0, 'Quản trị hệ thống server on-premise, triển khai giám sát bằng Zabbix và Grafana.', 0, '2026-08-20 03:00:00', '2026-08-20 03:00:00'),
(11, 6, 'Momo Fintech', 'DevOps Engineer', 'FULL_TIME', 'Hà Nội', '2021-04-01', NULL, 1, 'Xây dựng pipeline CI/CD trên GitLab CI, quản lý cụm Kubernetes phục vụ 200+ microservices.', 1, '2026-08-20 03:00:00', '2026-08-20 03:00:00'),
(12, 7, 'Vingroup', 'Data Analyst', 'FULL_TIME', 'Hà Nội', '2020-07-01', '2022-10-31', 0, 'Phân tích dữ liệu bán hàng chuỗi siêu thị, xây dựng báo cáo Power BI cho ban lãnh đạo.', 0, '2026-08-20 03:00:00', '2026-08-20 03:00:00'),
(13, 7, 'Shopee Vietnam', 'Senior Data Analyst', 'FULL_TIME', 'Hà Nội', '2022-11-01', NULL, 1, 'Xây dựng mô hình phân khúc khách hàng và dự báo nhu cầu tồn kho theo mùa vụ.', 1, '2026-08-20 03:00:00', '2026-08-20 03:00:00'),
(14, 8, 'Axon Active Vietnam', 'Mobile Developer', 'FULL_TIME', 'Đà Nẵng', '2021-08-01', '2023-04-30', 0, 'Phát triển ứng dụng Flutter cho khách hàng châu Âu trong lĩnh vực logistics.', 0, '2026-08-20 03:00:00', '2026-08-20 03:00:00'),
(15, 8, 'Got It Vietnam', 'Senior Mobile Developer', 'FULL_TIME', 'Đà Nẵng', '2023-05-01', NULL, 1, 'Dẫn dắt đội mobile 3 người xây dựng lại app học tập với kiến trúc Clean Architecture.', 1, '2026-08-20 03:00:00', '2026-08-20 03:00:00'),
(16, 9, 'LogiGear Vietnam', 'Manual Tester', 'FULL_TIME', 'Đà Nẵng', '2019-07-01', '2021-09-30', 0, 'Thực hiện kiểm thử chức năng và kiểm thử hồi quy cho hệ thống quản lý chuỗi cung ứng.', 0, '2026-08-20 03:00:00', '2026-08-20 03:00:00'),
(17, 9, 'KMS Technology', 'Senior QA Automation Engineer', 'FULL_TIME', 'Đà Nẵng', '2021-10-01', NULL, 1, 'Xây dựng framework kiểm thử tự động bằng Selenium và Cypress, tích hợp vào pipeline CI/CD.', 1, '2026-08-20 03:00:00', '2026-08-20 03:00:00'),
(18, 10, 'Grab Vietnam', 'Associate Product Manager', 'FULL_TIME', 'TP. Hồ Chí Minh', '2015-08-01', '2019-06-30', 0, 'Quản lý tính năng đặt xe cho thị trường Việt Nam, phối hợp đội ngũ kỹ thuật và vận hành.', 0, '2026-08-20 03:00:00', '2026-08-20 03:00:00'),
(19, 10, 'Tiki Corporation', 'Senior Product Manager', 'FULL_TIME', 'TP. Hồ Chí Minh', '2019-07-01', NULL, 1, 'Dẫn dắt sản phẩm ví điện tử TikiXu, tăng trưởng người dùng hoạt động 150% sau 1 năm.', 1, '2026-08-20 03:00:00', '2026-08-20 03:00:00'),
(20, 11, 'CanTho Tech Solutions', 'Thực tập sinh Backend', 'INTERNSHIP', 'Cần Thơ', '2023-12-01', '2024-05-31', 0, 'Hỗ trợ phát triển API RESTful cho hệ thống quản lý bán hàng nội bộ bằng Node.js/Express.', 0, '2026-08-20 03:00:00', '2026-08-20 03:00:00'),
(21, 12, 'NashTech Vietnam', 'Nhân viên Tuyển dụng', 'FULL_TIME', 'Hà Nội', '2017-08-01', '2020-11-30', 0, 'Tuyển dụng vị trí kỹ sư phần mềm, quản lý toàn bộ quy trình từ sàng lọc CV đến onboarding.', 0, '2026-08-20 03:00:00', '2026-08-20 03:00:00'),
(22, 12, 'Employment Hero Vietnam', 'Senior Talent Acquisition Specialist', 'FULL_TIME', 'Hà Nội', '2020-12-01', NULL, 1, 'Xây dựng chiến lược tuyển dụng công nghệ, giảm 25% thời gian tuyển dụng trung bình.', 1, '2026-08-20 03:00:00', '2026-08-20 03:00:00'),
(23, 13, 'Vietcombank', 'Business Analyst', 'FULL_TIME', 'TP. Hồ Chí Minh', '2022-01-01', NULL, 1, 'Phân tích quy trình nghiệp vụ và đề xuất cải tiến hệ thống ngân hàng số.', 0, '2026-08-24 09:00:00', '2026-08-24 09:00:00'),
(24, 14, 'FPT Software', 'Java Developer', 'FULL_TIME', 'TP. Hồ Chí Minh', '2022-01-01', NULL, 1, 'Phát triển module quản lý đơn hàng cho khách hàng Nhật Bản bằng Spring Boot.', 0, '2026-08-24 09:00:00', '2026-08-24 09:00:00'),
(25, 15, 'Ogilvy Vietnam', 'Marketing Executive', 'FULL_TIME', 'Đà Nẵng', '2022-01-01', NULL, 1, 'Lên kế hoạch và triển khai chiến dịch truyền thông cho các nhãn hàng FMCG.', 0, '2026-08-24 09:00:00', '2026-08-24 09:00:00'),
(26, 16, 'Viettel IDC', 'Cloud Engineer', 'FULL_TIME', 'TP. Hồ Chí Minh', '2022-01-01', NULL, 1, 'Triển khai và vận hành hạ tầng cloud phục vụ khách hàng doanh nghiệp.', 0, '2026-08-24 09:00:00', '2026-08-24 09:00:00'),
(27, 17, 'Manpower Vietnam', 'HR Specialist', 'FULL_TIME', 'Hà Nội', '2022-01-01', NULL, 1, 'Phụ trách tuyển dụng và đào tạo nhân sự cho khách hàng trong ngành sản xuất.', 0, '2026-08-24 09:00:00', '2026-08-24 09:00:00'),
(28, 18, 'VNG Games', 'Game Developer', 'FULL_TIME', 'Cần Thơ', '2022-01-01', NULL, 1, 'Phát triển gameplay cho các dự án game mobile sử dụng Unity/C#.', 0, '2026-08-24 09:00:00', '2026-08-24 09:00:00'),
(29, 19, 'VnExpress', 'Content Writer', 'FULL_TIME', 'TP. Hồ Chí Minh', '2022-01-01', NULL, 1, 'Biên tập và sản xuất nội dung cho chuyên mục công nghệ và đời sống.', 0, '2026-08-24 09:00:00', '2026-08-24 09:00:00'),
(30, 20, 'CMC Telecom', 'Network Engineer', 'FULL_TIME', 'Hà Nội', '2022-01-01', NULL, 1, 'Quản trị hệ thống mạng và bảo mật cho hạ tầng viễn thông doanh nghiệp.', 0, '2026-08-24 09:00:00', '2026-08-24 09:00:00'),
(31, 21, 'Base.vn', 'Business Development', 'FULL_TIME', 'Đà Nẵng', '2022-01-01', NULL, 1, 'Phát triển thị trường và tìm kiếm đối tác cho sản phẩm phần mềm SaaS.', 0, '2026-08-24 09:00:00', '2026-08-24 09:00:00'),
(32, 22, 'Axon Active Vietnam', 'iOS Developer', 'FULL_TIME', 'TP. Hồ Chí Minh', '2022-01-01', NULL, 1, 'Phát triển ứng dụng iOS cho khách hàng châu Âu trong lĩnh vực tài chính.', 0, '2026-08-24 09:00:00', '2026-08-24 09:00:00');

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
(4, 1, 'Chơi Bida', 0),
(5, 3, 'Vẽ minh hoạ số', 0),
(6, 3, 'Chạy bộ', 1),
(7, 4, 'Chơi cờ vua', 0),
(8, 4, 'Nghe podcast công nghệ', 1),
(9, 5, 'Nhiếp ảnh đường phố', 0),
(10, 5, 'Vẽ tranh màu nước', 1),
(11, 6, 'Leo núi', 0),
(12, 6, 'Sửa chữa máy tính', 1),
(13, 7, 'Đọc sách kinh tế', 0),
(14, 7, 'Yoga', 1),
(15, 8, 'Chơi bóng đá', 0),
(16, 8, 'Chơi game di động', 1),
(17, 9, 'Nấu ăn', 0),
(18, 9, 'Trồng cây cảnh', 1),
(19, 10, 'Đọc sách kinh doanh', 0),
(20, 10, 'Chơi golf', 1),
(21, 11, 'Chơi bóng chuyền', 0),
(22, 11, 'Xem phim', 1),
(23, 12, 'Du lịch', 0),
(24, 12, 'Đọc sách tâm lý học', 1),
(25, 13, 'Đọc sách kinh tế', 0),
(26, 14, 'Chơi bóng rổ', 0),
(27, 15, 'Vẽ tranh', 0),
(28, 16, 'Đạp xe đường dài', 0),
(29, 17, 'Nấu ăn', 0),
(30, 18, 'Chơi game điện tử', 0),
(31, 19, 'Viết blog cá nhân', 0),
(32, 20, 'Câu cá', 0),
(33, 21, 'Chạy marathon', 0),
(34, 22, 'Sưu tầm mô hình', 0);

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
(2, 1, 1, 'Thành thạo', 1),
(3, 3, 1, 'Thành thạo', 1),
(4, 4, 1, 'Thành thạo', 1),
(5, 5, 1, 'Thành thạo', 1),
(6, 6, 1, 'Thành thạo', 1),
(7, 7, 1, 'Thành thạo', 1),
(8, 8, 1, 'Thành thạo', 1),
(9, 9, 1, 'Thành thạo', 1),
(10, 10, 1, 'Thành thạo', 1),
(11, 11, 1, 'Thành thạo', 1),
(12, 12, 1, 'Thành thạo', 1),
(13, 13, 1, 'Thành thạo', 1),
(14, 14, 1, 'Thành thạo', 1),
(15, 15, 1, 'Thành thạo', 1),
(16, 16, 1, 'Thành thạo', 1),
(17, 17, 1, 'Thành thạo', 1),
(18, 18, 1, 'Thành thạo', 1),
(19, 19, 1, 'Thành thạo', 1),
(20, 20, 1, 'Thành thạo', 1),
(21, 21, 1, 'Thành thạo', 1),
(22, 22, 1, 'Thành thạo', 1);

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
(2, 2, 'admin', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(3, 6, 'Lê Thị Anh', NULL, 'Frontend Developer', '0912345601', 'lethianh01@gmail.com', 'Nữ', '1998-03-12', 'Quận 3, TP. Hồ Chí Minh', '', 'https://linkedin.com/in/lethianh01', 'https://github.com/lethianh01', 'Frontend Developer với 3 năm kinh nghiệm xây dựng giao diện web hiện đại bằng ReactJS và TypeScript. Yêu thích tối ưu UX/UI và hiệu năng ứng dụng.'),
(4, 7, 'Trần Văn Minh', NULL, 'Backend Developer (Java)', '0912345602', 'tranvanminh02@gmail.com', 'Nam', '1997-11-05', 'Quận 7, TP. Hồ Chí Minh', '', 'https://linkedin.com/in/tranvanminh02', 'https://github.com/tranvanminh02', 'Backend Developer chuyên sâu Java Spring Boot, có kinh nghiệm thiết kế hệ thống microservices và tối ưu hiệu năng truy vấn cơ sở dữ liệu lớn.'),
(5, 8, 'Phạm Thị Hương', NULL, 'UI/UX Designer', '0912345603', 'phamthihuong03@gmail.com', 'Nữ', '1999-02-18', 'Quận Bình Thạnh, TP. Hồ Chí Minh', '', 'https://linkedin.com/in/phamthihuong03', 'https://github.com/phamthihuong03', 'UI/UX Designer với niềm đam mê tạo ra trải nghiệm người dùng trực quan, dễ tiếp cận, dựa trên nghiên cứu người dùng và kiểm thử A/B.'),
(6, 9, 'Hoàng Văn Cường', NULL, 'DevOps Engineer', '0912345604', 'hoangvancuong04@gmail.com', 'Nam', '1996-07-22', 'Quận Cầu Giấy, Hà Nội', '', 'https://linkedin.com/in/hoangvancuong04', 'https://github.com/hoangvancuong04', 'DevOps Engineer với kinh nghiệm triển khai hạ tầng cloud-native, CI/CD pipeline và giám sát hệ thống quy mô lớn trên AWS/Kubernetes.'),
(7, 10, 'Nguyễn Thị Linh', NULL, 'Data Analyst', '0912345605', 'nguyenthilinh05@gmail.com', 'Nữ', '1998-09-30', 'Quận Thanh Xuân, Hà Nội', '', 'https://linkedin.com/in/nguyenthilinh05', 'https://github.com/nguyenthilinh05', 'Data Analyst với kinh nghiệm phân tích dữ liệu kinh doanh, xây dựng dashboard báo cáo và mô hình dự báo hỗ trợ ra quyết định.'),
(8, 11, 'Đặng Quốc Bảo', NULL, 'Mobile Developer (Flutter)', '0912345606', 'dangquocbao06@gmail.com', 'Nam', '1999-01-14', 'Quận Hải Châu, Đà Nẵng', '', 'https://linkedin.com/in/dangquocbao06', 'https://github.com/dangquocbao06', 'Mobile Developer chuyên phát triển ứng dụng đa nền tảng bằng Flutter, có kinh nghiệm tích hợp Firebase và tối ưu hiệu năng ứng dụng.'),
(9, 12, 'Vũ Thị Quỳnh', NULL, 'QA/Tester Engineer', '0912345607', 'vuthiquynh07@gmail.com', 'Nữ', '1997-05-08', 'Quận Ngũ Hành Sơn, Đà Nẵng', '', 'https://linkedin.com/in/vuthiquynh07', 'https://github.com/vuthiquynh07', 'QA Engineer với kinh nghiệm kiểm thử thủ công và tự động hoá kiểm thử, đảm bảo chất lượng phần mềm trong quy trình Agile/Scrum.'),
(10, 13, 'Bùi Thanh Tùng', NULL, 'Product Manager', '0912345608', 'buithanhtung08@gmail.com', 'Nam', '1993-12-02', 'Quận 2, TP. Hồ Chí Minh', '', 'https://linkedin.com/in/buithanhtung08', 'https://github.com/buithanhtung08', 'Product Manager với hơn 6 năm kinh nghiệm dẫn dắt sản phẩm công nghệ, từ nghiên cứu thị trường đến phát triển và ra mắt sản phẩm.'),
(11, 14, 'Đoàn Minh Khôi', NULL, 'Fresher Backend Developer', '0912345609', 'doanminhkhoi09@gmail.com', 'Nam', '2002-04-25', 'Quận Ninh Kiều, Cần Thơ', '', 'https://linkedin.com/in/doanminhkhoi09', 'https://github.com/doanminhkhoi09', 'Sinh viên mới tốt nghiệp ngành Công nghệ thông tin, đam mê phát triển backend với Node.js và mong muốn học hỏi trong môi trường chuyên nghiệp.'),
(12, 15, 'Ngô Phương Thảo', NULL, 'HR Recruiter', '0912345610', 'ngophuongthao10@gmail.com', 'Nữ', '1995-06-19', 'Quận Đống Đa, Hà Nội', '', 'https://linkedin.com/in/ngophuongthao10', '', 'Chuyên viên tuyển dụng với 5 năm kinh nghiệm trong lĩnh vực công nghệ, chuyên tuyển dụng vị trí kỹ thuật cho các công ty phần mềm và startup.'),
(13, 16, 'Lý Kim Ngân', NULL, 'Business Analyst', '0912345611', 'lykimngan11@gmail.com', 'Nữ', '1998-04-11', 'Quận 10, TP. Hồ Chí Minh', '', '', '', 'Ứng viên có kinh nghiệm trong lĩnh vực Business Analyst, mong muốn phát triển sự nghiệp tại môi trường chuyên nghiệp.'),
(14, 17, 'Trịnh Công Sơn', NULL, 'Java Developer', '0912345612', 'trinhcongson12@gmail.com', 'Nam', '1995-08-23', 'Quận Tân Bình, TP. Hồ Chí Minh', '', '', '', 'Ứng viên có kinh nghiệm trong lĩnh vực Java Developer, mong muốn phát triển sự nghiệp tại môi trường chuyên nghiệp.'),
(15, 18, 'Huỳnh Ngọc Mai', NULL, 'Marketing Executive', '0912345613', 'huynhngocmai13@gmail.com', 'Nữ', '1999-01-30', 'Quận Hải Châu, Đà Nẵng', '', '', '', 'Ứng viên có kinh nghiệm trong lĩnh vực Marketing Executive, mong muốn phát triển sự nghiệp tại môi trường chuyên nghiệp.'),
(16, 19, 'Phan Đức Thịnh', NULL, 'Cloud Engineer', '0912345614', 'phanducthinh14@gmail.com', 'Nam', '1996-06-17', 'Quận 2, TP. Hồ Chí Minh', '', '', '', 'Ứng viên có kinh nghiệm trong lĩnh vực Cloud Engineer, mong muốn phát triển sự nghiệp tại môi trường chuyên nghiệp.'),
(17, 20, 'Võ Thanh Hà', NULL, 'HR Specialist', '0912345615', 'vothanhha15@gmail.com', 'Nữ', '1997-10-05', 'Quận Đống Đa, Hà Nội', '', '', '', 'Ứng viên có kinh nghiệm trong lĩnh vực HR Specialist, mong muốn phát triển sự nghiệp tại môi trường chuyên nghiệp.'),
(18, 21, 'Đinh Quang Huy', NULL, 'Game Developer', '0912345616', 'dinhquanghuy16@gmail.com', 'Nam', '2000-02-14', 'Quận Ninh Kiều, Cần Thơ', '', '', '', 'Ứng viên có kinh nghiệm trong lĩnh vực Game Developer, mong muốn phát triển sự nghiệp tại môi trường chuyên nghiệp.'),
(19, 22, 'Nguyễn Phương Dung', NULL, 'Content Writer', '0912345617', 'nguyenphuongdung17@gmail.com', 'Nữ', '1998-12-09', 'Quận 3, TP. Hồ Chí Minh', '', '', '', 'Ứng viên có kinh nghiệm trong lĩnh vực Content Writer, mong muốn phát triển sự nghiệp tại môi trường chuyên nghiệp.'),
(20, 23, 'Lâm Thành Nam', NULL, 'Network Engineer', '0912345618', 'lamthanhnam18@gmail.com', 'Nam', '1994-03-27', 'Quận Cầu Giấy, Hà Nội', '', '', '', 'Ứng viên có kinh nghiệm trong lĩnh vực Network Engineer, mong muốn phát triển sự nghiệp tại môi trường chuyên nghiệp.'),
(21, 24, 'Trương Thu Mai', NULL, 'Business Development', '0912345619', 'truongthumai19@gmail.com', 'Nữ', '1996-11-19', 'Quận Sơn Trà, Đà Nẵng', '', '', '', 'Ứng viên có kinh nghiệm trong lĩnh vực Business Development, mong muốn phát triển sự nghiệp tại môi trường chuyên nghiệp.'),
(22, 25, 'Cao Văn Phúc', NULL, 'iOS Developer', '0912345620', 'caovanphuc20@gmail.com', 'Nam', '1999-07-22', 'Quận Bình Thạnh, TP. Hồ Chí Minh', '', '', '', 'Ứng viên có kinh nghiệm trong lĩnh vực iOS Developer, mong muốn phát triển sự nghiệp tại môi trường chuyên nghiệp.');

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
(24, 2, 'HOBBY', 11, 1, '2026-08-20 03:09:50', '2026-08-20 03:09:50'),
(25, 3, 'AVATAR', 0, 1, '2026-08-20 03:00:00', '2026-08-20 03:00:00'),
(26, 3, 'EDUCATION', 1, 1, '2026-08-20 03:00:00', '2026-08-20 03:00:00'),
(27, 3, 'PERSONAL_INFO', 2, 1, '2026-08-20 03:00:00', '2026-08-20 03:00:00'),
(28, 3, 'SOCIAL_LINKS', 3, 1, '2026-08-20 03:00:00', '2026-08-20 03:00:00'),
(29, 3, 'EXPERIENCE', 4, 1, '2026-08-20 03:00:00', '2026-08-20 03:00:00'),
(30, 3, 'SKILL', 5, 1, '2026-08-20 03:00:00', '2026-08-20 03:00:00'),
(31, 3, 'PROJECT', 6, 1, '2026-08-20 03:00:00', '2026-08-20 03:00:00'),
(32, 3, 'AWARD', 7, 1, '2026-08-20 03:00:00', '2026-08-20 03:00:00'),
(33, 3, 'LANGUAGE', 8, 1, '2026-08-20 03:00:00', '2026-08-20 03:00:00'),
(34, 3, 'CERTIFICATION', 9, 1, '2026-08-20 03:00:00', '2026-08-20 03:00:00'),
(35, 3, 'HOBBY', 10, 1, '2026-08-20 03:00:00', '2026-08-20 03:00:00'),
(36, 3, 'ACTIVITY', 11, 1, '2026-08-20 03:00:00', '2026-08-20 03:00:00'),
(37, 4, 'AVATAR', 0, 1, '2026-08-20 03:00:00', '2026-08-20 03:00:00'),
(38, 4, 'EDUCATION', 1, 1, '2026-08-20 03:00:00', '2026-08-20 03:00:00'),
(39, 4, 'PERSONAL_INFO', 2, 1, '2026-08-20 03:00:00', '2026-08-20 03:00:00'),
(40, 4, 'SOCIAL_LINKS', 3, 1, '2026-08-20 03:00:00', '2026-08-20 03:00:00'),
(41, 4, 'EXPERIENCE', 4, 1, '2026-08-20 03:00:00', '2026-08-20 03:00:00'),
(42, 4, 'SKILL', 5, 1, '2026-08-20 03:00:00', '2026-08-20 03:00:00'),
(43, 4, 'PROJECT', 6, 1, '2026-08-20 03:00:00', '2026-08-20 03:00:00'),
(44, 4, 'AWARD', 7, 1, '2026-08-20 03:00:00', '2026-08-20 03:00:00'),
(45, 4, 'LANGUAGE', 8, 1, '2026-08-20 03:00:00', '2026-08-20 03:00:00'),
(46, 4, 'CERTIFICATION', 9, 1, '2026-08-20 03:00:00', '2026-08-20 03:00:00'),
(47, 4, 'HOBBY', 10, 1, '2026-08-20 03:00:00', '2026-08-20 03:00:00'),
(48, 4, 'ACTIVITY', 11, 1, '2026-08-20 03:00:00', '2026-08-20 03:00:00'),
(49, 5, 'AVATAR', 0, 1, '2026-08-20 03:00:00', '2026-08-20 03:00:00'),
(50, 5, 'EDUCATION', 1, 1, '2026-08-20 03:00:00', '2026-08-20 03:00:00'),
(51, 5, 'PERSONAL_INFO', 2, 1, '2026-08-20 03:00:00', '2026-08-20 03:00:00'),
(52, 5, 'SOCIAL_LINKS', 3, 1, '2026-08-20 03:00:00', '2026-08-20 03:00:00'),
(53, 5, 'EXPERIENCE', 4, 1, '2026-08-20 03:00:00', '2026-08-20 03:00:00'),
(54, 5, 'SKILL', 5, 1, '2026-08-20 03:00:00', '2026-08-20 03:00:00'),
(55, 5, 'PROJECT', 6, 1, '2026-08-20 03:00:00', '2026-08-20 03:00:00'),
(56, 5, 'AWARD', 7, 1, '2026-08-20 03:00:00', '2026-08-20 03:00:00'),
(57, 5, 'LANGUAGE', 8, 1, '2026-08-20 03:00:00', '2026-08-20 03:00:00'),
(58, 5, 'CERTIFICATION', 9, 1, '2026-08-20 03:00:00', '2026-08-20 03:00:00'),
(59, 5, 'HOBBY', 10, 1, '2026-08-20 03:00:00', '2026-08-20 03:00:00'),
(60, 5, 'ACTIVITY', 11, 1, '2026-08-20 03:00:00', '2026-08-20 03:00:00'),
(61, 6, 'AVATAR', 0, 1, '2026-08-20 03:00:00', '2026-08-20 03:00:00'),
(62, 6, 'EDUCATION', 1, 1, '2026-08-20 03:00:00', '2026-08-20 03:00:00'),
(63, 6, 'PERSONAL_INFO', 2, 1, '2026-08-20 03:00:00', '2026-08-20 03:00:00'),
(64, 6, 'SOCIAL_LINKS', 3, 1, '2026-08-20 03:00:00', '2026-08-20 03:00:00'),
(65, 6, 'EXPERIENCE', 4, 1, '2026-08-20 03:00:00', '2026-08-20 03:00:00'),
(66, 6, 'SKILL', 5, 1, '2026-08-20 03:00:00', '2026-08-20 03:00:00'),
(67, 6, 'PROJECT', 6, 1, '2026-08-20 03:00:00', '2026-08-20 03:00:00'),
(68, 6, 'AWARD', 7, 1, '2026-08-20 03:00:00', '2026-08-20 03:00:00'),
(69, 6, 'LANGUAGE', 8, 1, '2026-08-20 03:00:00', '2026-08-20 03:00:00'),
(70, 6, 'CERTIFICATION', 9, 1, '2026-08-20 03:00:00', '2026-08-20 03:00:00'),
(71, 6, 'HOBBY', 10, 1, '2026-08-20 03:00:00', '2026-08-20 03:00:00'),
(72, 6, 'ACTIVITY', 11, 1, '2026-08-20 03:00:00', '2026-08-20 03:00:00'),
(73, 7, 'AVATAR', 0, 1, '2026-08-20 03:00:00', '2026-08-20 03:00:00'),
(74, 7, 'EDUCATION', 1, 1, '2026-08-20 03:00:00', '2026-08-20 03:00:00'),
(75, 7, 'PERSONAL_INFO', 2, 1, '2026-08-20 03:00:00', '2026-08-20 03:00:00'),
(76, 7, 'SOCIAL_LINKS', 3, 1, '2026-08-20 03:00:00', '2026-08-20 03:00:00'),
(77, 7, 'EXPERIENCE', 4, 1, '2026-08-20 03:00:00', '2026-08-20 03:00:00'),
(78, 7, 'SKILL', 5, 1, '2026-08-20 03:00:00', '2026-08-20 03:00:00'),
(79, 7, 'PROJECT', 6, 1, '2026-08-20 03:00:00', '2026-08-20 03:00:00'),
(80, 7, 'AWARD', 7, 1, '2026-08-20 03:00:00', '2026-08-20 03:00:00'),
(81, 7, 'LANGUAGE', 8, 1, '2026-08-20 03:00:00', '2026-08-20 03:00:00'),
(82, 7, 'CERTIFICATION', 9, 1, '2026-08-20 03:00:00', '2026-08-20 03:00:00'),
(83, 7, 'HOBBY', 10, 1, '2026-08-20 03:00:00', '2026-08-20 03:00:00'),
(84, 7, 'ACTIVITY', 11, 1, '2026-08-20 03:00:00', '2026-08-20 03:00:00'),
(85, 8, 'AVATAR', 0, 1, '2026-08-20 03:00:00', '2026-08-20 03:00:00'),
(86, 8, 'EDUCATION', 1, 1, '2026-08-20 03:00:00', '2026-08-20 03:00:00'),
(87, 8, 'PERSONAL_INFO', 2, 1, '2026-08-20 03:00:00', '2026-08-20 03:00:00'),
(88, 8, 'SOCIAL_LINKS', 3, 1, '2026-08-20 03:00:00', '2026-08-20 03:00:00'),
(89, 8, 'EXPERIENCE', 4, 1, '2026-08-20 03:00:00', '2026-08-20 03:00:00'),
(90, 8, 'SKILL', 5, 1, '2026-08-20 03:00:00', '2026-08-20 03:00:00'),
(91, 8, 'PROJECT', 6, 1, '2026-08-20 03:00:00', '2026-08-20 03:00:00'),
(92, 8, 'AWARD', 7, 1, '2026-08-20 03:00:00', '2026-08-20 03:00:00'),
(93, 8, 'LANGUAGE', 8, 1, '2026-08-20 03:00:00', '2026-08-20 03:00:00'),
(94, 8, 'CERTIFICATION', 9, 1, '2026-08-20 03:00:00', '2026-08-20 03:00:00'),
(95, 8, 'HOBBY', 10, 1, '2026-08-20 03:00:00', '2026-08-20 03:00:00'),
(96, 8, 'ACTIVITY', 11, 1, '2026-08-20 03:00:00', '2026-08-20 03:00:00'),
(97, 9, 'AVATAR', 0, 1, '2026-08-20 03:00:00', '2026-08-20 03:00:00'),
(98, 9, 'EDUCATION', 1, 1, '2026-08-20 03:00:00', '2026-08-20 03:00:00'),
(99, 9, 'PERSONAL_INFO', 2, 1, '2026-08-20 03:00:00', '2026-08-20 03:00:00'),
(100, 9, 'SOCIAL_LINKS', 3, 1, '2026-08-20 03:00:00', '2026-08-20 03:00:00'),
(101, 9, 'EXPERIENCE', 4, 1, '2026-08-20 03:00:00', '2026-08-20 03:00:00'),
(102, 9, 'SKILL', 5, 1, '2026-08-20 03:00:00', '2026-08-20 03:00:00'),
(103, 9, 'PROJECT', 6, 1, '2026-08-20 03:00:00', '2026-08-20 03:00:00'),
(104, 9, 'AWARD', 7, 1, '2026-08-20 03:00:00', '2026-08-20 03:00:00'),
(105, 9, 'LANGUAGE', 8, 1, '2026-08-20 03:00:00', '2026-08-20 03:00:00'),
(106, 9, 'CERTIFICATION', 9, 1, '2026-08-20 03:00:00', '2026-08-20 03:00:00'),
(107, 9, 'HOBBY', 10, 1, '2026-08-20 03:00:00', '2026-08-20 03:00:00'),
(108, 9, 'ACTIVITY', 11, 1, '2026-08-20 03:00:00', '2026-08-20 03:00:00'),
(109, 10, 'AVATAR', 0, 1, '2026-08-20 03:00:00', '2026-08-20 03:00:00'),
(110, 10, 'EDUCATION', 1, 1, '2026-08-20 03:00:00', '2026-08-20 03:00:00'),
(111, 10, 'PERSONAL_INFO', 2, 1, '2026-08-20 03:00:00', '2026-08-20 03:00:00'),
(112, 10, 'SOCIAL_LINKS', 3, 1, '2026-08-20 03:00:00', '2026-08-20 03:00:00'),
(113, 10, 'EXPERIENCE', 4, 1, '2026-08-20 03:00:00', '2026-08-20 03:00:00'),
(114, 10, 'SKILL', 5, 1, '2026-08-20 03:00:00', '2026-08-20 03:00:00'),
(115, 10, 'PROJECT', 6, 1, '2026-08-20 03:00:00', '2026-08-20 03:00:00'),
(116, 10, 'AWARD', 7, 1, '2026-08-20 03:00:00', '2026-08-20 03:00:00'),
(117, 10, 'LANGUAGE', 8, 1, '2026-08-20 03:00:00', '2026-08-20 03:00:00'),
(118, 10, 'CERTIFICATION', 9, 1, '2026-08-20 03:00:00', '2026-08-20 03:00:00'),
(119, 10, 'HOBBY', 10, 1, '2026-08-20 03:00:00', '2026-08-20 03:00:00'),
(120, 10, 'ACTIVITY', 11, 1, '2026-08-20 03:00:00', '2026-08-20 03:00:00'),
(121, 11, 'AVATAR', 0, 1, '2026-08-20 03:00:00', '2026-08-20 03:00:00'),
(122, 11, 'EDUCATION', 1, 1, '2026-08-20 03:00:00', '2026-08-20 03:00:00'),
(123, 11, 'PERSONAL_INFO', 2, 1, '2026-08-20 03:00:00', '2026-08-20 03:00:00'),
(124, 11, 'SOCIAL_LINKS', 3, 1, '2026-08-20 03:00:00', '2026-08-20 03:00:00'),
(125, 11, 'EXPERIENCE', 4, 1, '2026-08-20 03:00:00', '2026-08-20 03:00:00'),
(126, 11, 'SKILL', 5, 1, '2026-08-20 03:00:00', '2026-08-20 03:00:00'),
(127, 11, 'PROJECT', 6, 1, '2026-08-20 03:00:00', '2026-08-20 03:00:00'),
(128, 11, 'AWARD', 7, 1, '2026-08-20 03:00:00', '2026-08-20 03:00:00'),
(129, 11, 'LANGUAGE', 8, 1, '2026-08-20 03:00:00', '2026-08-20 03:00:00'),
(130, 11, 'CERTIFICATION', 9, 1, '2026-08-20 03:00:00', '2026-08-20 03:00:00'),
(131, 11, 'HOBBY', 10, 1, '2026-08-20 03:00:00', '2026-08-20 03:00:00'),
(132, 11, 'ACTIVITY', 11, 1, '2026-08-20 03:00:00', '2026-08-20 03:00:00'),
(133, 12, 'AVATAR', 0, 1, '2026-08-20 03:00:00', '2026-08-20 03:00:00'),
(134, 12, 'EDUCATION', 1, 1, '2026-08-20 03:00:00', '2026-08-20 03:00:00'),
(135, 12, 'PERSONAL_INFO', 2, 1, '2026-08-20 03:00:00', '2026-08-20 03:00:00'),
(136, 12, 'SOCIAL_LINKS', 3, 1, '2026-08-20 03:00:00', '2026-08-20 03:00:00'),
(137, 12, 'EXPERIENCE', 4, 1, '2026-08-20 03:00:00', '2026-08-20 03:00:00'),
(138, 12, 'SKILL', 5, 1, '2026-08-20 03:00:00', '2026-08-20 03:00:00'),
(139, 12, 'PROJECT', 6, 1, '2026-08-20 03:00:00', '2026-08-20 03:00:00'),
(140, 12, 'AWARD', 7, 1, '2026-08-20 03:00:00', '2026-08-20 03:00:00'),
(141, 12, 'LANGUAGE', 8, 1, '2026-08-20 03:00:00', '2026-08-20 03:00:00'),
(142, 12, 'CERTIFICATION', 9, 1, '2026-08-20 03:00:00', '2026-08-20 03:00:00'),
(143, 12, 'HOBBY', 10, 1, '2026-08-20 03:00:00', '2026-08-20 03:00:00'),
(144, 12, 'ACTIVITY', 11, 1, '2026-08-20 03:00:00', '2026-08-20 03:00:00'),
(145, 13, 'AVATAR', 0, 1, '2026-08-24 09:00:00', '2026-08-24 09:00:00'),
(146, 14, 'AVATAR', 0, 1, '2026-08-24 09:00:00', '2026-08-24 09:00:00'),
(147, 15, 'AVATAR', 0, 1, '2026-08-24 09:00:00', '2026-08-24 09:00:00'),
(148, 16, 'AVATAR', 0, 1, '2026-08-24 09:00:00', '2026-08-24 09:00:00'),
(149, 17, 'AVATAR', 0, 1, '2026-08-24 09:00:00', '2026-08-24 09:00:00'),
(150, 18, 'AVATAR', 0, 1, '2026-08-24 09:00:00', '2026-08-24 09:00:00'),
(151, 19, 'AVATAR', 0, 1, '2026-08-24 09:00:00', '2026-08-24 09:00:00'),
(152, 20, 'AVATAR', 0, 1, '2026-08-24 09:00:00', '2026-08-24 09:00:00'),
(153, 21, 'AVATAR', 0, 1, '2026-08-24 09:00:00', '2026-08-24 09:00:00'),
(154, 22, 'AVATAR', 0, 1, '2026-08-24 09:00:00', '2026-08-24 09:00:00');

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
(2, 1, 'Hệ thống Quản lý Bán hàng nội bộ', 'Tech Lead', 'Laravel, VueJS, Redis, Docker', 'https://github.com/trongnguyen/erp-system', '2023-01-15', '2023-11-20', 0, 'Hệ thống hỗ trợ quản lý kho, nhân sự và chuỗi cung ứng cho 15.000 user.', 1, '2026-07-20 01:39:10', '2026-07-20 01:39:10'),
(3, 3, 'Website Thương mại điện tử ThờiTrangViệt', 'Frontend Lead', 'ReactJS, TailwindCSS, Redux Toolkit', 'https://github.com/lethianh01/fashion-ecommerce', '2023-03-01', '2023-09-15', 0, 'Xây dựng giao diện responsive cho sàn TMĐT thời trang, tối ưu Core Web Vitals đạt điểm Lighthouse 95+.', 1, '2026-08-20 03:00:00', '2026-08-20 03:00:00'),
(4, 4, 'Hệ thống Ví điện tử Micro-payment', 'Backend Lead', 'Spring Boot, Kafka, Redis, MySQL', 'https://github.com/tranvanminh02/micro-wallet', '2022-09-01', '2023-06-30', 0, 'Xây dựng hệ thống ví điện tử chịu tải cao, đảm bảo tính nhất quán dữ liệu qua Saga pattern.', 1, '2026-08-20 03:00:00', '2026-08-20 03:00:00'),
(5, 5, 'Design System HaraDS', 'Design Lead', 'Figma, Storybook, ReactJS', 'https://github.com/phamthihuong03/hara-design-system', '2024-01-10', '2024-08-20', 0, 'Xây dựng bộ design system thống nhất áp dụng cho 8 sản phẩm nội bộ, tăng tốc độ thiết kế 50%.', 1, '2026-08-20 03:00:00', '2026-08-20 03:00:00'),
(6, 6, 'Nền tảng CI/CD nội bộ K8s-Pipeline', 'DevOps Lead', 'Kubernetes, Docker, GitLab CI, Terraform', 'https://github.com/hoangvancuong04/k8s-pipeline', '2022-02-01', '2022-12-01', 0, 'Chuẩn hoá quy trình build-deploy tự động cho toàn bộ đội ngũ kỹ thuật, giảm 60% thời gian release.', 1, '2026-08-20 03:00:00', '2026-08-20 03:00:00'),
(7, 7, 'Hệ thống Dashboard Phân tích Bán hàng', 'Data Analyst Lead', 'Python, Power BI, SQL, Pandas', 'https://github.com/nguyenthilinh05/sales-dashboard', '2023-02-01', '2023-07-01', 0, 'Xây dựng dashboard theo dõi KPI bán hàng real-time cho hơn 300 cửa hàng.', 1, '2026-08-20 03:00:00', '2026-08-20 03:00:00'),
(8, 8, 'Ứng dụng Đặt xe Công nghệ DriveNow', 'Mobile Lead', 'Flutter, Firebase, Google Maps API', 'https://github.com/dangquocbao06/drivenow-app', '2023-06-01', '2024-01-15', 0, 'Xây dựng ứng dụng đặt xe với tính năng theo dõi tài xế real-time, hỗ trợ 2 nền tảng iOS/Android.', 1, '2026-08-20 03:00:00', '2026-08-20 03:00:00'),
(9, 9, 'Framework Kiểm thử Tự động QA-Auto', 'Automation Lead', 'Selenium, Cypress, Jenkins, Java', 'https://github.com/vuthiquynh07/qa-auto-framework', '2022-04-01', '2022-10-30', 0, 'Xây dựng framework kiểm thử tự động dùng chung, giảm 70% thời gian kiểm thử hồi quy.', 1, '2026-08-20 03:00:00', '2026-08-20 03:00:00'),
(10, 10, 'Nền tảng Ví điện tử TikiXu', 'Product Lead', 'Product Analytics, SQL, Figma, Jira', 'https://github.com/buithanhtung08/tikixu-case-study', '2020-01-01', '2020-12-31', 0, 'Dẫn dắt từ ý tưởng đến ra mắt sản phẩm ví điện tử, đạt 1 triệu người dùng sau 6 tháng.', 1, '2026-08-20 03:00:00', '2026-08-20 03:00:00'),
(11, 11, 'Hệ thống Quản lý Thư viện Trực tuyến', 'Sinh viên thực hiện', 'Node.js, Express, MongoDB, EJS', 'https://github.com/doanminhkhoi09/library-management', '2023-09-01', '2024-05-15', 0, 'Đồ án tốt nghiệp xây dựng hệ thống mượn/trả sách trực tuyến cho thư viện trường.', 1, '2026-08-20 03:00:00', '2026-08-20 03:00:00'),
(12, 12, 'Chương trình Employer Branding 2023', 'Trưởng dự án', 'LinkedIn Recruiter, ATS, Employer Branding', NULL, '2023-01-01', '2023-06-30', 0, 'Xây dựng chiến dịch thương hiệu tuyển dụng giúp tăng 40% ứng viên chất lượng ứng tuyển.', 1, '2026-08-20 03:00:00', '2026-08-20 03:00:00'),
(13, 13, 'Hệ thống Phân tích Tín dụng số', 'Business Analyst', 'SQL, Power BI, Confluence', 'https://github.com/lykimngan11/credit-analysis', '2023-01-01', '2023-08-30', 0, 'Dự án thực tế triển khai trong quá trình công tác, ứng dụng SQL làm công nghệ chính.', 0, '2026-08-24 09:00:00', '2026-08-24 09:00:00'),
(14, 14, 'Cổng thông tin Quản lý Đơn hàng B2B', 'Java Developer', 'Spring Boot, MySQL, Kafka', 'https://github.com/trinhcongson12/b2b-order-portal', '2023-01-01', '2023-08-30', 0, 'Dự án thực tế triển khai trong quá trình công tác, ứng dụng Spring Boot làm công nghệ chính.', 0, '2026-08-24 09:00:00', '2026-08-24 09:00:00'),
(15, 15, 'Chiến dịch Ra mắt Sản phẩm FMCG', 'Marketing Executive', 'Google Ads, Meta Ads, GA4', NULL, '2023-01-01', '2023-08-30', 0, 'Dự án thực tế triển khai trong quá trình công tác, ứng dụng Google Ads làm công nghệ chính.', 0, '2026-08-24 09:00:00', '2026-08-24 09:00:00'),
(16, 16, 'Nền tảng Giám sát Hạ tầng Cloud', 'Cloud Engineer', 'AWS, Terraform, Grafana', 'https://github.com/phanducthinh14/cloud-monitor', '2023-01-01', '2023-08-30', 0, 'Dự án thực tế triển khai trong quá trình công tác, ứng dụng AWS làm công nghệ chính.', 0, '2026-08-24 09:00:00', '2026-08-24 09:00:00'),
(17, 17, 'Hệ thống Quản lý Tuyển dụng nội bộ', 'HR Specialist', 'Google Sheets, ATS Tool', NULL, '2023-01-01', '2023-08-30', 0, 'Dự án thực tế triển khai trong quá trình công tác, ứng dụng Google Sheets làm công nghệ chính.', 0, '2026-08-24 09:00:00', '2026-08-24 09:00:00'),
(18, 18, 'Game Mobile Phiêu lưu 2D', 'Game Developer', 'Unity, C#, Firebase', 'https://github.com/dinhquanghuy16/adventure-2d', '2023-01-01', '2023-08-30', 0, 'Dự án thực tế triển khai trong quá trình công tác, ứng dụng Unity làm công nghệ chính.', 0, '2026-08-24 09:00:00', '2026-08-24 09:00:00'),
(19, 19, 'Chuyên mục Công nghệ VnExpress Số', 'Content Writer', 'CMS, SEO, Google Analytics', NULL, '2023-01-01', '2023-08-30', 0, 'Dự án thực tế triển khai trong quá trình công tác, ứng dụng CMS làm công nghệ chính.', 0, '2026-08-24 09:00:00', '2026-08-24 09:00:00'),
(20, 20, 'Hệ thống Giám sát Mạng doanh nghiệp', 'Network Engineer', 'Zabbix, Cisco, Python', 'https://github.com/lamthanhnam18/network-monitor', '2023-01-01', '2023-08-30', 0, 'Dự án thực tế triển khai trong quá trình công tác, ứng dụng Zabbix làm công nghệ chính.', 0, '2026-08-24 09:00:00', '2026-08-24 09:00:00'),
(21, 21, 'Chương trình Phát triển Đối tác 2023', 'Business Development', 'CRM, Salesforce, Excel', NULL, '2023-01-01', '2023-08-30', 0, 'Dự án thực tế triển khai trong quá trình công tác, ứng dụng CRM làm công nghệ chính.', 0, '2026-08-24 09:00:00', '2026-08-24 09:00:00'),
(22, 22, 'Ứng dụng Quản lý Chi tiêu Cá nhân', 'iOS Developer', 'Swift, SwiftUI, CoreData', 'https://github.com/caovanphuc20/expense-tracker', '2023-01-01', '2023-08-30', 0, 'Dự án thực tế triển khai trong quá trình công tác, ứng dụng Swift làm công nghệ chính.', 0, '2026-08-24 09:00:00', '2026-08-24 09:00:00');

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
(1, 4, 'Thành thạo', 4, 'Biết cách thiết kế schema và đánh index', 3),
(3, 5, 'Thành thạo', 3, NULL, 1),
(3, 6, 'Khá', 2, NULL, 2),
(4, 2, 'Thành thạo', 6, NULL, 1),
(4, 4, 'Thành thạo', 6, NULL, 2),
(5, 3, 'Khá', 2, NULL, 2),
(5, 6, 'Thành thạo', 4, NULL, 1),
(6, 4, 'Khá', 3, NULL, 2),
(6, 7, 'Thành thạo', 5, NULL, 1),
(7, 2, 'Cơ bản', 1, NULL, 2),
(7, 4, 'Thành thạo', 4, NULL, 1),
(8, 2, 'Cơ bản', 1, NULL, 2),
(8, 3, 'Khá', 3, NULL, 1),
(9, 2, 'Cơ bản', 2, NULL, 2),
(9, 3, 'Khá', 2, NULL, 1),
(10, 2, 'Cơ bản', 1, NULL, 2),
(10, 4, 'Cơ bản', 2, NULL, 1),
(11, 2, 'Cơ bản', 1, NULL, 1),
(11, 3, 'Cơ bản', 1, NULL, 2),
(12, 4, 'Cơ bản', 1, NULL, 1),
(13, 2, 'Khá', 2, NULL, 1),
(14, 3, 'Thành thạo', 4, NULL, 1),
(15, 4, 'Cơ bản', 1, NULL, 1),
(16, 5, 'Khá', 3, NULL, 1),
(17, 6, 'Thành thạo', 5, NULL, 1),
(18, 7, 'Khá', 2, NULL, 1),
(19, 2, 'Cơ bản', 1, NULL, 1),
(20, 3, 'Khá', 3, NULL, 1),
(21, 4, 'Thành thạo', 4, NULL, 1),
(22, 5, 'Khá', 2, NULL, 1);

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

--
-- Dumping data for table `company_likes`
--

INSERT INTO `company_likes` (`id`, `user_id`, `company_id`, `created_at`) VALUES
(1, 1, 2, '2026-08-24 09:00:00'),
(3, 6, 1, '2026-08-24 09:00:00'),
(4, 7, 2, '2026-08-24 09:00:00'),
(5, 8, 4, '2026-08-24 09:00:00'),
(6, 9, 5, '2026-08-24 09:00:00'),
(7, 10, 6, '2026-08-24 09:00:00'),
(8, 11, 7, '2026-08-24 09:00:00'),
(9, 12, 8, '2026-08-24 09:00:00'),
(10, 13, 9, '2026-08-24 09:00:00'),
(11, 1, 3, '2026-08-24 08:42:43');

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
(3, 5, 'Công ty A', '/uploads/companies/logos/logo_owner_5_2854679.jpg', '', 'Đây là giới thiệu của công ty A', 'APPROVED'),
(4, 26, 'GreenTech Solutions', NULL, 'https://greentechsolutions.vn', 'Chuyên cung cấp giải pháp công nghệ xanh và năng lượng thông minh cho doanh nghiệp.', 'APPROVED'),
(5, 27, 'VietSoft JSC', NULL, 'https://vietsoftjsc.vn', 'Đơn vị phát triển phần mềm gia công (outsourcing) cho thị trường Nhật Bản và châu Âu.', 'APPROVED'),
(6, 28, 'CloudBase Vietnam', NULL, 'https://cloudbasevietnam.vn', 'Nhà cung cấp dịch vụ hạ tầng đám mây và giải pháp DevOps cho doanh nghiệp vừa và nhỏ.', 'APPROVED'),
(7, 29, 'FintechPro', NULL, 'https://fintechpro.vn', 'Công ty công nghệ tài chính chuyên về giải pháp thanh toán và cho vay số.', 'APPROVED'),
(8, 30, 'DataWorks Analytics', NULL, 'https://dataworksanalytics.vn', 'Cung cấp dịch vụ phân tích dữ liệu và Business Intelligence cho khách hàng doanh nghiệp.', 'APPROVED'),
(9, 31, 'MobiFirst Corp', NULL, 'https://mobifirstcorp.vn', 'Phát triển ứng dụng di động theo mô hình mobile-first cho các startup.', 'APPROVED'),
(10, 32, 'EcomViet Group', NULL, 'https://ecomvietgroup.vn', 'Nền tảng thương mại điện tử tổng hợp phục vụ thị trường Đông Nam Á.', 'APPROVED'),
(11, 33, 'SmartHR Solutions', NULL, 'https://smarthrsolutions.vn', 'Cung cấp phần mềm quản trị nhân sự (HRM) dạng SaaS cho doanh nghiệp.', 'APPROVED'),
(12, 34, 'LogiTrack Vietnam', NULL, 'https://logitrackvietnam.vn', 'Giải pháp phần mềm quản lý chuỗi cung ứng và vận tải logistics.', 'APPROVED'),
(13, 35, 'EduTech Innovations', NULL, 'https://edutechinnovations.vn', 'Nền tảng công nghệ giáo dục trực tuyến dành cho học sinh, sinh viên.', 'APPROVED');

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
(12, 1, 'CV1', NULL, '{\"data\": {\"avatar\": {\"url\": \"/uploads/avatars/1_2854679.jpg\"}, \"awards\": [{\"date\": \"12/2023\", \"title\": \"Nhân viên xuất sắc năm 2023\", \"issuer\": \"Global E-commerce\"}], \"skills\": [{\"name\": \"PHP / Laravel\", \"description\": \"Thành thạo — Dùng hàng ngày làm core backend\"}, {\"name\": \"JavaScript / VueJS\", \"description\": \"Khá — Thành thạo Vue 3 & Nuxt\"}, {\"name\": \"MySQL / Tối ưu hoá DB\", \"description\": \"Thành thạo — Biết cách thiết kế schema và đánh index\"}], \"hobbies\": [{\"name\": \"Đọc sách công nghệ\"}, {\"name\": \"Chơi Bida\"}], \"projects\": [{\"name\": \"Hệ thống Quản lý Bán hàng nội bộ\", \"role\": \"Tech Lead\", \"duration\": \"01/2023 - 11/2023\", \"description\": \"Hệ thống hỗ trợ quản lý kho, nhân sự và chuỗi cung ứng cho 15.000 user.\\nCông nghệ: Laravel, VueJS, Redis, Docker\"}], \"education\": [{\"gpa\": \"3.4\", \"major\": \"Công nghệ thông tin\", \"school\": \"Đại học Khoa học Tự nhiên TP.HCM\", \"duration\": \"09/2014 - 07/2018\", \"description\": \"Tốt nghiệp loại Khá. Từng đạt giải Nhì cuộc thi Hackathon trường.\"}], \"objective\": \"Lập trình viên Fullstack với hơn 5 năm kinh nghiệm phát triển các ứng dụng web. Có kinh nghiệm với Laravel, VueJS và thiết kế hệ thống tối ưu hiệu suất cao.\", \"activities\": [{\"role\": \"Speaker\", \"duration\": \"06/2021\", \"description\": \"Tham gia làm diễn giả chia sẻ về kinh nghiệm tối ưu hoá hệ thống chịu tải cao.\", \"organization\": \"Cộng đồng IT Vietnam\"}], \"experience\": [{\"role\": \"Backend Developer\", \"company\": \"Tech Asia Solutions\", \"duration\": \"08/2018 - 01/2022\", \"description\": \"Phát triển RESTful API cho ứng dụng di động. Tối ưu hoá truy vấn MySQL giúp giảm 30% thời gian load.\"}, {\"role\": \"Senior Fullstack Developer\", \"company\": \"Global E-commerce\", \"duration\": \"02/2022\", \"description\": \"Leader nhóm 4 thành viên. Xây dựng kiến trúc microservices và áp dụng CI/CD cho dự án ERP.\"}], \"references\": [], \"contactInfo\": [{\"label\": \"Ngày sinh\", \"value\": \"20/05/1996\"}, {\"label\": \"Giới tính\", \"value\": \"Nam\"}, {\"label\": \"Số điện thoại\", \"value\": \"0901234567\"}, {\"label\": \"Email\", \"value\": \"trong.nguyen@email.com\"}, {\"label\": \"Website\", \"value\": \"\"}, {\"label\": \"Địa chỉ\", \"value\": \"Quận 1, TP. Hồ Chí Minh\"}, {\"label\": \"GitHub\", \"value\": \"https://github.com/JulianNguyen05\"}], \"personalInfo\": {\"fullName\": \"Nguyễn Hữu Trọng\", \"jobTitle\": \"Senior Fullstack Developer\"}, \"sectionTitles\": {\"objective\": \"MỤC TIÊU NGHỀ NGHIỆP\", \"experience\": \"KINH NGHIỆM LÀM VIỆC\"}, \"certifications\": [{\"date\": \"05/2023\", \"name\": \"AWS Certified Solutions Architect\", \"issuer\": \"Amazon Web Services\"}]}, \"layout\": {\"activeRows\": [{\"id\": \"row-1\", \"ratio\": \"30-70\", \"leftItems\": [\"avatar\", \"personalInfo\", \"contactInfo\", \"education\", \"skills\"], \"rightItems\": [\"objective\", \"experience\", \"awards\", \"activities\", \"projects\", \"certifications\", \"references\", \"hobbies\"]}], \"unusedItems\": [\"customSection\"]}, \"settings\": {\"font\": \"Roboto\", \"fontSize\": \"medium\", \"template\": \"professional\", \"avatarSize\": 110, \"accentColor\": \"#F2C185\", \"avatarShape\": \"circle\", \"primaryColor\": \"#7C2D12\"}}', 1, '/uploads/cv_thumbnails/1/12.jpg', '/uploads/cv_digital_pdf/1/cv_12.pdf', '2026-08-17 04:01:08'),
(13, 1, 'CV chưa có tên', NULL, '{\"data\": {\"avatar\": {\"url\": \"/uploads/avatars/1_2854679.jpg\"}, \"awards\": [{\"date\": \"12/2023\", \"title\": \"Nhân viên xuất sắc năm 2023\", \"issuer\": \"Global E-commerce\"}], \"skills\": [{\"name\": \"PHP / Laravel\", \"description\": \"Thành thạo — Dùng hàng ngày làm core backend\"}, {\"name\": \"JavaScript / VueJS\", \"description\": \"Khá — Thành thạo Vue 3 & Nuxt\"}, {\"name\": \"MySQL / Tối ưu hoá DB\", \"description\": \"Thành thạo — Biết cách thiết kế schema và đánh index\"}], \"hobbies\": [{\"name\": \"Đọc sách công nghệ\"}, {\"name\": \"Chơi Bida\"}], \"projects\": [{\"name\": \"Hệ thống Quản lý Bán hàng nội bộ\", \"role\": \"Tech Lead\", \"duration\": \"01/2023 - 11/2023\", \"description\": \"Hệ thống hỗ trợ quản lý kho, nhân sự và chuỗi cung ứng cho 15.000 user.\\nCông nghệ: Laravel, VueJS, Redis, Docker\"}], \"education\": [{\"gpa\": \"3.4\", \"major\": \"Công nghệ thông tin\", \"school\": \"Đại học Khoa học Tự nhiên TP.HCM\", \"duration\": \"09/2014 - 07/2018\", \"description\": \"Tốt nghiệp loại Khá. Từng đạt giải Nhì cuộc thi Hackathon trường.\"}], \"objective\": \"Lập trình viên Fullstack với hơn 5 năm kinh nghiệm phát triển các ứng dụng web. Có kinh nghiệm với Laravel, VueJS và thiết kế hệ thống tối ưu hiệu suất cao.\", \"activities\": [{\"role\": \"Speaker\", \"duration\": \"06/2021\", \"description\": \"Tham gia làm diễn giả chia sẻ về kinh nghiệm tối ưu hoá hệ thống chịu tải cao.\", \"organization\": \"Cộng đồng IT Vietnam\"}], \"experience\": [{\"role\": \"Backend Developer\", \"company\": \"Tech Asia Solutions\", \"duration\": \"08/2018 - 01/2022\", \"description\": \"Phát triển RESTful API cho ứng dụng di động. Tối ưu hoá truy vấn MySQL giúp giảm 30% thời gian load.\"}, {\"role\": \"Senior Fullstack Developer\", \"company\": \"Global E-commerce\", \"duration\": \"02/2022\", \"description\": \"Leader nhóm 4 thành viên. Xây dựng kiến trúc microservices và áp dụng CI/CD cho dự án ERP.\"}], \"references\": [], \"contactInfo\": [{\"label\": \"Ngày sinh\", \"value\": \"20/05/1996\"}, {\"label\": \"Giới tính\", \"value\": \"Nam\"}, {\"label\": \"Số điện thoại\", \"value\": \"0901234567\"}, {\"label\": \"Email\", \"value\": \"trong.nguyen@email.com\"}, {\"label\": \"Website\", \"value\": \"\"}, {\"label\": \"Địa chỉ\", \"value\": \"Quận 1, TP. Hồ Chí Minh\"}, {\"label\": \"GitHub\", \"value\": \"https://github.com/JulianNguyen05\"}], \"personalInfo\": {\"fullName\": \"Nguyễn Hữu Trọng\", \"jobTitle\": \"Senior Fullstack Developer\"}, \"sectionTitles\": {\"objective\": \"MỤC TIÊU NGHỀ NGHIỆP\", \"experience\": \"KINH NGHIỆM LÀM VIỆC\"}, \"certifications\": [{\"date\": \"05/2023\", \"name\": \"AWS Certified Solutions Architect\", \"issuer\": \"Amazon Web Services\"}]}, \"layout\": {\"activeRows\": [{\"id\": \"row-1\", \"ratio\": \"10-0\", \"leftItems\": [\"personalInfo\", \"contactInfo\"], \"rightItems\": []}, {\"id\": \"row-2\", \"ratio\": \"10-0\", \"leftItems\": [\"objective\", \"education\", \"experience\", \"activities\", \"awards\", \"skills\", \"references\"], \"rightItems\": []}], \"unusedItems\": [\"avatar\", \"certifications\", \"projects\", \"hobbies\", \"customSection\"]}, \"settings\": {\"font\": \"Times New Roman\", \"fontSize\": \"medium\", \"template\": \"harvard\", \"avatarSize\": 100, \"accentColor\": \"#111827\", \"avatarShape\": \"square\", \"primaryColor\": \"#111827\"}}', 1, '/uploads/cv_thumbnails/1/13.jpg', '/uploads/cv_digital_pdf/1/cv_13.pdf', '2026-08-17 04:02:11'),
(14, 13, 'CV chưa có tên', NULL, NULL, 0, NULL, NULL, '2026-08-24 09:00:00'),
(15, 14, 'CV chưa có tên', NULL, NULL, 0, NULL, NULL, '2026-08-24 09:00:00'),
(16, 15, 'CV chưa có tên', NULL, NULL, 0, NULL, NULL, '2026-08-24 09:00:00'),
(17, 16, 'CV chưa có tên', NULL, NULL, 0, NULL, NULL, '2026-08-24 09:00:00'),
(18, 17, 'CV chưa có tên', NULL, NULL, 0, NULL, NULL, '2026-08-24 09:00:00'),
(19, 18, 'CV chưa có tên', NULL, NULL, 0, NULL, NULL, '2026-08-24 09:00:00'),
(20, 19, 'CV chưa có tên', NULL, NULL, 0, NULL, NULL, '2026-08-24 09:00:00'),
(21, 20, 'CV chưa có tên', NULL, NULL, 0, NULL, NULL, '2026-08-24 09:00:00'),
(22, 21, 'CV chưa có tên', NULL, NULL, 0, NULL, NULL, '2026-08-24 09:00:00'),
(23, 22, 'CV chưa có tên', NULL, NULL, 0, NULL, NULL, '2026-08-24 09:00:00');

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
(2, 'abcde', 12345),
(3, 'Bàn phím cơ', 450000),
(4, 'Chuột không dây', 250000),
(5, 'Tai nghe Bluetooth', 600000),
(6, 'Màn hình 24 inch', 3200000),
(7, 'Ổ cứng SSD 1TB', 1500000),
(8, 'Webcam HD', 350000),
(9, 'Loa Bluetooth mini', 280000),
(10, 'Giá đỡ laptop', 180000),
(11, 'Bàn phím cơ mini', 520000),
(12, 'Sạc dự phòng 10000mAh', 390000);

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
(12, 3, 'Nhân viên Marketing Online (Part-time)', '<p>Chúng tôi đang tìm kiếm một <strong>Nhân viên Marketing Online</strong> làm việc bán thời gian, hỗ trợ đội ngũ xây dựng và triển khai nội dung trên các nền tảng mạng xã hội.</p><p>Công việc bao gồm:</p><ul><li>Lên ý tưởng và <em>xây dựng nội dung</em> cho Fanpage, TikTok, Instagram</li><li>Theo dõi hiệu suất chiến dịch quảng cáo hàng tuần</li><li>Phối hợp với team Design để sản xuất hình ảnh, video ngắn</li></ul>', '<p>Ứng viên phù hợp cần đáp ứng các tiêu chí sau:</p><ul><li>Sinh viên năm 3, 4 hoặc mới tốt nghiệp ngành Marketing, Truyền thông</li><li>Có <strong>kỹ năng viết content</strong> tốt, tư duy hình ảnh nhạy bén</li><li>Chủ động, chịu được áp lực deadline</li><li>Ưu tiên ứng viên đã từng vận hành Fanpage/TikTok cá nhân</li></ul>', '4,000,000 - 6,000,000 VND', 'Quận Bình Thạnh, TP. Hồ Chí Minh', 'PART_TIME', 'ACTIVE', '2026-08-04 07:31:10', '2026-12-31 23:59:59'),
(13, 4, 'Java Backend Developer', 'Phát triển và bảo trì hệ thống backend cho các sản phẩm năng lượng thông minh.', 'Tối thiểu 2 năm kinh nghiệm Java/Spring Boot, hiểu biết về IoT là lợi thế.', '1200 - 2000 USD', 'Quận 7, TP. Hồ Chí Minh', 'FULL_TIME', 'ACTIVE', '2026-08-24 09:00:00', '2026-12-31 23:59:59'),
(14, 5, 'ReactJS Frontend Developer', 'Xây dựng giao diện cho các dự án gia công phần mềm cho khách hàng Nhật Bản.', 'Thành thạo ReactJS, TypeScript. Ưu tiên biết tiếng Nhật N3 trở lên.', '1000 - 1800 USD', 'Quận 1, TP. Hồ Chí Minh', 'FULL_TIME', 'ACTIVE', '2026-08-24 09:00:00', '2026-12-31 23:59:59'),
(15, 6, 'Cloud Solutions Architect', 'Thiết kế và triển khai giải pháp hạ tầng đám mây cho khách hàng doanh nghiệp.', 'Kinh nghiệm AWS/Azure, có chứng chỉ Solutions Architect là lợi thế.', '2000 - 3200 USD', 'Quận 3, TP. Hồ Chí Minh', 'FULL_TIME', 'ACTIVE', '2026-08-24 09:00:00', '2026-12-31 23:59:59'),
(16, 7, 'Fintech Product Manager', 'Quản lý vòng đời sản phẩm cho nền tảng thanh toán số.', 'Có kinh nghiệm sản phẩm trong lĩnh vực fintech tối thiểu 3 năm.', '2200 - 3500 USD', 'Quận 1, TP. Hồ Chí Minh', 'FULL_TIME', 'ACTIVE', '2026-08-24 09:00:00', '2026-12-31 23:59:59'),
(17, 8, 'Data Engineer', 'Xây dựng pipeline dữ liệu phục vụ báo cáo Business Intelligence.', 'Thành thạo SQL, Python, có kinh nghiệm với Airflow/Spark.', '1500 - 2500 USD', 'Quận Cầu Giấy, Hà Nội', 'FULL_TIME', 'ACTIVE', '2026-08-24 09:00:00', '2026-12-31 23:59:59'),
(18, 9, 'Mobile App Developer (iOS)', 'Phát triển ứng dụng iOS cho các startup đối tác.', 'Thành thạo Swift/SwiftUI, đã từng phát hành app lên App Store.', '1200 - 2000 USD', 'Quận Thanh Xuân, Hà Nội', 'FULL_TIME', 'ACTIVE', '2026-08-24 09:00:00', '2026-12-31 23:59:59'),
(19, 10, 'E-commerce Operations Executive', 'Vận hành và tối ưu hoá hoạt động kinh doanh trên nền tảng thương mại điện tử.', 'Có kinh nghiệm vận hành sàn TMĐT, thành thạo Excel/Google Sheets.', '800 - 1300 USD', 'Quận Bình Thạnh, TP. Hồ Chí Minh', 'FULL_TIME', 'ACTIVE', '2026-08-24 09:00:00', '2026-12-31 23:59:59'),
(20, 11, 'HR Business Partner', 'Tư vấn và triển khai chiến lược nhân sự cho khách hàng doanh nghiệp sử dụng phần mềm HRM.', 'Có kinh nghiệm HR tối thiểu 3 năm, hiểu biết về phần mềm SaaS là lợi thế.', '1500 - 2200 USD', 'Quận 10, TP. Hồ Chí Minh', 'FULL_TIME', 'ACTIVE', '2026-08-24 09:00:00', '2026-12-31 23:59:59'),
(21, 12, 'Logistics Software Engineer', 'Phát triển hệ thống quản lý vận tải và theo dõi đơn hàng real-time.', 'Kinh nghiệm với Node.js/Java, hiểu biết về GPS tracking là lợi thế.', '1300 - 2100 USD', 'Quận Hải Châu, Đà Nẵng', 'FULL_TIME', 'ACTIVE', '2026-08-24 09:00:00', '2026-12-31 23:59:59'),
(22, 13, 'EdTech Content Developer', 'Xây dựng nội dung khoá học trực tuyến cho nền tảng giáo dục số.', 'Có kỹ năng biên soạn nội dung giáo dục, ưu tiên có kinh nghiệm E-learning.', '900 - 1500 USD', 'Quận Đống Đa, Hà Nội', 'FULL_TIME', 'ACTIVE', '2026-08-24 09:00:00', '2026-12-31 23:59:59'),
(23, 3, 'Nhân viên Chăm sóc Khách hàng (Part-time)', 'Hỗ trợ giải đáp thắc mắc và xử lý khiếu nại của khách hàng qua điện thoại, email, chat.', 'Giao tiếp tốt, kiên nhẫn, có thể làm việc ca linh hoạt. Ưu tiên có kinh nghiệm CSKH.', '4,500,000 - 6,000,000 VND', 'Quận Bình Thạnh, TP. Hồ Chí Minh', 'PART_TIME', 'PENDING', '2026-08-20 09:00:00', '2026-12-31 23:59:59'),
(24, 3, 'Kế toán Tổng hợp', 'Thực hiện các nghiệp vụ kế toán tổng hợp, lập báo cáo tài chính định kỳ.', 'Tốt nghiệp chuyên ngành Kế toán/Tài chính, tối thiểu 2 năm kinh nghiệm, thành thạo MISA/Excel.', '10,000,000 - 14,000,000 VND', 'Quận Bình Thạnh, TP. Hồ Chí Minh', 'FULL_TIME', 'ACTIVE', '2026-08-21 09:00:00', '2026-12-31 23:59:59'),
(25, 3, 'Thực tập sinh Thiết kế Đồ hoạ', 'Hỗ trợ thiết kế ấn phẩm truyền thông, banner mạng xã hội, tài liệu marketing.', 'Sinh viên năm 3, 4 ngành Thiết kế đồ hoạ, thành thạo Photoshop/Illustrator.', '2,500,000 - 3,500,000 VND', 'Quận Bình Thạnh, TP. Hồ Chí Minh', 'INTERNSHIP', 'CLOSED', '2026-07-01 09:00:00', '2026-08-15 23:59:59'),
(26, 3, 'Trưởng nhóm Kinh doanh', 'Xây dựng và quản lý đội ngũ kinh doanh, chịu trách nhiệm doanh số khu vực TP.HCM.', 'Tối thiểu 3 năm kinh nghiệm quản lý kinh doanh, kỹ năng lãnh đạo và đào tạo đội nhóm tốt.', '15,000,000 - 25,000,000 VND', 'Quận Bình Thạnh, TP. Hồ Chí Minh', 'FULL_TIME', 'REJECTED', '2026-08-05 09:00:00', '2026-09-30 23:59:59'),
(27, 3, 'Nhân viên Vận hành Kho', 'Quản lý xuất nhập kho, kiểm kê hàng hoá định kỳ, phối hợp bộ phận giao nhận.', 'Cẩn thận, chịu được áp lực công việc, biết sử dụng phần mềm quản lý kho là lợi thế.', '7,000,000 - 9,000,000 VND', 'Quận Bình Thạnh, TP. Hồ Chí Minh', 'FULL_TIME', 'ACTIVE', '2026-08-22 09:00:00', '2026-12-31 23:59:59'),
(28, 3, 'Nhân viên Telesales', 'Tư vấn và bán hàng qua điện thoại cho khách hàng tiềm năng.', 'Giọng nói dễ nghe, có kinh nghiệm telesales là lợi thế, chịu được áp lực chỉ tiêu.', '6,000,000 - 10,000,000 VND (lương cứng + hoa hồng)', 'Quận Bình Thạnh, TP. Hồ Chí Minh', 'FULL_TIME', 'CLOSED', '2026-07-10 09:00:00', '2026-08-10 23:59:59');

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
(12, 'LANGUAGE', 'Tiếng Đức'),
(10, 'LANGUAGE', 'Tiếng Hàn'),
(8, 'LANGUAGE', 'Tiếng Nhật'),
(11, 'LANGUAGE', 'Tiếng Pháp'),
(9, 'LANGUAGE', 'Tiếng Trung'),
(7, 'SKILL', 'DevOps / Kubernetes'),
(17, 'SKILL', 'Digital Marketing'),
(15, 'SKILL', 'Flutter / Dart'),
(3, 'SKILL', 'JavaScript / VueJS'),
(4, 'SKILL', 'MySQL / Tối ưu hoá DB'),
(13, 'SKILL', 'Node.js / Express'),
(2, 'SKILL', 'PHP / Laravel'),
(16, 'SKILL', 'Product Management'),
(14, 'SKILL', 'Python / Django'),
(5, 'SKILL', 'ReactJS / TypeScript'),
(6, 'SKILL', 'UI/UX Design & Figma');

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
(3, 'SKILL', 'aa', 1, 'CREATE', NULL, 'APPROVED', 1, NULL, '2026-07-16 01:42:52', '2026-07-16 01:43:17'),
(4, 'LANGUAGE', 'Tiếng Nhật', 1, 'CREATE', NULL, 'APPROVED', 2, NULL, '2026-08-10 02:00:00', '2026-08-11 01:00:00'),
(5, 'LANGUAGE', 'Tiếng Trung', 3, 'CREATE', NULL, 'APPROVED', 2, NULL, '2026-08-10 02:05:00', '2026-08-11 01:05:00'),
(6, 'SKILL', 'Node.js / Express', 4, 'CREATE', NULL, 'APPROVED', 2, NULL, '2026-08-10 02:10:00', '2026-08-11 01:10:00'),
(7, 'SKILL', 'Python / Django', 1, 'CREATE', NULL, 'PENDING', NULL, NULL, '2026-08-12 03:00:00', NULL),
(8, 'SKILL', 'xyz', 3, 'CREATE', NULL, 'REJECTED', 2, 'Tên không rõ nghĩa', '2026-08-12 03:10:00', '2026-08-13 01:00:00'),
(9, 'LANGUAGE', 'Tiếng Hàn', 6, 'CREATE', NULL, 'PENDING', NULL, NULL, '2026-08-14 04:00:00', NULL),
(10, 'SKILL', 'Flutter / Dart', 7, 'CREATE', NULL, 'APPROVED', 2, NULL, '2026-08-14 04:20:00', '2026-08-15 01:00:00'),
(11, 'SKILL', 'Product Management', 9, 'CREATE', NULL, 'PENDING', NULL, NULL, '2026-08-16 05:00:00', NULL),
(12, 'SKILL', 'Digital Marketing', 10, 'CREATE', NULL, 'APPROVED', 2, NULL, '2026-08-16 05:10:00', '2026-08-17 01:00:00'),
(13, 'LANGUAGE', 'Tiếng Pháp', 12, 'CREATE', NULL, 'PENDING', NULL, NULL, '2026-08-18 06:00:00', NULL);

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

--
-- Dumping data for table `saved_jobs`
--

INSERT INTO `saved_jobs` (`id`, `candidate_id`, `job_id`, `saved_at`) VALUES
(1, 13, 3, '2026-08-24 09:00:00'),
(2, 14, 4, '2026-08-24 09:00:00'),
(3, 15, 5, '2026-08-24 09:00:00'),
(4, 16, 6, '2026-08-24 09:00:00'),
(5, 17, 7, '2026-08-24 09:00:00'),
(6, 18, 8, '2026-08-24 09:00:00'),
(7, 19, 9, '2026-08-24 09:00:00'),
(8, 20, 10, '2026-08-24 09:00:00'),
(9, 21, 11, '2026-08-24 09:00:00'),
(10, 22, 12, '2026-08-24 09:00:00');

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
(3, 1, 'APPROVE_SUGGESTION_CREATE', 'Suggestion ID: 3 (SKILL: aa)', '2026-07-16 01:43:17'),
(4, 1, 'UPDATE_PROFILE', 'Cập nhật thông tin hồ sơ cá nhân', '2026-08-24 09:00:00'),
(5, 2, 'APPROVE_COMPANY', 'Duyệt hồ sơ công ty GreenTech Solutions', '2026-08-24 09:00:00'),
(6, 2, 'APPROVE_COMPANY', 'Duyệt hồ sơ công ty VietSoft JSC', '2026-08-24 09:00:00'),
(7, 16, 'CREATE_APPLICATION', 'Ứng viên nộp đơn ứng tuyển vị trí Java Backend Developer', '2026-08-24 09:00:00'),
(8, 17, 'CREATE_APPLICATION', 'Ứng viên nộp đơn ứng tuyển vị trí ReactJS Frontend Developer', '2026-08-24 09:00:00'),
(9, 26, 'CREATE_JOB_POSTING', 'Đăng tin tuyển dụng Java Backend Developer', '2026-08-24 09:00:00'),
(10, 27, 'CREATE_JOB_POSTING', 'Đăng tin tuyển dụng ReactJS Frontend Developer', '2026-08-24 09:00:00'),
(11, 2, 'BAN_USER', 'Khoá tài khoản vi phạm chính sách sử dụng', '2026-08-24 09:00:00'),
(12, 2, 'APPROVE_SUGGESTION_CREATE', 'Suggestion ID: 6 (SKILL: Node.js / Express)', '2026-08-24 09:00:00'),
(13, 2, 'REJECT_SUGGESTION', 'Suggestion ID: 8. Lý do: Tên không rõ nghĩa', '2026-08-24 09:00:00');

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
(5, 'ctyA@gmail.com', NULL, '$2a$10$cc9kD4z4PHqKVFUS/WG5oOSuaEjdt2UGv9TIvYzQdcf9sOseWAM.u', 'EMPLOYER', 'ACTIVE', 0, '2026-08-04 06:45:36', '2026-08-04 06:45:36'),
(6, 'lethianh01@gmail.com', '0912345601', '$2a$10$ZI4mUSszCLaHMJJ3LF7Ke.RII1hLS.taSVWFZI4jFaVdxmlYkUCM.', 'CANDIDATE', 'ACTIVE', 0, '2026-08-20 03:00:00', '2026-08-20 03:00:00'),
(7, 'tranvanminh02@gmail.com', '0912345602', '$2a$10$ZI4mUSszCLaHMJJ3LF7Ke.RII1hLS.taSVWFZI4jFaVdxmlYkUCM.', 'CANDIDATE', 'ACTIVE', 0, '2026-08-20 03:00:00', '2026-08-20 03:00:00'),
(8, 'phamthihuong03@gmail.com', '0912345603', '$2a$10$ZI4mUSszCLaHMJJ3LF7Ke.RII1hLS.taSVWFZI4jFaVdxmlYkUCM.', 'CANDIDATE', 'ACTIVE', 0, '2026-08-20 03:00:00', '2026-08-20 03:00:00'),
(9, 'hoangvancuong04@gmail.com', '0912345604', '$2a$10$ZI4mUSszCLaHMJJ3LF7Ke.RII1hLS.taSVWFZI4jFaVdxmlYkUCM.', 'CANDIDATE', 'ACTIVE', 0, '2026-08-20 03:00:00', '2026-08-20 03:00:00'),
(10, 'nguyenthilinh05@gmail.com', '0912345605', '$2a$10$ZI4mUSszCLaHMJJ3LF7Ke.RII1hLS.taSVWFZI4jFaVdxmlYkUCM.', 'CANDIDATE', 'ACTIVE', 0, '2026-08-20 03:00:00', '2026-08-20 03:00:00'),
(11, 'dangquocbao06@gmail.com', '0912345606', '$2a$10$ZI4mUSszCLaHMJJ3LF7Ke.RII1hLS.taSVWFZI4jFaVdxmlYkUCM.', 'CANDIDATE', 'ACTIVE', 0, '2026-08-20 03:00:00', '2026-08-20 03:00:00'),
(12, 'vuthiquynh07@gmail.com', '0912345607', '$2a$10$ZI4mUSszCLaHMJJ3LF7Ke.RII1hLS.taSVWFZI4jFaVdxmlYkUCM.', 'CANDIDATE', 'ACTIVE', 0, '2026-08-20 03:00:00', '2026-08-20 03:00:00'),
(13, 'buithanhtung08@gmail.com', '0912345608', '$2a$10$ZI4mUSszCLaHMJJ3LF7Ke.RII1hLS.taSVWFZI4jFaVdxmlYkUCM.', 'CANDIDATE', 'ACTIVE', 0, '2026-08-20 03:00:00', '2026-08-20 03:00:00'),
(14, 'doanminhkhoi09@gmail.com', '0912345609', '$2a$10$ZI4mUSszCLaHMJJ3LF7Ke.RII1hLS.taSVWFZI4jFaVdxmlYkUCM.', 'CANDIDATE', 'ACTIVE', 0, '2026-08-20 03:00:00', '2026-08-20 03:00:00'),
(15, 'ngophuongthao10@gmail.com', '0912345610', '$2a$10$ZI4mUSszCLaHMJJ3LF7Ke.RII1hLS.taSVWFZI4jFaVdxmlYkUCM.', 'CANDIDATE', 'ACTIVE', 0, '2026-08-20 03:00:00', '2026-08-20 03:00:00'),
(16, 'lykimngan11@gmail.com', '0912345611', '$2a$10$ZI4mUSszCLaHMJJ3LF7Ke.RII1hLS.taSVWFZI4jFaVdxmlYkUCM.', 'CANDIDATE', 'ACTIVE', 0, '2026-08-24 09:00:00', '2026-08-24 09:00:00'),
(17, 'trinhcongson12@gmail.com', '0912345612', '$2a$10$ZI4mUSszCLaHMJJ3LF7Ke.RII1hLS.taSVWFZI4jFaVdxmlYkUCM.', 'CANDIDATE', 'ACTIVE', 0, '2026-08-24 09:00:00', '2026-08-24 09:00:00'),
(18, 'huynhngocmai13@gmail.com', '0912345613', '$2a$10$ZI4mUSszCLaHMJJ3LF7Ke.RII1hLS.taSVWFZI4jFaVdxmlYkUCM.', 'CANDIDATE', 'ACTIVE', 0, '2026-08-24 09:00:00', '2026-08-24 09:00:00'),
(19, 'phanducthinh14@gmail.com', '0912345614', '$2a$10$ZI4mUSszCLaHMJJ3LF7Ke.RII1hLS.taSVWFZI4jFaVdxmlYkUCM.', 'CANDIDATE', 'ACTIVE', 0, '2026-08-24 09:00:00', '2026-08-24 09:00:00'),
(20, 'vothanhha15@gmail.com', '0912345615', '$2a$10$ZI4mUSszCLaHMJJ3LF7Ke.RII1hLS.taSVWFZI4jFaVdxmlYkUCM.', 'CANDIDATE', 'ACTIVE', 0, '2026-08-24 09:00:00', '2026-08-24 09:00:00'),
(21, 'dinhquanghuy16@gmail.com', '0912345616', '$2a$10$ZI4mUSszCLaHMJJ3LF7Ke.RII1hLS.taSVWFZI4jFaVdxmlYkUCM.', 'CANDIDATE', 'ACTIVE', 0, '2026-08-24 09:00:00', '2026-08-24 09:00:00'),
(22, 'nguyenphuongdung17@gmail.com', '0912345617', '$2a$10$ZI4mUSszCLaHMJJ3LF7Ke.RII1hLS.taSVWFZI4jFaVdxmlYkUCM.', 'CANDIDATE', 'ACTIVE', 0, '2026-08-24 09:00:00', '2026-08-24 09:00:00'),
(23, 'lamthanhnam18@gmail.com', '0912345618', '$2a$10$ZI4mUSszCLaHMJJ3LF7Ke.RII1hLS.taSVWFZI4jFaVdxmlYkUCM.', 'CANDIDATE', 'ACTIVE', 0, '2026-08-24 09:00:00', '2026-08-24 09:00:00'),
(24, 'truongthumai19@gmail.com', '0912345619', '$2a$10$ZI4mUSszCLaHMJJ3LF7Ke.RII1hLS.taSVWFZI4jFaVdxmlYkUCM.', 'CANDIDATE', 'ACTIVE', 0, '2026-08-24 09:00:00', '2026-08-24 09:00:00'),
(25, 'caovanphuc20@gmail.com', '0912345620', '$2a$10$ZI4mUSszCLaHMJJ3LF7Ke.RII1hLS.taSVWFZI4jFaVdxmlYkUCM.', 'CANDIDATE', 'ACTIVE', 0, '2026-08-24 09:00:00', '2026-08-24 09:00:00'),
(26, 'hr@greentech.vn', '0918123456', '$2a$10$ZI4mUSszCLaHMJJ3LF7Ke.RII1hLS.taSVWFZI4jFaVdxmlYkUCM.', 'EMPLOYER', 'ACTIVE', 0, '2026-08-24 09:00:00', '2026-08-24 09:00:00'),
(27, 'tuyendung@vietsoft.vn', '0918123457', '$2a$10$ZI4mUSszCLaHMJJ3LF7Ke.RII1hLS.taSVWFZI4jFaVdxmlYkUCM.', 'EMPLOYER', 'ACTIVE', 0, '2026-08-24 09:00:00', '2026-08-24 09:00:00'),
(28, 'contact@cloudbase.vn', '0918123458', '$2a$10$ZI4mUSszCLaHMJJ3LF7Ke.RII1hLS.taSVWFZI4jFaVdxmlYkUCM.', 'EMPLOYER', 'ACTIVE', 0, '2026-08-24 09:00:00', '2026-08-24 09:00:00'),
(29, 'hr@fintechpro.vn', '0918123459', '$2a$10$ZI4mUSszCLaHMJJ3LF7Ke.RII1hLS.taSVWFZI4jFaVdxmlYkUCM.', 'EMPLOYER', 'ACTIVE', 0, '2026-08-24 09:00:00', '2026-08-24 09:00:00'),
(30, 'recruit@dataworks.vn', '0918123460', '$2a$10$ZI4mUSszCLaHMJJ3LF7Ke.RII1hLS.taSVWFZI4jFaVdxmlYkUCM.', 'EMPLOYER', 'ACTIVE', 0, '2026-08-24 09:00:00', '2026-08-24 09:00:00'),
(31, 'hr@mobifirst.vn', '0918123461', '$2a$10$ZI4mUSszCLaHMJJ3LF7Ke.RII1hLS.taSVWFZI4jFaVdxmlYkUCM.', 'EMPLOYER', 'ACTIVE', 0, '2026-08-24 09:00:00', '2026-08-24 09:00:00'),
(32, 'jobs@ecomviet.vn', '0918123462', '$2a$10$ZI4mUSszCLaHMJJ3LF7Ke.RII1hLS.taSVWFZI4jFaVdxmlYkUCM.', 'EMPLOYER', 'ACTIVE', 0, '2026-08-24 09:00:00', '2026-08-24 09:00:00'),
(33, 'hr@smarthr.vn', '0918123463', '$2a$10$ZI4mUSszCLaHMJJ3LF7Ke.RII1hLS.taSVWFZI4jFaVdxmlYkUCM.', 'EMPLOYER', 'ACTIVE', 0, '2026-08-24 09:00:00', '2026-08-24 09:00:00'),
(34, 'tuyendung@logitrack.vn', '0918123464', '$2a$10$ZI4mUSszCLaHMJJ3LF7Ke.RII1hLS.taSVWFZI4jFaVdxmlYkUCM.', 'EMPLOYER', 'ACTIVE', 0, '2026-08-24 09:00:00', '2026-08-24 09:00:00'),
(35, 'hr@edutech.vn', '0918123465', '$2a$10$ZI4mUSszCLaHMJJ3LF7Ke.RII1hLS.taSVWFZI4jFaVdxmlYkUCM.', 'EMPLOYER', 'ACTIVE', 0, '2026-08-24 09:00:00', '2026-08-24 09:00:00');

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
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

--
-- AUTO_INCREMENT for table `candidate_activities`
--
ALTER TABLE `candidate_activities`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `candidate_awards`
--
ALTER TABLE `candidate_awards`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `candidate_certifications`
--
ALTER TABLE `candidate_certifications`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `candidate_educations`
--
ALTER TABLE `candidate_educations`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `candidate_experiences`
--
ALTER TABLE `candidate_experiences`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT for table `candidate_hobbies`
--
ALTER TABLE `candidate_hobbies`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT for table `candidate_languages`
--
ALTER TABLE `candidate_languages`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `candidate_profiles`
--
ALTER TABLE `candidate_profiles`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `candidate_profile_layouts`
--
ALTER TABLE `candidate_profile_layouts`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=155;

--
-- AUTO_INCREMENT for table `candidate_projects`
--
ALTER TABLE `candidate_projects`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `company_likes`
--
ALTER TABLE `company_likes`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `company_profiles`
--
ALTER TABLE `company_profiles`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `cv_documents`
--
ALTER TABLE `cv_documents`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `demo_products`
--
ALTER TABLE `demo_products`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `job_postings`
--
ALTER TABLE `job_postings`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT for table `reference_values`
--
ALTER TABLE `reference_values`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `reference_value_suggestions`
--
ALTER TABLE `reference_value_suggestions`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `saved_jobs`
--
ALTER TABLE `saved_jobs`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `system_logs`
--
ALTER TABLE `system_logs`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

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

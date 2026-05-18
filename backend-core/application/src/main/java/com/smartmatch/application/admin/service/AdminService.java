package com.smartmatch.application.admin.service;

import com.smartmatch.application.admin.dto.DashboardStatsResponse;
import com.smartmatch.application.admin.dto.SystemLogResponse;
import com.smartmatch.domain.job.model.JobStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Port (Use-case interface) cho Bounded Context Admin.
 * Lưu trữ nhật ký (Audit Log) và các chỉ số thống kê (Dashboard).
 */
public interface AdminService {

    /**
     * Lưu vết thao tác của người dùng/hệ thống vào database.
     * Phương thức này thường được gọi ngầm bởi các AOP/Interceptors.
     */
    void logAction(Long userId, String action, String details);

    /**
     * Xem danh sách nhật ký hệ thống (có phân trang, dành cho Admin).
     */
    Page<SystemLogResponse> getSystemLogs(Pageable pageable);

    /**
     * Xem danh sách nhật ký của một User cụ thể.
     */
    Page<SystemLogResponse> getLogsByUser(Long userId, Pageable pageable);

    /* * Lưu ý: Các thao tác như duyệt tin (Job), duyệt công ty (Employer), khóa tài khoản (Auth)
     * nên được định tuyến gọi đến các Service của Bounded Context tương ứng để đảm bảo tính DDD.
     */

    /**
     * Lấy các chỉ số tổng quan để hiển thị lên Dashboard Admin.
     */
    DashboardStatsResponse getDashboardStatistics();

    /**
     * Admin phê duyệt hoặc từ chối một tin tuyển dụng bị báo cáo hoặc đăng mới.
     * Thao tác này sẽ ghi log hệ thống tự động.
     */
    void moderateJobPosting(Long adminId, Long jobId, JobStatus newStatus, String reason);
}
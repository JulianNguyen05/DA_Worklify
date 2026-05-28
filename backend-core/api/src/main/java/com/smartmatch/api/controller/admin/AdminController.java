package com.smartmatch.api.controller.admin;

import com.smartmatch.api.common.response.ApiResponse;
import com.worklify.application.admin.dto.AdminJobResponse;
import com.worklify.application.admin.dto.CompanyModerationRequest;
import com.worklify.application.admin.dto.DashboardStatsResponse;
import com.worklify.application.admin.dto.JobModerationRequest;
import com.worklify.application.admin.service.AdminService;
import com.worklify.application.employer.dto.CompanyProfileResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List; // Thêm dòng này để sửa lỗi List

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
@Tag(name = "6. Admin Dashboard", description = "Quản trị hệ thống, Kiểm duyệt và Báo cáo")
@PreAuthorize("hasRole('ADMIN')") // Cực kỳ quan trọng: Khóa toàn bộ class này bằng role ADMIN
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/dashboard")
    @Operation(summary = "Lấy các chỉ số thống kê tổng quan (Dashboard)")
    public ApiResponse<DashboardStatsResponse> getStats() {
        return ApiResponse.success(adminService.getDashboardStats());
    }

// Đừng quên import DTO mới: import com.smartmatch.application.admin.dto.JobModerationRequest;

    @PatchMapping("/jobs/{jobId}/moderate")
    @Operation(summary = "Kiểm duyệt (Duyệt/Khóa) tin tuyển dụng")
    public ApiResponse<Void> moderateJob(
            @PathVariable("jobId") Long jobId,
            @RequestBody JobModerationRequest request) { // <-- Đổi sang RequestBody

        boolean isApprove = "APPROVED".equalsIgnoreCase(request.getAction());
        adminService.moderateJob(jobId, isApprove, request.getReason());

        return ApiResponse.success(null, "Đã xử lý tin tuyển dụng");
    }

    @PatchMapping("/users/{userId}/ban")
    @Operation(summary = "Khóa tài khoản người dùng vi phạm")
    public ApiResponse<Void> banUser(
            @PathVariable("userId") Long userId) { // <--- THÊM ("userId") VÀO ĐÂY
        adminService.banUser(userId);
        return ApiResponse.success(null, "Đã khóa tài khoản người dùng");
    }

    @GetMapping("/companies/pending")
    @Operation(summary = "Lấy danh sách doanh nghiệp đang chờ duyệt")
    public ApiResponse<List<CompanyProfileResponse>> getPendingCompanies() {
        return ApiResponse.success(adminService.getPendingCompanies());
    }

    @PatchMapping("/companies/{companyId}/moderate")
    @Operation(summary = "Duyệt hoặc từ chối hồ sơ doanh nghiệp")
    public ApiResponse<Void> moderateCompany(
            @PathVariable("companyId") Long companyId, // <--- THÊM ("companyId") VÀO ĐÂY
            @RequestBody CompanyModerationRequest request) {

        boolean isApprove = "APPROVED".equalsIgnoreCase(request.getAction());
        adminService.moderateCompany(companyId, isApprove, request.getReason());

        return ApiResponse.success(null, "Đã xử lý hồ sơ doanh nghiệp");
    }

    @GetMapping("/jobs/pending")
    @Operation(summary = "Lấy danh sách tin tuyển dụng đang chờ duyệt")
    public ApiResponse<List<AdminJobResponse>> getPendingJobs() {
        return ApiResponse.success(adminService.getPendingJobs());
    }
}
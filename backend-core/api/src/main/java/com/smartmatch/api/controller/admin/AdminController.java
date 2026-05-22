package com.smartmatch.api.controller.admin;

import com.smartmatch.api.common.response.ApiResponse;
import com.smartmatch.application.admin.dto.DashboardStatsResponse;
import com.smartmatch.application.admin.service.AdminService;
import com.smartmatch.domain.job.model.JobStatus;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

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

    @PatchMapping("/jobs/{jobId}/moderate")
    @Operation(summary = "Kiểm duyệt (Duyệt/Khóa) tin tuyển dụng")
    public ApiResponse<Void> moderateJob(
            @PathVariable Long jobId,
            @RequestParam JobStatus status) {
        adminService.moderateJob(jobId, status);
        return ApiResponse.success(null, "Đã cập nhật trạng thái tin tuyển dụng");
    }

    @PatchMapping("/users/{userId}/ban")
    @Operation(summary = "Khóa tài khoản người dùng vi phạm")
    public ApiResponse<Void> banUser(@PathVariable Long userId) {
        adminService.banUser(userId);
        return ApiResponse.success(null, "Đã khóa tài khoản người dùng");
    }
}
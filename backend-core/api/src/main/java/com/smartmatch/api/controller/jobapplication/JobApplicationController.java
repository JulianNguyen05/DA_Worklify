package com.smartmatch.api.controller.jobapplication;

import com.smartmatch.api.common.response.ApiResponse;
import com.smartmatch.application.common.dto.PageResponse;
import com.smartmatch.application.jobapplication.dto.AiMatchScoreResponse;
import com.smartmatch.application.jobapplication.dto.ApplicationRequest;
import com.smartmatch.application.jobapplication.dto.ApplicationResponse;
import com.smartmatch.application.jobapplication.service.JobApplicationService;
import com.worklify.domain.application.model.ApplicationStatus;
import com.worklify.domain.common.DomainPageable;
import com.worklify.domain.common.SearchPageable;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/applications")
@RequiredArgsConstructor
@Tag(name = "5. Applications & AI", description = "Quản lý nộp hồ sơ và Chấm điểm AI")
public class JobApplicationController {

    private final JobApplicationService applicationService;

    @PostMapping("/candidates/{candidateId}")
    @PreAuthorize("hasRole('CANDIDATE')")
    @Operation(summary = "Nộp hồ sơ ứng tuyển (Tự động kích hoạt AI chấm điểm)")
    public ApiResponse<ApplicationResponse> apply(
            @PathVariable("candidateId") Long candidateId,
            @Valid @RequestBody ApplicationRequest request) {
        return ApiResponse.success(applicationService.applyJob(candidateId, request), "Nộp hồ sơ thành công");
    }

    // ==================== ĐOẠN CODE BỔ SUNG THIẾU SÓT Ở ĐÂY ====================
    @GetMapping("/candidates/{candidateId}")
    @PreAuthorize("hasRole('CANDIDATE') or hasRole('ADMIN')")
    @Operation(summary = "Ứng viên xem lịch sử danh sách đơn ứng tuyển của chính mình")
    public ApiResponse<PageResponse<ApplicationResponse>> getApplicationsByCandidate(
            @PathVariable("candidateId") Long candidateId,
            @RequestParam(value = "page", defaultValue = "0") int page, // Thêm value = "page"
            @RequestParam(value = "size", defaultValue = "10") int size) { // Thêm value = "size"
        return ApiResponse.success(applicationService.getApplicationsByCandidate(candidateId, createPageable(page, size)), "Tải danh sách đơn ứng tuyển thành công");
    }
    // =========================================================================

    @GetMapping("/jobs/{jobId}/review-board")
    @PreAuthorize("hasRole('EMPLOYER') or hasRole('ADMIN')")
    @Operation(summary = "Hội đồng đánh giá xem danh sách hồ sơ (Đã ẩn danh)")
    public ApiResponse<PageResponse<ApplicationResponse>> getApplicationsForJob(
            @PathVariable("jobId") Long jobId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ApiResponse.success(applicationService.getApplicationsForReviewBoard(jobId, createPageable(page, size)));
    }

    @GetMapping("/{applicationId}/ai-score")
    @PreAuthorize("hasRole('EMPLOYER') or hasRole('CANDIDATE')")
    @Operation(summary = "Xem kết quả chấm điểm độ phù hợp của AI")
    public ApiResponse<AiMatchScoreResponse> getAiScore(
            @PathVariable("applicationId") Long applicationId) {
        return ApiResponse.success(applicationService.getAiMatchResult(applicationId));
    }

    @PatchMapping("/employers/{companyId}/{applicationId}/status")
    @PreAuthorize("hasRole('EMPLOYER')")
    @Operation(summary = "Cập nhật trạng thái hồ sơ (Duyệt/Loại)")
    public ApiResponse<Void> updateStatus(
            @PathVariable("companyId") Long companyId,
            @PathVariable("applicationId") Long applicationId,
            @RequestParam ApplicationStatus status) {
        applicationService.updateApplicationStatus(companyId, applicationId, status);
        return ApiResponse.success(null, "Cập nhật trạng thái thành công");
    }

    private DomainPageable createPageable(int page, int size) {
        return new SearchPageable(page, size);
    }
}
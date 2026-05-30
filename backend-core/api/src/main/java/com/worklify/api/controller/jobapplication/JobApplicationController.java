package com.worklify.api.controller.jobapplication;

import com.worklify.api.common.response.ApiResponse;
import com.worklify.application.common.dto.PageResponse;
import com.worklify.application.jobapplication.dto.ApplicationRequest;
import com.worklify.application.jobapplication.dto.ApplicationResponse;
import com.worklify.application.jobapplication.service.JobApplicationService;
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
@Tag(name = "5. Applications", description = "Quản lý nộp hồ sơ")
public class JobApplicationController {

    private final JobApplicationService applicationService;

    @PostMapping("/candidates/{candidateId}")
    @PreAuthorize("hasRole('CANDIDATE')")
    @Operation(summary = "Nộp hồ sơ ứng tuyển")
    public ApiResponse<ApplicationResponse> apply(
            @PathVariable("candidateId") Long candidateId,
            @Valid @RequestBody ApplicationRequest request) {
        return ApiResponse.success(applicationService.applyJob(candidateId, request), "Nộp hồ sơ thành công");
    }

    @GetMapping("/candidates/{candidateId}")
    @PreAuthorize("hasRole('CANDIDATE') or hasRole('ADMIN')")
    @Operation(summary = "Ứng viên xem lịch sử danh sách đơn ứng tuyển của chính mình")
    public ApiResponse<PageResponse<ApplicationResponse>> getApplicationsByCandidate(
            @PathVariable("candidateId") Long candidateId,
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "10") int size) {
        return ApiResponse.success(applicationService.getApplicationsByCandidate(candidateId, createPageable(page, size)), "Tải danh sách đơn ứng tuyển thành công");
    }

    @GetMapping("/jobs/{jobId}/review-board")
    @PreAuthorize("hasRole('EMPLOYER') or hasRole('ADMIN')")
    @Operation(summary = "Hội đồng đánh giá xem danh sách hồ sơ (Đã ẩn danh)")
    public ApiResponse<PageResponse<ApplicationResponse>> getApplicationsForJob(
            @PathVariable("jobId") Long jobId,
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "10") int size) {
        return ApiResponse.success(applicationService.getApplicationsForReviewBoard(jobId, createPageable(page, size)));
    }

    @PatchMapping("/employers/{companyId}/{applicationId}/status")
    @PreAuthorize("hasRole('EMPLOYER')")
    @Operation(summary = "Cập nhật trạng thái hồ sơ (Duyệt/Loại)")
    public ApiResponse<Void> updateStatus(
            @PathVariable("companyId") Long companyId,
            @PathVariable("applicationId") Long applicationId,
            @RequestParam(name = "status") ApplicationStatus status) {
        applicationService.updateApplicationStatus(companyId, applicationId, status);
        return ApiResponse.success(null, "Cập nhật trạng thái thành công");
    }

    private DomainPageable createPageable(int page, int size) {
        return new SearchPageable(page, size);
    }
}
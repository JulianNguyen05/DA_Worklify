package com.worklify.api.controller.jobapplication;

import com.worklify.api.common.response.ApiResponse;
import com.worklify.application.common.dto.PageResponse;
import com.worklify.application.common.security.AccessControlService;
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

import java.security.Principal;

@RestController
@RequestMapping("/api/v1/applications")
@RequiredArgsConstructor
@Tag(name = "5. Applications", description = "Quản lý nộp hồ sơ")
public class JobApplicationController {

    private final JobApplicationService applicationService;
    private final AccessControlService accessControlService;

    @PostMapping("/candidates/{candidateId}")
    @PreAuthorize("hasRole('CANDIDATE') and @accessControl.isSelf(#candidateId, authentication.name)")
    @Operation(summary = "Nộp hồ sơ ứng tuyển (chặn nộp trùng, tin đã đóng/hết hạn, CV không phải của mình)")
    public ApiResponse<ApplicationResponse> apply(
            @PathVariable("candidateId") Long candidateId,
            @Valid @RequestBody ApplicationRequest request) {
        return ApiResponse.success(applicationService.applyJob(candidateId, request), "Nộp hồ sơ thành công");
    }

    @GetMapping("/candidates/{candidateId}")
    @PreAuthorize("hasRole('ADMIN') or (hasRole('CANDIDATE') and @accessControl.isSelf(#candidateId, authentication.name))")
    @Operation(summary = "Ứng viên xem lịch sử danh sách đơn ứng tuyển của chính mình")
    public ApiResponse<PageResponse<ApplicationResponse>> getApplicationsByCandidate(
            @PathVariable("candidateId") Long candidateId,
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "10") int size) {
        return ApiResponse.success(applicationService.getApplicationsByCandidate(candidateId, createPageable(page, size)), "Tải danh sách đơn ứng tuyển thành công");
    }

    @GetMapping("/jobs/{jobId}/review-board")
    @PreAuthorize("hasRole('ADMIN') or (hasRole('EMPLOYER') and @accessControl.ownsJob(#jobId, authentication.name))")
    @Operation(summary = "Nhà tuyển dụng xem danh sách hồ sơ ứng tuyển của tin mình đăng")
    public ApiResponse<PageResponse<ApplicationResponse>> getApplicationsForJob(
            @PathVariable("jobId") Long jobId,
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "10") int size) {
        return ApiResponse.success(applicationService.getApplicationsForReviewBoard(jobId, createPageable(page, size)));
    }

    @PatchMapping("/employers/{companyId}/{applicationId}/status")
    @PreAuthorize("hasRole('EMPLOYER') and @accessControl.ownsCompany(#companyId, authentication.name)")
    @Operation(summary = "Cập nhật trạng thái hồ sơ theo quy trình PENDING → REVIEWED → INTERVIEW_SCHEDULED → ACCEPTED/REJECTED")
    public ApiResponse<ApplicationResponse> updateStatus(
            @PathVariable("companyId") Long companyId,
            @PathVariable("applicationId") Long applicationId,
            @RequestParam(name = "status") ApplicationStatus status) {
        return ApiResponse.success(applicationService.updateApplicationStatus(companyId, applicationId, status),
                "Cập nhật trạng thái thành công");
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @accessControl.canViewApplication(#id, authentication.name)")
    @Operation(summary = "Xem chi tiết 1 đơn ứng tuyển (ứng viên nộp đơn, nhà tuyển dụng của tin, hoặc admin)")
    public ApiResponse<ApplicationResponse> getApplicationById(@PathVariable("id") Long id) {
        return ApiResponse.success(applicationService.getApplicationById(id));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('CANDIDATE')")
    @Operation(summary = "Ứng viên rút hồ sơ (chỉ khi nhà tuyển dụng chưa xem xét)")
    public ApiResponse<Void> withdraw(@PathVariable("id") Long id, Principal principal) {
        applicationService.withdrawApplication(accessControlService.requireUserId(principal.getName()), id);
        return ApiResponse.success(null, "Đã rút hồ sơ ứng tuyển");
    }

    private DomainPageable createPageable(int page, int size) {
        return new SearchPageable(Math.max(page, 0), Math.min(Math.max(size, 1), 100));
    }
}

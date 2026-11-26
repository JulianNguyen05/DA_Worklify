package com.worklify.api.controller.job;

import com.worklify.api.common.response.ApiResponse;
import com.worklify.application.common.dto.PageResponse;
import com.worklify.application.job.dto.JobPostingRequest;
import com.worklify.application.job.dto.JobPostingResponse;
import com.worklify.application.job.service.JobService;
import com.worklify.domain.common.DomainPageable;
import com.worklify.domain.common.SearchPageable;
import com.worklify.domain.job.model.JobSearchFilter;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/v1/jobs")
@RequiredArgsConstructor
@Tag(name = "4. Job Postings", description = "Quản lý và Tìm kiếm Tin tuyển dụng")
public class JobController {

    private static final String OWNS_COMPANY =
            "hasRole('EMPLOYER') and @accessControl.ownsCompany(#companyId, authentication.name)";

    private final JobService jobService;

    @PostMapping("/employers/{companyId}")
    @PreAuthorize(OWNS_COMPANY)
    @Operation(summary = "Nhà tuyển dụng đăng tin tuyển dụng mới")
    public ApiResponse<JobPostingResponse> createJob(
            @PathVariable("companyId") Long companyId,
            @Valid @RequestBody JobPostingRequest request) {
        return ApiResponse.success(jobService.createJobPosting(companyId, request), "Đăng tin chờ duyệt thành công");
    }

    @GetMapping("/search")
    @Operation(summary = "Khách/Ứng viên tìm kiếm việc làm (chỉ tin đang mở và còn hạn nộp)")
    public ApiResponse<PageResponse<JobPostingResponse>> searchJobs(
            @RequestParam(name = "keyword", required = false) String keyword,
            @RequestParam(name = "location", required = false) String location,
            @RequestParam(name = "workType", required = false) String workType,
            @RequestParam(name = "salaryMin", required = false) Integer salaryMin,
            @RequestParam(name = "salaryMax", required = false) Integer salaryMax,
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "10") int size) {

        JobSearchFilter filter = new JobSearchFilter(keyword, location, workType, salaryMin, salaryMax);
        return ApiResponse.success(jobService.searchJobs(filter, createPageable(page, size)));
    }

    @GetMapping("/{jobId}")
    @Operation(summary = "Xem chi tiết tin tuyển dụng (tin chưa duyệt/bị từ chối chỉ chủ tin và admin xem được)")
    public ApiResponse<JobPostingResponse> getJobDetail(@PathVariable("jobId") Long jobId, Principal principal) {
        return ApiResponse.success(jobService.getJobForViewer(jobId, principal != null ? principal.getName() : null));
    }

    @GetMapping("/employers/{companyId}")
    @PreAuthorize(OWNS_COMPANY)
    @Operation(summary = "Lấy danh sách tin tuyển dụng của doanh nghiệp")
    public ApiResponse<PageResponse<JobPostingResponse>> getMyJobs(
            @PathVariable("companyId") Long companyId,
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "10") int size) {
        return ApiResponse.success(jobService.getJobsByCompany(companyId, createPageable(page, size)));
    }

    @PutMapping("/employers/{companyId}/{jobId}")
    @PreAuthorize(OWNS_COMPANY)
    @Operation(summary = "Nhà tuyển dụng chỉnh sửa tin tuyển dụng (tin sẽ chờ duyệt lại)")
    public ApiResponse<JobPostingResponse> updateJob(
            @PathVariable("companyId") Long companyId,
            @PathVariable("jobId") Long jobId,
            @Valid @RequestBody JobPostingRequest request) {
        return ApiResponse.success(jobService.updateJobPosting(companyId, jobId, request), "Cập nhật tin thành công");
    }

    @PatchMapping("/employers/{companyId}/{jobId}/close")
    @PreAuthorize(OWNS_COMPANY)
    @Operation(summary = "Nhà tuyển dụng đóng tin tuyển dụng (ngừng nhận hồ sơ)")
    public ApiResponse<JobPostingResponse> closeJob(
            @PathVariable("companyId") Long companyId,
            @PathVariable("jobId") Long jobId) {
        return ApiResponse.success(jobService.closeJobPosting(companyId, jobId), "Đã đóng tin tuyển dụng");
    }

    @GetMapping("/public/employers/{companyId}")
    @Operation(summary = "Khách/Ứng viên xem danh sách việc làm đang tuyển của doanh nghiệp")
    public ApiResponse<PageResponse<JobPostingResponse>> getPublicJobsByCompany(
            @PathVariable("companyId") Long companyId,
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "10") int size) {
        return ApiResponse.success(jobService.getPublicJobsByCompany(companyId, createPageable(page, size)));
    }

    private DomainPageable createPageable(int page, int size) {
        return new SearchPageable(Math.max(page, 0), Math.min(Math.max(size, 1), 100));
    }
}

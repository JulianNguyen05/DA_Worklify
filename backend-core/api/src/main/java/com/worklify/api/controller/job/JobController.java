package com.worklify.api.controller.job;

import com.worklify.api.common.response.ApiResponse;
import com.worklify.application.common.dto.PageResponse;
import com.worklify.application.job.dto.JobPostingRequest;
import com.worklify.application.job.dto.JobPostingResponse;
import com.worklify.application.job.service.JobService;
import com.worklify.domain.common.DomainPageable;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest; // BỔ SUNG IMPORT NÀY
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/jobs")
@RequiredArgsConstructor
@Tag(name = "4. Job Postings", description = "Quản lý và Tìm kiếm Tin tuyển dụng")
public class JobController {

    private final JobService jobService;

    @PostMapping("/employers/{companyId}")
    @PreAuthorize("hasRole('EMPLOYER')")
    @Operation(summary = "Nhà tuyển dụng đăng tin tuyển dụng mới")
    public ApiResponse<JobPostingResponse> createJob(
            @PathVariable("companyId") Long companyId,
            @Valid @RequestBody JobPostingRequest request) {
        return ApiResponse.success(jobService.createJobPosting(companyId, request), "Đăng tin chờ duyệt thành công");
    }

    @GetMapping("/search")
    @Operation(summary = "Khách/Ứng viên tìm kiếm việc làm")
    public ApiResponse<PageResponse<JobPostingResponse>> searchJobs(
            @RequestParam(name = "keyword", required = false) String keyword,
            @RequestParam(name = "location", required = false) String location,
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "10") int size) {

        DomainPageable pageable = createPageable(page, size);
        return ApiResponse.success(jobService.searchJobs(keyword, location, pageable));
    }

    @GetMapping("/{jobId}")
    @Operation(summary = "Xem chi tiết tin tuyển dụng")
    public ApiResponse<JobPostingResponse> getJobDetail(@PathVariable("jobId") Long jobId) {
        return ApiResponse.success(jobService.getJobById(jobId));
    }

    @GetMapping("/employers/{companyId}")
    @PreAuthorize("hasRole('EMPLOYER')")
    @Operation(summary = "Lấy danh sách tin tuyển dụng của doanh nghiệp")
    public ApiResponse<PageResponse<JobPostingResponse>> getMyJobs(
            @PathVariable("companyId") Long companyId,
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "10") int size) {

        DomainPageable pageable = createPageable(page, size);
        return ApiResponse.success(jobService.getJobsByCompany(companyId, pageable));
    }

    @PutMapping("/employers/{companyId}/{jobId}")
    @PreAuthorize("hasRole('EMPLOYER')")
    @Operation(summary = "Nhà tuyển dụng chỉnh sửa tin tuyển dụng")
    public ApiResponse<JobPostingResponse> updateJob(
            @PathVariable("companyId") Long companyId,
            @PathVariable("jobId") Long jobId,
            @Valid @RequestBody JobPostingRequest request) {
        return ApiResponse.success(jobService.updateJobPosting(companyId, jobId, request), "Cập nhật tin thành công");
    }

    // ==========================================================
    // SỬA LỖI BIÊN DỊCH: Ghi đè phương thức toSpringPageable()
    // ==========================================================
    private DomainPageable createPageable(int page, int size) {
        return new DomainPageable() {
            @Override
            public int getPageNumber() {
                return page;
            }

            @Override
            public int getPageSize() {
                return size;
            }

            @Override
            public org.springframework.data.domain.Pageable toSpringPageable() {
                // Ánh xạ sang lớp cấu trúc phân trang của Spring Data
                return PageRequest.of(page, size);
            }
        };
    }
}
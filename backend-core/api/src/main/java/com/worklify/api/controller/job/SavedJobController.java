package com.worklify.api.controller.job;

import com.worklify.api.common.response.ApiResponse;
import com.worklify.application.common.dto.PageResponse;
import com.worklify.application.common.security.AccessControlService;
import com.worklify.application.job.dto.SavedJobResponse;
import com.worklify.application.job.service.JobService;
import com.worklify.domain.common.SearchPageable;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

/** Ứng viên lưu tin để xem lại. Người dùng lấy từ JWT, không nhận userId từ client. */
@RestController
@RequestMapping("/api/v1/saved-jobs")
@RequiredArgsConstructor
@Tag(name = "4b. Saved Jobs", description = "Ứng viên lưu / bỏ lưu tin tuyển dụng")
@PreAuthorize("hasRole('CANDIDATE')")
public class SavedJobController {

    private final JobService jobService;
    private final AccessControlService accessControlService;

    @GetMapping
    @Operation(summary = "Danh sách tin đã lưu của ứng viên (mới lưu trước)")
    public ApiResponse<PageResponse<SavedJobResponse>> getSavedJobs(
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "10") int size,
            Principal principal) {
        Long userId = accessControlService.requireUserId(principal.getName());
        return ApiResponse.success(jobService.getSavedJobsByCandidate(userId,
                new SearchPageable(Math.max(page, 0), Math.min(Math.max(size, 1), 100))));
    }

    @GetMapping("/ids")
    @Operation(summary = "Danh sách id các tin đã lưu (để đánh dấu nút Lưu tin)")
    public ApiResponse<List<Long>> getSavedJobIds(Principal principal) {
        Long userId = accessControlService.requireUserId(principal.getName());
        return ApiResponse.success(jobService.getSavedJobIds(userId));
    }

    @PostMapping("/{jobId}")
    @Operation(summary = "Lưu một tin tuyển dụng")
    public ApiResponse<Void> saveJob(@PathVariable("jobId") Long jobId, Principal principal) {
        Long userId = accessControlService.requireUserId(principal.getName());
        jobService.saveJobForCandidate(userId, jobId);
        return ApiResponse.success(null, "Đã lưu tin tuyển dụng");
    }

    @DeleteMapping("/{jobId}")
    @Operation(summary = "Bỏ lưu một tin tuyển dụng")
    public ApiResponse<Void> unsaveJob(@PathVariable("jobId") Long jobId, Principal principal) {
        Long userId = accessControlService.requireUserId(principal.getName());
        jobService.unsaveJobForCandidate(userId, jobId);
        return ApiResponse.success(null, "Đã bỏ lưu tin tuyển dụng");
    }
}

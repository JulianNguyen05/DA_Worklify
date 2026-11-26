package com.worklify.api.controller.matching;

import com.worklify.api.common.response.ApiResponse;
import com.worklify.application.matching.dto.ApplicationMatchResponse;
import com.worklify.application.matching.dto.CvJdScoreResponse;
import com.worklify.application.matching.service.MatchingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.List;

/**
 * Người dùng được xác định từ JWT (principal.getName() = email), không nhận userId từ client,
 * để ứng viên/nhà tuyển dụng không xem được dữ liệu của người khác.
 */
@RestController
@RequestMapping("/api/v1/matching")
@RequiredArgsConstructor
@Tag(name = "7. AI Matching", description = "Chấm điểm mức độ phù hợp CV–JD bằng AI (backend-ml)")
public class MatchingController {

    private final MatchingService matchingService;

    @GetMapping("/jobs/{jobId}/me")
    @PreAuthorize("hasRole('CANDIDATE')")
    @Operation(summary = "Ứng viên xem mức độ phù hợp của hồ sơ mình với một tin tuyển dụng")
    public ApiResponse<CvJdScoreResponse> scoreMyProfileForJob(
            @PathVariable("jobId") Long jobId, Principal principal) {
        return ApiResponse.success(matchingService.scoreCandidateForJob(principal.getName(), jobId));
    }

    @GetMapping("/jobs/{jobId}/applications")
    @PreAuthorize("hasRole('EMPLOYER')")
    @Operation(summary = "Nhà tuyển dụng xếp hạng các hồ sơ ứng tuyển của tin tuyển dụng theo điểm phù hợp AI")
    public ApiResponse<List<ApplicationMatchResponse>> rankApplicationsForJob(
            @PathVariable("jobId") Long jobId, Principal principal) {
        return ApiResponse.success(matchingService.rankApplicationsForJob(principal.getName(), jobId));
    }
}

package com.worklify.api.controller.matching;

import com.worklify.api.common.response.ApiResponse;
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

@RestController
@RequestMapping("/api/v1/matching")
@RequiredArgsConstructor
@Tag(name = "7. AI Matching", description = "Chấm điểm mức độ phù hợp CV–JD bằng AI (backend-ml)")
public class MatchingController {

    private final MatchingService matchingService;

    @GetMapping("/candidates/{userId}/jobs/{jobId}")
    @PreAuthorize("hasRole('CANDIDATE')")
    @Operation(summary = "Ứng viên xem mức độ phù hợp của hồ sơ mình với một tin tuyển dụng")
    public ApiResponse<CvJdScoreResponse> scoreCandidateForJob(
            @PathVariable("userId") Long userId,
            @PathVariable("jobId") Long jobId) {
        return ApiResponse.success(matchingService.scoreCandidateForJob(userId, jobId));
    }
}

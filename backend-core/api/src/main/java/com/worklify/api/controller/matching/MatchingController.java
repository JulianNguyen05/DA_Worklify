package com.worklify.api.controller.matching;

import com.worklify.api.common.response.ApiResponse;
import com.worklify.application.matching.dto.ApplicationMatchResponse;
import com.worklify.application.matching.dto.ApplyCvSuggestionRequest;
import com.worklify.application.matching.dto.CvAdviceResponse;
import com.worklify.application.matching.dto.CvJdScoreResponse;
import com.worklify.application.matching.service.MatchingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
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

    // POST vì mỗi lần gọi là một lượt chạy LLM tốn 1-2 phút, không phải đọc dữ liệu có sẵn.
    @PostMapping("/jobs/{jobId}/me/advice")
    @PreAuthorize("hasRole('CANDIDATE')")
    @Operation(summary = "Agent AI gợi ý viết lại hồ sơ của ứng viên cho sát tin tuyển dụng (có thể mất 1-2 phút)")
    public ApiResponse<CvAdviceResponse> adviseMyProfileForJob(
            @PathVariable("jobId") Long jobId, Principal principal) {
        return ApiResponse.success(matchingService.adviseCandidateForJob(principal.getName(), jobId));
    }

    @PostMapping("/me/suggestions/apply")
    @PreAuthorize("hasRole('CANDIDATE')")
    @Operation(summary = "Ứng viên áp dụng một gợi ý của agent vào hồ sơ của mình")
    public ApiResponse<Void> applySuggestion(
            @Valid @RequestBody ApplyCvSuggestionRequest request, Principal principal) {
        matchingService.applySuggestion(principal.getName(), request);
        return ApiResponse.success(null, "Đã cập nhật hồ sơ theo gợi ý");
    }
}

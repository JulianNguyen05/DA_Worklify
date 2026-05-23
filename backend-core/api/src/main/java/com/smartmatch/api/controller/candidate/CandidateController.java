package com.smartmatch.api.controller.candidate;

import com.smartmatch.api.common.response.ApiResponse;
import com.smartmatch.application.candidate.dto.*;
import com.smartmatch.application.candidate.service.CandidateService;
import com.smartmatch.application.common.dto.FileData;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/v1/candidates")
@RequiredArgsConstructor
@Tag(name = "2. Candidate", description = "Quản lý hồ sơ và CV của Ứng viên")
@PreAuthorize("hasRole('CANDIDATE')")
public class CandidateController {

    private final CandidateService candidateService;

    // ==========================================
    // 1. QUẢN LÝ THÔNG TIN CÁ NHÂN (PROFILE)
    // ==========================================
    @PostMapping("/{userId}/profile")
    @Operation(summary = "Tạo mới hoặc cập nhật hồ sơ năng lực ứng viên")
    public ApiResponse<CandidateProfileResponse> createOrUpdateProfile(
            @PathVariable("userId") Long userId,
            @Valid @RequestBody CandidateProfileRequest request) {
        return ApiResponse.success(candidateService.createProfile(userId, request));
    }

    @GetMapping("/{userId}/profile")
    @Operation(summary = "Lấy thông tin hồ sơ ứng viên")
    public ApiResponse<CandidateProfileResponse> getProfile(@PathVariable("userId") Long userId) {
        return ApiResponse.success(candidateService.getProfileByUserId(userId));
    }

    // ==========================================
    // 2. QUẢN LÝ KỸ NĂNG (SKILLS) - [MỚI BỔ SUNG]
    // ==========================================
    @GetMapping("/{userId}/skills")
    @Operation(summary = "Lấy danh sách kỹ năng của ứng viên")
    public ApiResponse<List<CandidateSkillResponse>> getSkills(@PathVariable("userId") Long userId) {
        return ApiResponse.success(candidateService.getSkillsByUserId(userId));
    }

    @PostMapping("/{userId}/skills")
    @Operation(summary = "Thêm kỹ năng mới cho ứng viên")
    public ApiResponse<CandidateSkillResponse> createSkill(
            @PathVariable("userId") Long userId,
            @Valid @RequestBody CandidateSkillRequest request) {
        return ApiResponse.success(candidateService.createSkill(userId, request));
    }

    @PutMapping("/{userId}/skills/{skillId}")
    @Operation(summary = "Cập nhật kỹ năng của ứng viên")
    public ApiResponse<CandidateSkillResponse> updateSkill(
            @PathVariable("userId") Long userId,
            @PathVariable("skillId") Long skillId,
            @Valid @RequestBody CandidateSkillRequest request) {
        return ApiResponse.success(candidateService.updateSkill(userId, skillId, request));
    }

    // ==========================================
    // 3. QUẢN LÝ CV (FILE & SANDBOX)
    // ==========================================
    @PostMapping(value = "/{userId}/cvs", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Tải lên CV (PDF/Word)")
    public ApiResponse<CvDocumentResponse> uploadCv(
            @PathVariable("userId") Long userId,
            @RequestParam("file") MultipartFile file) throws IOException {

        FileData fileData = new FileData(
                file.getOriginalFilename(),
                file.getInputStream(),
                file.getSize(),
                file.getContentType()
        );

        return ApiResponse.success(candidateService.uploadCv(userId, fileData), "Tải CV lên thành công");
    }

    @GetMapping("/{userId}/cvs")
    @Operation(summary = "Lấy danh sách CV PDF/Word đã lưu của ứng viên")
    public ApiResponse<List<CvDocumentResponse>> getCvs(@PathVariable("userId") Long userId) {
        return ApiResponse.success(candidateService.getCvsByUserId(userId));
    }

    @PostMapping("/{userId}/cvs/generated")
    @Operation(summary = "Lưu cấu trúc CV tạo từ Sandbox (JSON)")
    public ApiResponse<CvDocumentResponse> saveGeneratedCv(
            @PathVariable("userId") Long userId,
            @Valid @RequestBody GeneratedCvRequest request) {
        return ApiResponse.success(candidateService.saveGeneratedCv(userId, request.getRawText()), "Lưu bản thảo CV thành công");
    }

    @GetMapping("/{userId}/cvs/generated/latest")
    @Operation(summary = "Lấy bản thảo CV Sandbox mới nhất")
    public ApiResponse<CvDocumentResponse> getLatestGeneratedCv(@PathVariable("userId") Long userId) {
        return ApiResponse.success(candidateService.getLatestGeneratedCv(userId));
    }
}
package com.smartmatch.api.controller.candidate;

import com.smartmatch.api.common.response.ApiResponse;
import com.smartmatch.application.candidate.dto.CandidateProfileRequest;
import com.smartmatch.application.candidate.dto.CandidateProfileResponse;
import com.smartmatch.application.candidate.dto.CvDocumentResponse;
import com.smartmatch.application.candidate.dto.GeneratedCvRequest;
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
@PreAuthorize("hasRole('CANDIDATE')") // ĐÃ SỬA: Chuyển từ hasAuthority sang hasRole để khớp với cấu hình hệ thống
public class CandidateController {

    private final CandidateService candidateService;

    @PostMapping("/{userId}/profile")
    @Operation(summary = "Tạo mới hồ sơ năng lực ứng viên")
    public ApiResponse<CandidateProfileResponse> createProfile(
            @PathVariable("userId") Long userId,
            @Valid @RequestBody CandidateProfileRequest request) {
        return ApiResponse.success(candidateService.createProfile(userId, request));
    }

    @GetMapping("/{userId}/profile")
    @Operation(summary = "Lấy thông tin hồ sơ ứng viên")
    public ApiResponse<CandidateProfileResponse> getProfile(@PathVariable("userId") Long userId) {
        return ApiResponse.success(candidateService.getProfileByUserId(userId));
    }

    @PostMapping(value = "/{userId}/cvs", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Tải lên CV (PDF/Word)")
    public ApiResponse<CvDocumentResponse> uploadCv(
            @PathVariable("userId") Long userId,
            @RequestParam("file") MultipartFile file) throws IOException {

        // Chuyển đổi MultipartFile sang DTO FileData không phụ thuộc Framework cho tầng Application
        FileData fileData = new FileData(
                file.getOriginalFilename(),
                file.getInputStream(),
                file.getSize(),
                file.getContentType()
        );

        return ApiResponse.success(candidateService.uploadCv(userId, fileData), "Tải CV lên thành công");
    }

    @GetMapping("/{userId}/cvs")
    @Operation(summary = "Lấy danh sách CV đã lưu của ứng viên")
    public ApiResponse<List<CvDocumentResponse>> getCvs(@PathVariable("userId") Long userId) {
        return ApiResponse.success(candidateService.getCvsByUserId(userId));
    }

    @PostMapping("/{userId}/cvs/generated")
    @Operation(summary = "Lưu bản thảo CV tạo từ Sandbox (JSON)")
    public ApiResponse<CvDocumentResponse> saveGeneratedCv(
            @PathVariable("userId") Long userId,
            @Valid @RequestBody GeneratedCvRequest request) {

        return ApiResponse.success(candidateService.saveGeneratedCv(userId, request.getRawText()), "Lưu bản thảo CV thành công");
    }
}
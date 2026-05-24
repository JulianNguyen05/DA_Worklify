package com.smartmatch.api.controller.employer;

import com.smartmatch.api.common.response.ApiResponse;
import com.smartmatch.application.employer.dto.CompanyProfileRequest;
import com.smartmatch.application.employer.dto.CompanyProfileResponse;
import com.smartmatch.application.employer.service.EmployerService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/v1/employers")
@RequiredArgsConstructor
@Tag(name = "3. Employer", description = "Quản lý hồ sơ Doanh nghiệp")
public class EmployerController {

    private final EmployerService employerService;

    @PostMapping("/{userId}/profile")
    @PreAuthorize("hasRole('EMPLOYER')")
    @Operation(summary = "Tạo hồ sơ doanh nghiệp")
    public ApiResponse<CompanyProfileResponse> createProfile(
            @PathVariable("userId") Long userId, // <--- Đã sửa ở đây
            @Valid @RequestBody CompanyProfileRequest request) {
        return ApiResponse.success(employerService.createProfile(userId, request), "Tạo hồ sơ thành công");
    }

    @PutMapping("/{userId}/profile")
    @PreAuthorize("hasRole('EMPLOYER')")
    @Operation(summary = "Cập nhật hồ sơ doanh nghiệp")
    public ApiResponse<CompanyProfileResponse> updateProfile(
            @PathVariable("userId") Long userId, // <--- Đã sửa ở đây
            @Valid @RequestBody CompanyProfileRequest request) {
        return ApiResponse.success(employerService.updateProfile(userId, request), "Cập nhật hồ sơ thành công");
    }

    @GetMapping("/{userId}/profile")
    @Operation(summary = "Xem hồ sơ doanh nghiệp (Public/Private)")
    public ApiResponse<CompanyProfileResponse> getProfile(@PathVariable("userId") Long userId) { // <--- Đã sửa ở đây
        return ApiResponse.success(employerService.getProfileByUserId(userId));
    }

    @PostMapping(value = "/{userId}/logo", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('EMPLOYER')")
    @Operation(summary = "Tải lên logo doanh nghiệp")
    public ApiResponse<CompanyProfileResponse> uploadLogo(
            @PathVariable("userId") Long userId, // <--- Đã sửa ở đây
            @RequestPart("file") MultipartFile file) {
        return ApiResponse.success(employerService.uploadLogo(userId, file), "Tải lên logo thành công");
    }
}
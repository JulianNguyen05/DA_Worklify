package com.smartmatch.api.controller.employer;

import com.smartmatch.api.common.response.ApiResponse;
import com.smartmatch.application.employer.dto.CompanyProfileRequest;
import com.smartmatch.application.employer.dto.CompanyProfileResponse;
import com.smartmatch.application.employer.service.EmployerService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

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
            @PathVariable Long userId,
            @Valid @RequestBody CompanyProfileRequest request) {
        return ApiResponse.success(employerService.createProfile(userId, request));
    }

    @GetMapping("/{userId}/profile")
    @Operation(summary = "Xem hồ sơ doanh nghiệp (Public/Private)")
    public ApiResponse<CompanyProfileResponse> getProfile(@PathVariable Long userId) {
        return ApiResponse.success(employerService.getProfileByUserId(userId));
    }
}
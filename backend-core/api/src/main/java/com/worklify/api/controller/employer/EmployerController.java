package com.worklify.api.controller.employer;

import com.worklify.api.common.response.ApiResponse;
import com.worklify.application.common.dto.PageResponse;
import com.worklify.application.employer.dto.CompanyProfileRequest;
import com.worklify.application.employer.dto.CompanyProfileResponse;
import com.worklify.application.employer.service.EmployerService;
import com.worklify.domain.common.DomainPageable;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest; // BỔ SUNG IMPORT
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
            @PathVariable("userId") Long userId,
            @Valid @RequestBody CompanyProfileRequest request) {
        return ApiResponse.success(employerService.createProfile(userId, request), "Tạo hồ sơ thành công");
    }

    @PutMapping("/{userId}/profile")
    @PreAuthorize("hasRole('EMPLOYER')")
    @Operation(summary = "Cập nhật hồ sơ doanh nghiệp")
    public ApiResponse<CompanyProfileResponse> updateProfile(
            @PathVariable("userId") Long userId,
            @Valid @RequestBody CompanyProfileRequest request) {
        return ApiResponse.success(employerService.updateProfile(userId, request), "Cập nhật hồ sơ thành công");
    }

    @GetMapping("/{userId}/profile")
    @Operation(summary = "Xem hồ sơ doanh nghiệp (Public/Private)")
    public ApiResponse<CompanyProfileResponse> getProfile(@PathVariable("userId") Long userId) {
        return ApiResponse.success(employerService.getProfileByUserId(userId));
    }

    @PostMapping(value = "/{userId}/logo", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('EMPLOYER')")
    @Operation(summary = "Tải lên logo doanh nghiệp")
    public ApiResponse<CompanyProfileResponse> uploadLogo(
            @PathVariable("userId") Long userId,
            @RequestPart("file") MultipartFile file) {
        return ApiResponse.success(employerService.uploadLogo(userId, file), "Tải lên logo thành công");
    }

    @PostMapping("/{companyId}/like")
    @PreAuthorize("hasAnyRole('CANDIDATE', 'EMPLOYER', 'ADMIN')")
    @Operation(summary = "Thích / Bỏ thích công ty")
    public ApiResponse<Void> toggleLikeCompany(
            @PathVariable("companyId") Long companyId,
            @RequestParam("userId") Long userId) { // ĐÃ SỬA: Nhận trực tiếp userId từ Frontend

        employerService.toggleLikeCompany(userId, companyId);
        return ApiResponse.success(null, "Thao tác thả tim thành công");
    }

    @GetMapping
    @Operation(summary = "Lấy danh sách tất cả doanh nghiệp (Công ty nổi bật)")
    public ApiResponse<PageResponse<CompanyProfileResponse>> getAllEmployers(
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "5") int size,
            // THÊM DÒNG DƯỚI ĐÂY (required = false để khách vãng lai không đăng nhập vẫn xem được)
            @RequestParam(value = "userId", required = false) Long userId) {

        DomainPageable pageable = new DomainPageable() {
            @Override
            public int getPageNumber() { return page; }
            @Override
            public int getPageSize() { return size; }
            @Override
            public org.springframework.data.domain.Pageable toSpringPageable() {
                return PageRequest.of(page, size);
            }
        };

        // TRUYỀN THÊM userId VÀO SERVICE
        return ApiResponse.success(employerService.getAllProfiles(pageable, userId));
    }
}
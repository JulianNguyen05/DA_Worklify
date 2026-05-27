package com.smartmatch.api.controller.employer;

import com.smartmatch.api.common.response.ApiResponse;
import com.smartmatch.application.common.dto.PageResponse;
import com.smartmatch.application.employer.dto.CompanyProfileRequest;
import com.smartmatch.application.employer.dto.CompanyProfileResponse;
import com.smartmatch.application.employer.service.EmployerService;
import com.smartmatch.domain.common.DomainPageable;
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

    @GetMapping
    @Operation(summary = "Lấy danh sách tất cả doanh nghiệp (Công ty nổi bật)")
    public ApiResponse<PageResponse<CompanyProfileResponse>> getAllEmployers(
            @RequestParam(value = "page", defaultValue = "0") int page, // ĐÃ SỬA: Thêm value chỉ định tên tham số
            @RequestParam(value = "size", defaultValue = "5") int size) {  // ĐÃ SỬA: Thêm value chỉ định tên tham số

        // ĐÃ SỬA: Bổ sung override phương thức toSpringPageable() còn thiếu
        DomainPageable pageable = new DomainPageable() {
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
                // Trực tiếp map sang cấu trúc PageRequest của Spring Data
                return PageRequest.of(page, size);
            }
        };

        return ApiResponse.success(employerService.getAllProfiles(pageable));
    }
}
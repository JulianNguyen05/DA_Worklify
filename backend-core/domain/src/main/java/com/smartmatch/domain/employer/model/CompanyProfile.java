package com.smartmatch.domain.employer.model;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.util.Objects; // BỔ SUNG IMPORT NÀY

@Getter
@Builder
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class CompanyProfile {
    private Long id;
    private Long userId;
    private String companyName;
    private String logoUrl;
    private String website;
    private String description;
    private VerificationStatus verificationStatus;

    public static CompanyProfile createInitial(Long userId, String companyName, String website, String description) {
        if (userId == null || companyName == null || companyName.trim().isEmpty()) {
            throw new IllegalArgumentException("Thiếu thông tin bắt buộc để tạo hồ sơ công ty.");
        }
        return CompanyProfile.builder()
                .userId(userId)
                .companyName(companyName)
                .website(website)
                .description(description)
                .verificationStatus(VerificationStatus.PENDING)
                .build();
    }

    public void approve() { this.verificationStatus = VerificationStatus.APPROVED; }
    public void reject() { this.verificationStatus = VerificationStatus.REJECTED; }

    public void reviseProfile(String newCompanyName, String newWebsite, String newDescription) {
        // [NÂNG CẤP]: Bắt lỗi thay đổi ở cả Mô tả (Description)
        boolean requiresReverification = !Objects.equals(this.companyName, newCompanyName) ||
                !Objects.equals(this.website, newWebsite) ||
                !Objects.equals(this.description, newDescription);

        this.companyName = newCompanyName;
        this.website = newWebsite;
        this.description = newDescription;

        if (requiresReverification) {
            this.verificationStatus = VerificationStatus.PENDING;
        }
    }

    public void updateLogo(String newLogoUrl) {
        if (newLogoUrl == null || newLogoUrl.trim().isEmpty()) {
            throw new IllegalArgumentException("URL Logo không hợp lệ.");
        }
        // [NÂNG CẤP]: Cập nhật logo cũng phải chờ duyệt lại
        boolean requiresReverification = !Objects.equals(this.logoUrl, newLogoUrl);
        this.logoUrl = newLogoUrl;

        if (requiresReverification) {
            this.verificationStatus = VerificationStatus.PENDING;
        }
    }
}
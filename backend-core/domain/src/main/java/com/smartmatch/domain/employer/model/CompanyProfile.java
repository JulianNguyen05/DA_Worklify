package com.smartmatch.domain.employer.model;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

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

    /**
     * Factory method: Tạo hồ sơ lần đầu.
     */
    public static CompanyProfile createInitialProfile(Long userId, String companyName, String website, String description) {
        if (userId == null || companyName == null || companyName.trim().isEmpty()) {
            throw new IllegalArgumentException("Thiếu thông tin bắt buộc để tạo hồ sơ công ty.");
        }
        return CompanyProfile.builder()
                .userId(userId)
                .companyName(companyName)
                .website(website)
                .description(description)
                .verificationStatus(VerificationStatus.PENDING) // Luôn chờ duyệt lúc khởi tạo
                .build();
    }

    /**
     * Nghiệp vụ: Admin phê duyệt hồ sơ công ty.
     */
    public void approve() {
        this.verificationStatus = VerificationStatus.APPROVED;
    }

    /**
     * Nghiệp vụ: Admin từ chối hồ sơ công ty (kèm theo lý do xử lý ở tầng Application).
     */
    public void reject() {
        this.verificationStatus = VerificationStatus.REJECTED;
    }

    /**
     * Nghiệp vụ: Doanh nghiệp cập nhật hồ sơ.
     * Rule: Đổi thông tin quan trọng sẽ đưa trạng thái về PENDING.
     */
    public void reviseProfile(String newCompanyName, String newWebsite, String newDescription) {
        boolean requiresReverification = !this.companyName.equals(newCompanyName) ||
                (this.website != null && !this.website.equals(newWebsite));

        this.companyName = newCompanyName;
        this.website = newWebsite;
        this.description = newDescription;

        if (requiresReverification) {
            this.verificationStatus = VerificationStatus.PENDING;
        }
    }

    /**
     * Nghiệp vụ: Cập nhật logo. Thao tác này không cần kiểm duyệt lại toàn bộ.
     */
    public void updateLogo(String newLogoUrl) {
        if (newLogoUrl == null || newLogoUrl.trim().isEmpty()) {
            throw new IllegalArgumentException("URL Logo không hợp lệ.");
        }
        this.logoUrl = newLogoUrl;
    }
}
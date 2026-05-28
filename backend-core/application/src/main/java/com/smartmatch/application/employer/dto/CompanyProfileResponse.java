package com.smartmatch.application.employer.dto;

import com.smartmatch.domain.employer.model.VerificationStatus;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CompanyProfileResponse {
    private Long id;
    private Long userId;
    private String companyName;
    private String logoUrl;
    private String website;
    private String description;
    private VerificationStatus verificationStatus;
    private Integer likeCount;
    private Boolean isLiked;
    private Integer activeJobsCount;
}
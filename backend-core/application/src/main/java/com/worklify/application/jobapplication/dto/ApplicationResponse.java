package com.worklify.application.jobapplication.dto;

import com.worklify.domain.application.model.ApplicationStatus;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class ApplicationResponse {
    private Long id;
    private Long jobId;
    private Long cvId;
    private Long candidateId;
    private String coverLetter;
    private ApplicationStatus status;
    private LocalDateTime appliedAt;
    private String blindTestUrl;

    private String jobTitle;
    private String companyName;
    private String companyLogo;
    private String cvFileName;
    private String candidateName;
    private String candidateEmail;
    private String candidatePhone;
}
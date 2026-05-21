package com.smartmatch.application.candidate.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class CvDocumentResponse {
    private Long id;
    private Long candidateId;
    private String filePath;
    private Boolean isGenerated;
    private LocalDateTime createdAt;
}
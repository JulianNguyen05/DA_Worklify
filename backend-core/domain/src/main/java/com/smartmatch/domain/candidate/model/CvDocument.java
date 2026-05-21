package com.smartmatch.domain.candidate.model;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import java.time.LocalDateTime;

@Getter
@Builder
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class CvDocument {
    private Long id;
    private Long candidateId;
    private String filePath;
    private String rawText;
    private Boolean isGenerated;
    private LocalDateTime createdAt;

    public static CvDocument upload(Long candidateId, String filePath, String rawText) {
        return CvDocument.builder()
                .candidateId(candidateId)
                .filePath(filePath)
                .rawText(rawText)
                .isGenerated(false)
                .createdAt(LocalDateTime.now())
                .build();
    }

    public static CvDocument generateFromTemplate(Long candidateId, String filePath, String rawText) {
        return CvDocument.builder()
                .candidateId(candidateId)
                .filePath(filePath)
                .rawText(rawText)
                .isGenerated(true)
                .createdAt(LocalDateTime.now())
                .build();
    }
}
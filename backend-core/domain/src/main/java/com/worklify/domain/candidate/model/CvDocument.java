package com.worklify.domain.candidate.model;

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

    // Factory Method: Ứng viên tải CV file lên
    public static CvDocument upload(Long candidateId, String filePath, String rawText) {
        return CvDocument.builder()
                .candidateId(candidateId)
                .filePath(filePath)
                .rawText(rawText)
                .isGenerated(false)
                .createdAt(LocalDateTime.now())
                .build();
    }

    // Factory Method: Ứng viên tạo CV từ template có file đính kèm
    public static CvDocument generateFromTemplate(Long candidateId, String filePath, String rawText) {
        return CvDocument.builder()
                .candidateId(candidateId)
                .filePath(filePath)
                .rawText(rawText)
                .isGenerated(true)
                .createdAt(LocalDateTime.now())
                .build();
    }

    // Factory Method: Ứng viên tạo CV từ CV Builder (không có file cứng, lưu JSON vào raw_text)
    public static CvDocument generate(Long candidateId, String rawText) {
        return CvDocument.builder()
                .candidateId(candidateId)
                .filePath(null)
                .rawText(rawText)
                .isGenerated(true)
                .createdAt(LocalDateTime.now())
                .build();
    }
}
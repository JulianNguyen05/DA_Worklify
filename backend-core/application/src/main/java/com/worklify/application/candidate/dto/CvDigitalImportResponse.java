package com.worklify.application.candidate.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CvDigitalImportResponse {
    // JSON gốc {settings, layout, data} trích từ PDF — FE tự JSON.parse,
    // KHÔNG cần map/transform gì thêm (khác hẳn ParsedCvResponse của flow OCR/NLP cũ).
    private String rawText;
}
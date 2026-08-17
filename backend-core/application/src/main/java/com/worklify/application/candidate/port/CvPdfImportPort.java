package com.worklify.application.candidate.port;

public interface CvPdfImportPort {
    /**
     * Đọc PDF do chính Worklify export ra, trích lại JSON gốc (cv-data.json)
     * đã nhúng làm embedded file.
     *
     * @throws com.worklify.application.common.exception.CvPdfImportException
     *         nếu PDF không mang marker WORKLIFY_CV_V1, hoặc không đọc được
     *         embedded file cv-data.json.
     */
    String extractEmbeddedCvJson(byte[] pdfBytes);
}
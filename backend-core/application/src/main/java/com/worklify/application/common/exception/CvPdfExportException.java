package com.worklify.application.common.exception;

/**
 * Ném ra khi bước sinh PDF số (render Playwright + nhúng JSON PDFBox) thất bại,
 * dù là lỗi timeout, lỗi render, hay lỗi IO khi ghi/đọc PDF. Luôn bị bắt và log
 * ở tầng gọi (CvDigitalPdfExportRunner) — không được để lọt ra ngoài làm hỏng
 * luồng lưu CV chính, vì PDF số chỉ là dữ liệu phụ trợ.
 */
public class CvPdfExportException extends RuntimeException {

    public CvPdfExportException(String message) {
        super(message);
    }

    public CvPdfExportException(String message, Throwable cause) {
        super(message, cause);
    }
}
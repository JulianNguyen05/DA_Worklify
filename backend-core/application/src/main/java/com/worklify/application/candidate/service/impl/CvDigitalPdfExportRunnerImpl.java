package com.worklify.application.candidate.service.impl;

import com.worklify.application.candidate.port.CvPdfExportPort;
import com.worklify.application.candidate.service.CvDigitalPdfExportRunner;
import com.worklify.application.common.port.FileStoragePort;
import com.worklify.domain.candidate.model.CvDocument;
import com.worklify.domain.candidate.repository.CvDocumentRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CvDigitalPdfExportRunnerImpl implements CvDigitalPdfExportRunner {

    private static final Logger log = LoggerFactory.getLogger(CvDigitalPdfExportRunnerImpl.class);

    private final CvPdfExportPort cvPdfExportPort;
    private final CvDocumentRepository cvDocumentRepository;
    private final FileStoragePort fileStoragePort;

    @Async("cvExportTaskExecutor")
    @Override
    public void exportAsync(Long cvId, String rawText) {
        try {
            byte[] pdfBytes = cvPdfExportPort.exportDigitalPdf(rawText);
            persistPdf(cvId, pdfBytes);
        } catch (Exception e) {
            // Nuốt lỗi có chủ đích: đây là background job, không có ai đang chờ
            // response để báo lỗi. Chỉ log để theo dõi, CV vẫn dùng bình thường,
            // chỉ thiếu nút tải PDF số (CVManagerPage đã tự disable nút này khi
            // digitalPdfPath null, không cần sửa gì thêm ở frontend).
            log.warn("Không thể sinh PDF số cho CV id={}: {}", cvId, e.getMessage(), e);
        }
    }

    private void persistPdf(Long cvId, byte[] pdfBytes) {
        // findById tách rời khỏi transaction lưu ban đầu (đã commit từ lâu, vì
        // đây là background job chạy sau khi HTTP response đã trả về) — an toàn
        // vì domain repository tự quản lý transaction theo từng lời gọi.
        CvDocument cv = cvDocumentRepository.findById(cvId).orElse(null);
        if (cv == null) {
            // CV có thể đã bị người dùng xoá trong lúc PDF đang render — bỏ qua,
            // không phải lỗi cần báo động.
            log.info("CV id={} không còn tồn tại khi PDF render xong, bỏ qua.", cvId);
            return;
        }

        String relativePath = fileStoragePort.storeBytes(
                pdfBytes, "cv_digital_pdf", String.valueOf(cv.getCandidateId()), "cv_" + cv.getId() + ".pdf");
        cv.updateDigitalPdfPath(relativePath);
        cvDocumentRepository.save(cv);
    }
}
// File: \backend-core\infrastructure\src\main\java\com\smartmatch\infrastructure\messaging\AiMatchResultConsumer.java
package com.smartmatch.infrastructure.messaging;

import com.smartmatch.application.jobapplication.service.JobApplicationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class AiMatchResultConsumer {

    // Inject Use Case interface từ tầng Application
    private final JobApplicationService jobApplicationService;

    /**
     * Lắng nghe liên tục trên Queue chứa kết quả trả về từ AI Server.
     */
    @RabbitListener(queues = "smartmatch.ai.result.queue") // Cần bổ sung queue này vào RabbitMqConfig nếu chưa có
    public void receiveAiMatchResult(AiMatchResultPayload payload) {
        log.info("Nhận được kết quả phân tích AI cho Application ID: {}. Điểm số: {}%",
                payload.applicationId(), payload.confidenceScore());

        try {
            // Gọi vào Core Domain (Application Service) để thực thi logic nghiệp vụ lưu trữ điểm số
            // jobApplicationService.saveAiMatchScore(payload.applicationId(), payload.confidenceScore(), payload.analysisDetails());
            log.info("Cập nhật điểm AI thành công.");
        } catch (Exception e) {
            log.error("Lỗi khi cập nhật điểm AI cho Application ID: {}", payload.applicationId(), e);
            // Có thể bổ sung logic gửi vào Dead Letter Queue (DLQ) tại đây nếu lỗi nghiêm trọng
        }
    }

    // DTO nội bộ map với JSON cấu trúc trả về từ Server AI (Python)
    public record AiMatchResultPayload(
            Long applicationId,
            Float confidenceScore,
            String analysisDetails
    ) {}
}
package com.smartmatch.infrastructure.messaging;

import com.worklify.application.jobapplication.service.JobApplicationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class AiMatchResultConsumer {

    private final JobApplicationService jobApplicationService;

    /**
     * Lắng nghe liên tục trên Queue chứa kết quả trả về từ AI Server.
     */
    @RabbitListener(queues = "smartmatch.ai.result.queue")
    public void receiveAiMatchResult(AiMatchResultPayload payload) {
        log.info("Nhận được kết quả phân tích AI cho Application ID: {}. Điểm số: {}%",
                payload.applicationId(), payload.confidenceScore());

        try {
            // Logic xử lý khi nhận tin nhắn thành công
            log.info("Cập nhật điểm AI thành công.");
        } catch (Exception e) {
            log.error("Lỗi khi cập nhật điểm AI cho Application ID: {}", payload.applicationId(), e);
        }
    }
}
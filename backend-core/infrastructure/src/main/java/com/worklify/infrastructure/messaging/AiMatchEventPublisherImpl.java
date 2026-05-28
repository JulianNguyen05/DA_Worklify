// File: \backend-core\infrastructure\src\main\java\com\smartmatch\infrastructure\messaging\AiMatchEventPublisherImpl.java
package com.worklify.infrastructure.messaging;

import com.worklify.infrastructure.config.RabbitMqConfig;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Component;

/**
 * Lớp này đóng vai trò là Outbound Adapter. 
 * Implement interface AiMatchEventPublisher (Port) được định nghĩa ở tầng Application/Domain.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class AiMatchEventPublisherImpl { // Implements AiMatchEventPublisher (Interface ở tầng Application)

    private final RabbitTemplate rabbitTemplate;

    /**
     * Hàm này được gọi bởi Application Service khi một ứng viên vừa nộp CV thành công.
     */
    public void publishAiMatchRequest(Long applicationId, Long cvId, Long jobId) {
        log.info("Đang gửi yêu cầu chấm điểm AI cho Application ID: {} vào RabbitMQ...", applicationId);

        // 1. Đóng gói dữ liệu thành Payload nội bộ của Messaging
        AiMatchRequestPayload payload = new AiMatchRequestPayload(applicationId, cvId, jobId);

        // 2. Gửi Message qua RabbitTemplate sử dụng Exchange và Routing Key đã cấu hình
        rabbitTemplate.convertAndSend(
                RabbitMqConfig.EXCHANGE_NAME,
                "ai.match.request.v1", // Định tuyến tới QUEUE_AI_MATCH
                payload
        );

        log.info("Đã gửi thành công yêu cầu tới Message Broker.");
    }

    // DTO (Data Transfer Object) nội bộ chỉ dùng cho việc gửi Message
    public record AiMatchRequestPayload(Long applicationId, Long cvId, Long jobId) {}
}
// File: \backend-core\infrastructure\src\main\java\com\smartmatch\infrastructure\messaging\DomainEventRabbitMqDispatcher.java
package com.worklify.infrastructure.messaging;

import com.worklify.domain.application.event.ApplicationSubmittedEvent;
import com.worklify.infrastructure.config.RabbitMqConfig;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class DomainEventRabbitMqDispatcher {

    private final RabbitTemplate rabbitTemplate;

    /**
     * @Async giúp luồng API của User không bị chặn lại để chờ thao tác gửi Message.
     * @EventListener tự động bắt các Event được publish từ Aggregate Root.
     */
    @Async
    @EventListener
    public void handleApplicationSubmittedEvent(ApplicationSubmittedEvent event) {
        log.info("[Domain Event -> RabbitMQ] Bắt được sự kiện nộp CV cho JobId: {}. Đang điều phối sang AI Server...", event.jobId());

        rabbitTemplate.convertAndSend(
                RabbitMqConfig.EXCHANGE_NAME,
                "ai.match.request.event",
                event
        );
    }
}
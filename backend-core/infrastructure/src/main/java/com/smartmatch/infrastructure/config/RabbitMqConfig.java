// File: \backend-core\infrastructure\src\main\java\com\smartmatch\infrastructure\config\RabbitMqConfig.java
package com.smartmatch.infrastructure.config;

import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMqConfig {

    // Khai báo tên Exchange và Queue
    public static final String EXCHANGE_NAME = "smartmatch.domain.exchange";
    public static final String QUEUE_AI_MATCH = "smartmatch.ai.match.queue";
    public static final String ROUTING_KEY_AI_MATCH = "ai.match.request.#";

    // 1. Tạo Topic Exchange
    @Bean
    public TopicExchange domainExchange() {
        return new TopicExchange(EXCHANGE_NAME);
    }

    // 2. Tạo Queue xử lý chấm điểm AI
    @Bean
    public Queue aiMatchQueue() {
        // durable = true: Queue sẽ không bị mất khi RabbitMQ khởi động lại
        return new Queue(QUEUE_AI_MATCH, true);
    }

    // 3. Binding Queue với Exchange thông qua Routing Key
    @Bean
    public Binding bindingAiMatchQueue(Queue aiMatchQueue, TopicExchange domainExchange) {
        return BindingBuilder.bind(aiMatchQueue).to(domainExchange).with(ROUTING_KEY_AI_MATCH);
    }

    // 4. Cấu hình Converter để tự động chuyển đổi Object (Domain Event) sang JSON và ngược lại
    @Bean
    public MessageConverter jsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    // 5. Cấu hình RabbitTemplate để publish message
    @Bean
    public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory, MessageConverter jsonMessageConverter) {
        RabbitTemplate template = new RabbitTemplate(connectionFactory);
        template.setMessageConverter(jsonMessageConverter);
        return template;
    }
}
package com.smartmatch.infrastructure.config;

import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMqConfig {

    // Tên Exchange
    public static final String EXCHANGE_NAME = "smartmatch.domain.exchange";

    // Tên các Queues (Cần khớp với tên mà Consumer/Producer sử dụng)
    public static final String QUEUE_AI_SUBMIT = "smartmatch.ai.submit.queue";
    public static final String QUEUE_AI_RESULT = "smartmatch.ai.result.queue";

    // Routing Keys
    public static final String ROUTING_KEY_AI_SUBMIT = "ai.submit";
    public static final String ROUTING_KEY_AI_RESULT = "ai.result";

    // 1. Tạo Topic Exchange
    @Bean
    public TopicExchange domainExchange() {
        return new TopicExchange(EXCHANGE_NAME);
    }

    // 2. Tạo Queue nhận yêu cầu chấm điểm AI (Durable = true)
    @Bean
    public Queue aiSubmitQueue() {
        return new Queue(QUEUE_AI_SUBMIT, true);
    }

    // 3. Tạo Queue nhận kết quả trả về từ AI (Durable = true)
    @Bean
    public Queue aiResultQueue() {
        return new Queue(QUEUE_AI_RESULT, true);
    }

    // 3. Binding Queue với Exchange thông qua Routing Key
    @Bean
    public Binding bindingSubmit(@Qualifier("aiSubmitQueue") Queue aiSubmitQueue, TopicExchange domainExchange) {
        return BindingBuilder.bind(aiSubmitQueue).to(domainExchange).with(ROUTING_KEY_AI_SUBMIT);
    }

    @Bean
    public Binding bindingResult(@Qualifier("aiResultQueue") Queue aiResultQueue, TopicExchange domainExchange) {
        return BindingBuilder.bind(aiResultQueue).to(domainExchange).with(ROUTING_KEY_AI_RESULT);
    }

    // 5. Cấu hình JSON Converter (Quan trọng để Spring Boot tự map Object <-> JSON)
    @Bean
    public MessageConverter jsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    // 6. Cấu hình RabbitTemplate
    @Bean
    public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory, MessageConverter jsonMessageConverter) {
        RabbitTemplate template = new RabbitTemplate(connectionFactory);
        template.setMessageConverter(jsonMessageConverter);
        return template;
    }
}
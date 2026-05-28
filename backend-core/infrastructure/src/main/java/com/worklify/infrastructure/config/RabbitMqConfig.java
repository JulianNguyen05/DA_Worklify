package com.worklify.infrastructure.config;

import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * [ĐÃ SỬA] Đổi toàn bộ prefix từ "smartmatch" sang "worklify" để đồng nhất thương hiệu.
 * Routing keys khớp chính xác với những gì DomainEventRabbitMqDispatcher và AiMatchResultConsumer sử dụng.
 */
@Configuration
public class RabbitMqConfig {

    // Tên Exchange
    public static final String EXCHANGE_NAME = "worklify.domain.exchange";

    // Tên các Queues
    public static final String QUEUE_AI_SUBMIT = "worklify.ai.submit.queue";
    public static final String QUEUE_AI_RESULT = "worklify.ai.result.queue";

    // Routing Keys
    public static final String ROUTING_KEY_AI_SUBMIT = "ai.submit";
    public static final String ROUTING_KEY_AI_RESULT = "ai.result";

    @Bean
    public TopicExchange domainExchange() {
        return new TopicExchange(EXCHANGE_NAME);
    }

    @Bean
    public Queue aiSubmitQueue() {
        return new Queue(QUEUE_AI_SUBMIT, true);
    }

    @Bean
    public Queue aiResultQueue() {
        return new Queue(QUEUE_AI_RESULT, true);
    }

    @Bean
    public Binding bindingSubmit(@Qualifier("aiSubmitQueue") Queue aiSubmitQueue, TopicExchange domainExchange) {
        return BindingBuilder.bind(aiSubmitQueue).to(domainExchange).with(ROUTING_KEY_AI_SUBMIT);
    }

    @Bean
    public Binding bindingResult(@Qualifier("aiResultQueue") Queue aiResultQueue, TopicExchange domainExchange) {
        return BindingBuilder.bind(aiResultQueue).to(domainExchange).with(ROUTING_KEY_AI_RESULT);
    }

    @Bean
    public MessageConverter jsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    @Bean
    public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory, MessageConverter jsonMessageConverter) {
        RabbitTemplate template = new RabbitTemplate(connectionFactory);
        template.setMessageConverter(jsonMessageConverter);
        return template;
    }
}
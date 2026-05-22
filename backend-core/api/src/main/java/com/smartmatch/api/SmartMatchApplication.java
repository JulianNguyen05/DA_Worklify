package com.smartmatch.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.transaction.annotation.EnableTransactionManagement;

/**
 * Lớp khởi động (Entry point) của toàn bộ hệ thống Backend SmartMatch.
 */
@SpringBootApplication(scanBasePackages = {"com.smartmatch"}) // Quét toàn bộ Bean ở tất cả các module
@EnableJpaRepositories(basePackages = {"com.smartmatch.infrastructure.persistence.repository"}) // Chỉ định nơi chứa JPA Repository
@EntityScan(basePackages = {"com.smartmatch.infrastructure.persistence.entity"}) // Chỉ định nơi chứa JPA Entity
@EnableTransactionManagement // Kích hoạt quản lý giao dịch (@Transactional)
@EnableAsync // Kích hoạt xử lý bất đồng bộ (cần thiết cho RabbitMQ Dispatcher của AI)
public class SmartMatchApplication {

    public static void main(String[] args) {
        SpringApplication.run(SmartMatchApplication.class, args);
    }
}
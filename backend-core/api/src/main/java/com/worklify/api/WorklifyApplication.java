package com.worklify.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.transaction.annotation.EnableTransactionManagement;

/**
 * Lớp khởi động (Entry point) của toàn bộ hệ thống Backend Worklify.
 */
@SpringBootApplication(scanBasePackages = {"com.worklify"}) // ĐÃ SỬA: Quét toàn bộ Bean ở các module của Worklify
@EnableJpaRepositories(basePackages = {"com.worklify.infrastructure.persistence.repository"}) // ĐÃ SỬA: Đường dẫn Repo mới
@EntityScan(basePackages = {"com.worklify.infrastructure.persistence.entity"}) // ĐÃ SỬA: Đường dẫn Entity mới
@EnableTransactionManagement // Kích hoạt quản lý giao dịch (@Transactional)
@EnableJpaAuditing // Kích hoạt tính năng tự động ghi nhận thời gian (JPA Auditing)
// [ĐÃ XÓA] @EnableAsync vì hệ thống không còn dùng RabbitMQ và AI nữa
public class WorklifyApplication {

    public static void main(String[] args) {
        SpringApplication.run(WorklifyApplication.class, args);
    }
}
// File: \backend-core\infrastructure\src\main\java\com\smartmatch\infrastructure\config\WebConfig.java
package com.smartmatch.infrastructure.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${application.frontend.url:http://localhost:3000}")
    private String frontendUrl;

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins(frontendUrl) // Chỉ cho phép domain của frontend
                .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
                .allowedHeaders("Authorization", "Content-Type", "X-Requested-With", "Accept")
                .allowCredentials(true) // Cho phép gửi cookie/token
                .maxAge(3600); // Cache cấu hình CORS trong 1 giờ
    }
}
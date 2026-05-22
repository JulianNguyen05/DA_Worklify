package com.smartmatch.api.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import org.springframework.context.annotation.Configuration;

@Configuration
@OpenAPIDefinition(
        info = @Info(
                title = "SmartMatch API Documentation",
                version = "1.0.0",
                description = "Tài liệu đặc tả các Endpoint cho hệ thống tuyển dụng SmartMatch. Hỗ trợ Quản trị viên, Nhà tuyển dụng và Ứng viên.",
                contact = @Contact(name = "SmartMatch Team")
        ),
        // Áp dụng bảo mật JWT mặc định cho tất cả các API (trừ những API được permitAll)
        security = {@SecurityRequirement(name = "bearerAuth")}
)
@SecurityScheme(
        name = "bearerAuth",
        description = "Nhập JWT Token của bạn vào đây (Không cần thêm tiền tố 'Bearer ')",
        type = SecuritySchemeType.HTTP,
        scheme = "bearer",
        bearerFormat = "JWT"
)
public class OpenApiConfig {
    // SpringDoc tự động quét các Controller để tạo tài liệu
}
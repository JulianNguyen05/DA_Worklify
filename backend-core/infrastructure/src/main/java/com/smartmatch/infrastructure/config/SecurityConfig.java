// File: \backend-core\infrastructure\src\main\java\com\smartmatch\infrastructure\config\SecurityConfig.java
package com.smartmatch.infrastructure.config;

import com.smartmatch.infrastructure.security.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity // Cho phép dùng @PreAuthorize ở tầng API/Controller
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final AuthenticationProvider authenticationProvider;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // Tắt CSRF vì chúng ta sử dụng JWT (không dùng session cookies)
                .csrf(AbstractHttpConfigurer::disable)

                // Phân quyền các endpoint
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/v1/auth/**").permitAll() // Mở các API đăng ký, đăng nhập
                        .requestMatchers("/api/v1/public/**").permitAll() // Các API công khai (vd: danh sách việc làm)
                        .requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll() // API Docs
                        .anyRequest().authenticated() // Tất cả các request khác đều cần token hợp lệ
                )

                // Cấu hình Session thành Stateless (Không lưu trạng thái trên server)
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )

                // Đăng ký Provider và Filter JWT
                .authenticationProvider(authenticationProvider)
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
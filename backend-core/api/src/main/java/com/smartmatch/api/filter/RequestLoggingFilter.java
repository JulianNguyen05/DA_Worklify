package com.smartmatch.api.filter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Slf4j
@Component
public class RequestLoggingFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain) throws ServletException, IOException {

        long startTime = System.currentTimeMillis();

        // Ghi log đường dẫn incoming request
        log.info("Incoming Request: [{}] {}", request.getMethod(), request.getRequestURI());

        try {
            // Cho phép request tiếp tục đi vào các filter khác và Controller
            filterChain.doFilter(request, response);
        } finally {
            // Tính toán thời gian phản hồi sau khi Controller xử lý xong
            long duration = System.currentTimeMillis() - startTime;

            // Cảnh báo nếu API phản hồi chậm hơn 2000ms (2 giây) - Theo đặc tả hiệu năng
            if (duration > 2000) {
                log.warn("Slow API Detected! [{}] {} - Status: {} - Time: {}ms",
                        request.getMethod(), request.getRequestURI(), response.getStatus(), duration);
            } else {
                log.info("Completed Request: [{}] {} - Status: {} - Time: {}ms",
                        request.getMethod(), request.getRequestURI(), response.getStatus(), duration);
            }
        }
    }
}
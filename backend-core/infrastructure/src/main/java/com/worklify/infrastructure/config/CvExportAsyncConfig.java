package com.worklify.infrastructure.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

import java.util.concurrent.Executor;

@Configuration
@EnableAsync
public class CvExportAsyncConfig {

    @Bean(name = "cvExportTaskExecutor")
    public Executor cvExportTaskExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(2);
        executor.setMaxPoolSize(2);
        // Queue thay vì reject — nếu nhiều CV lưu dồn dập, job xếp hàng thay vì
        // mất luôn (mất thì user không biết PDF số của mình không bao giờ có).
        executor.setQueueCapacity(50);
        executor.setThreadNamePrefix("cv-pdf-export-async-");
        executor.initialize();
        return executor;
    }
}
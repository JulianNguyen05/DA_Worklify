package com.worklify.infrastructure.persistence;

import com.worklify.domain.job.model.JobPosting;
import com.worklify.infrastructure.persistence.mapper.JobPostingEntityMapper;
import com.worklify.infrastructure.persistence.repository.JobPostingJpaRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * Khi khởi động: điền salary_min/salary_max cho các tin cũ (tạo trước khi có hai cột này)
 * bằng cách đọc chuỗi salary_range, để bộ lọc lương tìm thấy chúng. Chạy lại nhiều lần không sao.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class JobSalaryBackfillRunner implements ApplicationRunner {

    private final JobPostingJpaRepository jpaRepository;
    private final JobPostingEntityMapper mapper;

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        int updated = 0;
        for (var entity : jpaRepository.findBySalaryMinIsNullAndSalaryMaxIsNullAndSalaryRangeIsNotNull()) {
            JobPosting job = mapper.toDomain(entity);
            if (job.backfillSalaryFromRange()) {
                entity.setSalaryMin(job.getSalaryMin());
                entity.setSalaryMax(job.getSalaryMax());
                updated++;
            }
        }
        if (updated > 0) {
            log.info("Đã điền khoảng lương dạng số cho {} tin tuyển dụng cũ", updated);
        }
    }
}

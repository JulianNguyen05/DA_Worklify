package com.smartmatch.infrastructure.persistence.adapter;

import com.smartmatch.domain.common.DomainPage;
import com.smartmatch.domain.common.DomainPageable;
import com.smartmatch.domain.job.model.JobPosting;
import com.smartmatch.domain.job.model.JobStatus;
import com.smartmatch.domain.job.repository.JobPostingRepository;
import com.smartmatch.infrastructure.persistence.adapter.util.PaginationMapper;
import com.smartmatch.infrastructure.persistence.entity.JobPostingJpaEntity;
import com.smartmatch.infrastructure.persistence.mapper.JobPostingEntityMapper;
import com.smartmatch.infrastructure.persistence.repository.JobPostingJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class JobPostingRepositoryAdapter implements JobPostingRepository {
    private final JobPostingJpaRepository jpaRepository;
    private final JobPostingEntityMapper mapper;

    @Override
    public JobPosting save(JobPosting jobPosting) {
        return mapper.toDomain(jpaRepository.save(mapper.toEntity(jobPosting)));
    }

    @Override
    public Optional<JobPosting> findById(Long id) {
        return jpaRepository.findById(id).map(mapper::toDomain);
    }

    @Override
    public DomainPage<JobPosting> findByCompanyId(Long companyId, DomainPageable pageable) {
        Page<JobPostingJpaEntity> page = jpaRepository.findByCompanyId(companyId, PaginationMapper.toSpringPageable(pageable));
        return PaginationMapper.toDomainPage(page, mapper::toDomain);
    }

    @Override
    public DomainPage<JobPosting> searchJobs(String keyword, String location, JobStatus status, DomainPageable pageable) {
        Page<JobPostingJpaEntity> page = jpaRepository.searchJobs(keyword, location, status, PaginationMapper.toSpringPageable(pageable));
        return PaginationMapper.toDomainPage(page, mapper::toDomain);
    }

    @Override
    public long countByStatus(JobStatus status) {
        return jpaRepository.countByStatus(status);
    }
}
package com.worklify.infrastructure.persistence.adapter;

import com.worklify.domain.common.DomainPage;
import com.worklify.domain.common.DomainPageable;
import com.worklify.domain.job.model.JobPosting;
import com.worklify.domain.job.model.JobStatus;
import com.worklify.domain.job.repository.JobPostingRepository;
import com.worklify.infrastructure.persistence.adapter.util.PaginationMapper;
import com.worklify.infrastructure.persistence.entity.JobPostingJpaEntity;
import com.worklify.infrastructure.persistence.mapper.JobPostingEntityMapper;
import com.worklify.infrastructure.persistence.repository.JobPostingJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

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

    @Override
    public List<JobPosting> findByStatus(JobStatus status) {
        return jpaRepository.findByStatus(status).stream()
                .map(mapper::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public DomainPage<JobPosting> findByCompanyIdAndStatus(Long companyId, JobStatus status, DomainPageable pageable) {
        Page<JobPostingJpaEntity> page = jpaRepository.findByCompanyIdAndStatus(
                companyId,
                status,
                PaginationMapper.toSpringPageable(pageable)
        );
        return PaginationMapper.toDomainPage(page, mapper::toDomain);
    }
}
package com.worklify.infrastructure.persistence.adapter;

import com.worklify.domain.application.model.Application;
import com.worklify.domain.application.model.ApplicationStatus;
import com.worklify.domain.application.repository.ApplicationRepository;
import com.worklify.domain.common.DomainPage;
import com.worklify.domain.common.DomainPageable;
import com.worklify.infrastructure.persistence.adapter.util.PaginationMapper;
import com.worklify.infrastructure.persistence.entity.ApplicationJpaEntity;
import com.worklify.infrastructure.persistence.mapper.ApplicationEntityMapper;
import com.worklify.infrastructure.persistence.repository.ApplicationJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class ApplicationRepositoryAdapter implements ApplicationRepository {
    private final ApplicationJpaRepository jpaRepository;
    private final ApplicationEntityMapper mapper;

    @Override
    public Application save(Application application) {
        return mapper.toDomain(jpaRepository.save(mapper.toEntity(application)));
    }

    @Override
    public Optional<Application> findById(Long id) {
        return jpaRepository.findById(id).map(mapper::toDomain);
    }

    @Override
    public DomainPage<Application> findByJobId(Long jobId, DomainPageable pageable) {
        Page<ApplicationJpaEntity> page = jpaRepository.findByJobId(jobId, PaginationMapper.toSpringPageable(pageable));
        return PaginationMapper.toDomainPage(page, mapper::toDomain);
    }

    @Override
    public DomainPage<Application> findByCandidateId(Long candidateId, DomainPageable pageable) {
        Page<ApplicationJpaEntity> page = jpaRepository.findByCandidateId(candidateId, PaginationMapper.toSpringPageable(pageable));
        return PaginationMapper.toDomainPage(page, mapper::toDomain);
    }

    @Override
    public boolean existsByCandidateIdAndJobId(Long candidateId, Long jobId) {
        return false;
    }

    @Override
    public long countAll() {
        return jpaRepository.count();
    }

    @Override
    public long countByStatus(ApplicationStatus status) {
        // Đảm bảo ApplicationJpaRepository của bạn đã định nghĩa phương thức countByStatus
        return jpaRepository.countByStatus(status);
    }
}
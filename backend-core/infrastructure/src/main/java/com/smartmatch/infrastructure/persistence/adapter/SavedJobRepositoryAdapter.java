package com.smartmatch.infrastructure.persistence.adapter;

import com.worklify.domain.common.DomainPage;
import com.worklify.domain.common.DomainPageable;
import com.worklify.domain.job.model.SavedJob;
import com.worklify.domain.job.repository.SavedJobRepository;
import com.smartmatch.infrastructure.persistence.adapter.util.PaginationMapper;
import com.smartmatch.infrastructure.persistence.entity.SavedJobJpaEntity;
import com.smartmatch.infrastructure.persistence.mapper.SavedJobEntityMapper;
import com.smartmatch.infrastructure.persistence.repository.SavedJobJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
@RequiredArgsConstructor
public class SavedJobRepositoryAdapter implements SavedJobRepository {
    private final SavedJobJpaRepository jpaRepository;
    private final SavedJobEntityMapper mapper;

    @Override
    public SavedJob save(SavedJob savedJob) {
        return mapper.toDomain(jpaRepository.save(mapper.toEntity(savedJob)));
    }

    @Override
    public Optional<SavedJob> findByCandidateIdAndJobId(Long candidateId, Long jobId) {
        return jpaRepository.findByCandidateIdAndJobId(candidateId, jobId).map(mapper::toDomain);
    }

    @Override
    public DomainPage<SavedJob> findByCandidateId(Long candidateId, DomainPageable pageable) {
        Page<SavedJobJpaEntity> page = jpaRepository.findByCandidateId(candidateId, PaginationMapper.toSpringPageable(pageable));
        return PaginationMapper.toDomainPage(page, mapper::toDomain);
    }

    @Override
    public void delete(SavedJob savedJob) {
        jpaRepository.delete(mapper.toEntity(savedJob));
    }
}
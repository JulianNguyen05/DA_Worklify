package com.worklify.infrastructure.persistence.adapter;

import com.worklify.domain.candidate.model.CandidateProfile;
import com.worklify.domain.candidate.repository.CandidateProfileRepository;
import com.worklify.domain.common.DomainPage;
import com.worklify.domain.common.DomainPageable;
import com.worklify.infrastructure.persistence.adapter.util.PaginationMapper;
import com.worklify.infrastructure.persistence.entity.CandidateProfileJpaEntity;
import com.worklify.infrastructure.persistence.mapper.CandidateEntityMapper;
import com.worklify.infrastructure.persistence.repository.CandidateProfileJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class CandidateProfileRepositoryAdapter implements CandidateProfileRepository {
    private final CandidateProfileJpaRepository jpaRepository;
    private final CandidateEntityMapper mapper;

    @Override
    public CandidateProfile save(CandidateProfile profile) {
        return mapper.toDomain(jpaRepository.save(mapper.toEntity(profile)));
    }

    @Override
    public Optional<CandidateProfile> findByUserId(Long userId) {
        // Đổi từ jpaRepository.findByUserId(...) thành:
        return jpaRepository.findFirstByUserId(userId)
                .map(mapper::toDomain);
    }

    /**
     * [ĐÃ SỬA] Trước đây hardcode trả về Optional.empty(). Nay delegate sang JPA repository thực sự.
     */
    @Override
    public Optional<CandidateProfile> findById(Long id) {
        return jpaRepository.findById(id).map(mapper::toDomain);
    }

    @Override
    public DomainPage<CandidateProfile> searchCandidates(String keyword, DomainPageable pageable) {
        Page<CandidateProfileJpaEntity> page = jpaRepository.searchCandidates(
                keyword,
                PaginationMapper.toSpringPageable(pageable)
        );
        return PaginationMapper.toDomainPage(page, mapper::toDomain);
    }
}
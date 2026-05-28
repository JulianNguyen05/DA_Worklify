package com.smartmatch.infrastructure.persistence.adapter;

import com.worklify.domain.admin.model.SystemLog;
import com.worklify.domain.admin.repository.SystemLogRepository;
import com.worklify.domain.common.DomainPage;
import com.worklify.domain.common.DomainPageable;
import com.smartmatch.infrastructure.persistence.adapter.util.PaginationMapper;
import com.smartmatch.infrastructure.persistence.entity.SystemLogJpaEntity;
import com.smartmatch.infrastructure.persistence.mapper.SystemLogEntityMapper;
import com.smartmatch.infrastructure.persistence.repository.SystemLogJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class SystemLogRepositoryAdapter implements SystemLogRepository {
    private final SystemLogJpaRepository jpaRepository;
    private final SystemLogEntityMapper mapper;

    @Override
    public SystemLog save(SystemLog systemLog) {
        return mapper.toDomain(jpaRepository.save(mapper.toEntity(systemLog)));
    }

    @Override
    public DomainPage<SystemLog> findAll(DomainPageable pageable) {
        Page<SystemLogJpaEntity> page = jpaRepository.findAll(PaginationMapper.toSpringPageable(pageable));
        return PaginationMapper.toDomainPage(page, mapper::toDomain);
    }
}
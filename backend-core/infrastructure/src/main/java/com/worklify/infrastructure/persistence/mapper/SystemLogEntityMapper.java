package com.worklify.infrastructure.persistence.mapper;

import com.worklify.domain.admin.model.SystemLog;
import com.worklify.infrastructure.persistence.entity.SystemLogJpaEntity;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface SystemLogEntityMapper {
    SystemLogJpaEntity toEntity(SystemLog log);
    SystemLog toDomain(SystemLogJpaEntity entity);
}
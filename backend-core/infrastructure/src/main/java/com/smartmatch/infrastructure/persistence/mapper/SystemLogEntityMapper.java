package com.smartmatch.infrastructure.persistence.mapper;

import com.worklify.domain.admin.model.SystemLog;
import com.smartmatch.infrastructure.persistence.entity.SystemLogJpaEntity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface SystemLogEntityMapper {

    SystemLogJpaEntity toEntity(SystemLog log);

    SystemLog toDomain(SystemLogJpaEntity entity);
}

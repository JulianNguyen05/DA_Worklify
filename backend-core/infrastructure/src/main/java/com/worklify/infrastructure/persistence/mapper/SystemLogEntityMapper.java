package com.worklify.infrastructure.persistence.mapper;

import com.worklify.domain.admin.model.SystemLog;
import com.worklify.infrastructure.persistence.entity.SystemLogJpaEntity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface SystemLogEntityMapper {

    SystemLogJpaEntity toEntity(SystemLog log);

    SystemLog toDomain(SystemLogJpaEntity entity);
}

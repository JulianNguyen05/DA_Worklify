package com.worklify.infrastructure.persistence.mapper;

import com.worklify.domain.job.model.SavedJob;
import com.worklify.infrastructure.persistence.entity.SavedJobJpaEntity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface SavedJobEntityMapper {
    SavedJobJpaEntity toEntity(SavedJob savedJob);
    SavedJob toDomain(SavedJobJpaEntity entity);
}
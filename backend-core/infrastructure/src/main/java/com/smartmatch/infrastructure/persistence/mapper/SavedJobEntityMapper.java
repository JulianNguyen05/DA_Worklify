package com.smartmatch.infrastructure.persistence.mapper;

import com.smartmatch.domain.job.model.SavedJob;
import com.smartmatch.infrastructure.persistence.entity.SavedJobJpaEntity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface SavedJobEntityMapper {
    SavedJobJpaEntity toEntity(SavedJob savedJob);
    SavedJob toDomain(SavedJobJpaEntity entity);
}
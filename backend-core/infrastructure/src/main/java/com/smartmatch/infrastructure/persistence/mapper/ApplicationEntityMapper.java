package com.smartmatch.infrastructure.persistence.mapper;


import com.smartmatch.domain.application.model.AiMatchScore;
import com.smartmatch.domain.application.model.Application;
import com.smartmatch.infrastructure.persistence.entity.AiMatchScoreJpaEntity;
import com.smartmatch.infrastructure.persistence.entity.ApplicationJpaEntity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ApplicationEntityMapper {

    ApplicationJpaEntity toEntity(Application application);
    Application toDomain(ApplicationJpaEntity entity);

    AiMatchScoreJpaEntity toEntity(AiMatchScore aiMatchScore);
    AiMatchScore toDomain(AiMatchScoreJpaEntity entity);
}

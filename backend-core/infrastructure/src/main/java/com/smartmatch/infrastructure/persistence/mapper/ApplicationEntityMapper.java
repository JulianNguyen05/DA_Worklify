package com.smartmatch.infrastructure.persistence.mapper;

import com.smartmatch.domain.application.model.AiMatchScore;
import com.smartmatch.domain.application.model.Application;
import com.smartmatch.infrastructure.persistence.entity.AiMatchScoreJpaEntity;
import com.smartmatch.infrastructure.persistence.entity.ApplicationJpaEntity;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;
import org.springframework.stereotype.Component;

// Ép Spring nhận diện Bean và bỏ qua các warning mapping thiếu trường
@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
@Component
public interface ApplicationEntityMapper {

    ApplicationJpaEntity toEntity(Application application);
    Application toDomain(ApplicationJpaEntity entity);

    AiMatchScoreJpaEntity toEntity(AiMatchScore aiMatchScore);
    AiMatchScore toDomain(AiMatchScoreJpaEntity entity);
}
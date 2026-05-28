package com.worklify.infrastructure.persistence.mapper;

import com.worklify.domain.application.model.Application;
import com.worklify.infrastructure.persistence.entity.ApplicationJpaEntity;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;
import org.springframework.stereotype.Component;

// Ép Spring nhận diện Bean và bỏ qua các warning mapping thiếu trường
@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
@Component
public interface ApplicationEntityMapper {

    ApplicationJpaEntity toEntity(Application application);
    Application toDomain(ApplicationJpaEntity entity);
}
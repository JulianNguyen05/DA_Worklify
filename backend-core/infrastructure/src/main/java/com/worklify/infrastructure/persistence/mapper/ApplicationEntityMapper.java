package com.worklify.infrastructure.persistence.mapper;

import com.worklify.domain.application.model.Application;
import com.worklify.infrastructure.persistence.entity.ApplicationJpaEntity;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

/**
 * [ĐÃ SỬA] Loại bỏ @Component thừa — @Mapper(componentModel = "spring") đã đủ để Spring quản lý Bean.
 * Đặt @Component trùng trên @Mapper interface gây ra ambiguous bean definition.
 */
@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface ApplicationEntityMapper {
    ApplicationJpaEntity toEntity(Application application);
    Application toDomain(ApplicationJpaEntity entity);
}
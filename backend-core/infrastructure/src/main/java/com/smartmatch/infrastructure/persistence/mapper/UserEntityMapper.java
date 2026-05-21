package com.smartmatch.infrastructure.persistence.mapper;

import com.smartmatch.domain.auth.model.User;
import com.smartmatch.infrastructure.persistence.entity.UserJpaEntity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserEntityMapper {

    UserJpaEntity toEntity(User user);

    User toDomain(UserJpaEntity entity);
}

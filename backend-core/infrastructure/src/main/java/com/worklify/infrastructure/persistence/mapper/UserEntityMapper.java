package com.worklify.infrastructure.persistence.mapper;

import com.worklify.domain.auth.model.User;
import com.worklify.domain.common.valueobject.EmailAddress;
import com.worklify.domain.common.valueobject.PhoneNumber;
import com.worklify.infrastructure.persistence.entity.UserJpaEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

/**
 * [ĐÃ SỬA] Loại bỏ @Component thừa. @Mapper(componentModel = "spring") là đủ.
 */
@Mapper(componentModel = "spring")
public interface UserEntityMapper {

    @Mapping(source = "passwordHash", target = "password")
    @Mapping(target = "mfaEnabled", expression = "java(user.isMfaEnabled())")
    UserJpaEntity toEntity(User user);

    @Mapping(source = "password", target = "passwordHash")
    @Mapping(target = "isMfaEnabled", expression = "java(entity.isMfaEnabled())")
    User toDomain(UserJpaEntity entity);

    default String mapEmail(EmailAddress emailAddress) {
        return emailAddress != null ? emailAddress.value() : null;
    }

    default EmailAddress mapEmailString(String email) {
        return email != null ? new EmailAddress(email) : null;
    }

    default String mapPhone(PhoneNumber phoneNumber) {
        return phoneNumber != null ? phoneNumber.value() : null;
    }

    default PhoneNumber mapPhoneString(String phone) {
        return phone != null && !phone.isBlank() ? new PhoneNumber(phone) : null;
    }
}
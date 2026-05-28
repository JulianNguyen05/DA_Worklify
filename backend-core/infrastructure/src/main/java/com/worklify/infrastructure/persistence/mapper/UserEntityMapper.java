package com.worklify.infrastructure.persistence.mapper;

import com.worklify.domain.auth.model.User;
import com.worklify.domain.common.valueobject.EmailAddress;
import com.worklify.domain.common.valueobject.PhoneNumber;
import com.worklify.infrastructure.persistence.entity.UserJpaEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserEntityMapper {

    @Mapping(source = "passwordHash", target = "password")
    @Mapping(source = "isMfaEnabled", target = "mfaEnabled") // MapStruct sẽ tự tìm hàm isMfaEnabled()
    UserJpaEntity toEntity(User user);

    @Mapping(source = "password", target = "passwordHash")
    @Mapping(source = "mfaEnabled", target = "isMfaEnabled") // MapStruct sẽ gọi setter setIsMfaEnabled()
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
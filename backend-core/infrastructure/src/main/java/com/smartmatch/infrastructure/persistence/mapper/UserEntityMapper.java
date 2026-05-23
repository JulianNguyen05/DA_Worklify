package com.smartmatch.infrastructure.persistence.mapper;

import com.smartmatch.domain.auth.model.User;
import com.smartmatch.domain.common.valueobject.EmailAddress;
import com.smartmatch.domain.common.valueobject.PhoneNumber;
import com.smartmatch.infrastructure.persistence.entity.UserJpaEntity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserEntityMapper {

    UserJpaEntity toEntity(User user);

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
        return phone != null ? new PhoneNumber(phone) : null;
    }
}
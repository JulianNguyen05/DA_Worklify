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

    // ==============================================================
    // CÁC HÀM MAP THỦ CÔNG CHO VALUE OBJECT
    // ==============================================================

    // 1. Chuyển từ Value Object EmailAddress (Domain) sang String (Entity)
    default String mapEmail(EmailAddress emailAddress) {
        return emailAddress != null ? emailAddress.value() : null;
    }

    // 2. Chuyển từ String (Entity) sang Value Object EmailAddress (Domain)
    default EmailAddress mapEmailString(String email) {
        return email != null ? new EmailAddress(email) : null;
    }

    // 3. Chuyển từ Value Object PhoneNumber (Domain) sang String (Entity)
    default String mapPhone(PhoneNumber phoneNumber) {
        return phoneNumber != null ? phoneNumber.value() : null;
    }

    // 4. Chuyển từ String (Entity) sang Value Object PhoneNumber (Domain)
    default PhoneNumber mapPhoneString(String phone) {
        return phone != null ? new PhoneNumber(phone) : null;
    }
}
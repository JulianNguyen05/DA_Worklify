package com.smartmatch.infrastructure.persistence.mapper;

import com.worklify.domain.auth.model.User;
import com.worklify.domain.common.valueobject.EmailAddress;
import com.worklify.domain.common.valueobject.PhoneNumber;
import com.smartmatch.infrastructure.persistence.entity.UserJpaEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping; // [ĐÃ THÊM] Import annotation Mapping

@Mapper(componentModel = "spring")
public interface UserEntityMapper {

    // [ĐÃ SỬA] Chỉ định rõ ánh xạ biến passwordHash thành password khi chuyển sang Entity để lưu DB
    @Mapping(source = "passwordHash", target = "password")
    UserJpaEntity toEntity(User user);

    // [ĐÃ SỬA] Chỉ định rõ ánh xạ biến password thành passwordHash khi lấy từ DB lên
    @Mapping(source = "password", target = "passwordHash")
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
package com.worklify.domain.common.valueobject;

public record PhoneNumber(String value) {
    public PhoneNumber {
        if (value != null && !value.matches("^\\+?[0-9]{8,15}$")) {
            throw new IllegalArgumentException("Số điện thoại không hợp lệ");
        }
    }
}
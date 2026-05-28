package com.worklify.domain.common.valueobject;

public record EmailAddress(String value) {
    public EmailAddress {
        if (value == null || !value.matches("^[A-Za-z0-9+_.-]+@(.+)$")) {
            throw new IllegalArgumentException("Địa chỉ email không hợp lệ");
        }
    }

    public boolean matches(String regex) {
        return value != null && value.matches(regex);
    }
}
package com.worklify.application.matching.dto;

import java.util.Arrays;

/**
 * Các mục hồ sơ mà agent gợi ý sửa CV có thể viết lại.
 */
public enum CvSectionType {
    SUMMARY("summary"),
    EXPERIENCE("experience"),
    PROJECT("project");

    private final String value;

    CvSectionType(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }

    public static CvSectionType fromValue(String value) {
        return Arrays.stream(values())
                .filter(t -> t.value.equalsIgnoreCase(value))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Loại mục hồ sơ không hợp lệ: " + value));
    }
}

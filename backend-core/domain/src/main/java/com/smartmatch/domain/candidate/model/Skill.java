package com.smartmatch.domain.candidate.model;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class Skill {
    private Long id;
    private String name;

    public static Skill createStandard(String name) {
        if (name == null || name.trim().isEmpty()) {
            throw new IllegalArgumentException("Tên kỹ năng không được bỏ trống.");
        }
        return Skill.builder().name(name.trim().toLowerCase()).build();
    }
}
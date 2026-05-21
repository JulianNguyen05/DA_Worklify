package com.smartmatch.domain.candidate.model;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import java.time.LocalDate;

@Getter
@Builder
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class CandidateProfile {
    private Long id;
    private Long userId;
    private String fullName;
    private String phone;
    private String gender;
    private LocalDate dob;
    private String address;

    public static CandidateProfile create(Long userId, String fullName) {
        if (userId == null || fullName == null || fullName.trim().isEmpty()) {
            throw new IllegalArgumentException("Thông tin bắt buộc không hợp lệ.");
        }
        return CandidateProfile.builder()
                .userId(userId)
                .fullName(fullName)
                .build();
    }

    public void updateContactInfo(String phone, String address) {
        this.phone = phone;
        this.address = address;
    }
}
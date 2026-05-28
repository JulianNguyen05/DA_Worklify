package com.worklify.domain.candidate.model;

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
    private String summary;

    public static CandidateProfile create(Long userId, String fullName) {
        if (userId == null || fullName == null || fullName.trim().isEmpty()) {
            throw new IllegalArgumentException("Thông tin bắt buộc không hợp lệ.");
        }
        return CandidateProfile.builder()
                .userId(userId)
                .fullName(fullName)
                .build();
    }

    public void updateProfileDetails(String fullName, String phone, String gender,
                                     LocalDate dob, String address, String summary) {
        if (fullName == null || fullName.trim().isEmpty()) {
            throw new IllegalArgumentException("Họ tên không được để trống.");
        }
        this.fullName = fullName;
        this.phone = phone;
        this.gender = gender;
        this.dob = dob;
        this.address = address;
        this.summary = summary;
    }
}
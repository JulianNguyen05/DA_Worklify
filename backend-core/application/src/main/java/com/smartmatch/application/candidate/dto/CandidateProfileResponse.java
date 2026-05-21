package com.smartmatch.application.candidate.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
public class CandidateProfileResponse {
    private Long id;
    private Long userId;
    private String fullName;
    private String phone;
    private String gender;
    private LocalDate dob;
    private String address;
    private List<SkillResponse> skills;
}
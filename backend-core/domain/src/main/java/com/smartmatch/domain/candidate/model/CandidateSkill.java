package com.smartmatch.domain.candidate.model;

import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;

@Getter
@AllArgsConstructor
@EqualsAndHashCode
public class CandidateSkill {
    private final Long candidateId;
    private final Long skillId;
    private String level;
    private Integer yearsOfEx;
    private String note;
}
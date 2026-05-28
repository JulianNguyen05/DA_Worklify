package com.worklify.domain.candidate.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
@EqualsAndHashCode
public class CandidateSkill {
    private final Long candidateId;
    private final Long skillId;
    private String level;
    private Integer yearsOfEx;
    private String note;

    public CandidateSkill(Long candidateId, Long skillId) {
        this.candidateId = candidateId;
        this.skillId = skillId;
        this.level = "";
        this.yearsOfEx = 0;
        this.note = "";
    }
}
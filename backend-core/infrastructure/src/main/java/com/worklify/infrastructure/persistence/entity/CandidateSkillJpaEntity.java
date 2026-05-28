package com.worklify.infrastructure.persistence.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "candidate_skills")
@IdClass(CandidateSkillId.class) // Sử dụng khóa chính kép
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CandidateSkillJpaEntity {

    @Id
    @Column(name = "candidate_id", nullable = false)
    private Long candidateId;

    @Id
    @Column(name = "skill_id", nullable = false)
    private Long skillId;

    @Column(name = "level")
    private String level;

    @Column(name = "years_of_ex")
    private Integer yearsOfEx;

    @Column(name = "note")
    private String note;
}
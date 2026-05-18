package com.smartmatch.domain.candidate.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "candidate_skills")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CandidateSkill {
    @EmbeddedId
    private CandidateSkillId id;
}
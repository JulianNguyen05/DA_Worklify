package com.smartmatch.infrastructure.persistence.entity;
import java.io.Serializable;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CandidateSkillId implements Serializable {
    private Long candidateId;
    private Long skillId;
}
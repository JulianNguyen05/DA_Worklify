// File: \backend-core\infrastructure\src\main\java\com\smartmatch\infrastructure\persistence\entity\CandidateSkillJpaEntity.java
package com.smartmatch.infrastructure.persistence.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "candidate_skills",
        uniqueConstraints = @UniqueConstraint(columnNames = {"candidate_id", "skill_id"}))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CandidateSkillJpaEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "candidate_id", nullable = false)
    private Long candidateId;

    @Column(name = "skill_id", nullable = false)
    private Long skillId;
}
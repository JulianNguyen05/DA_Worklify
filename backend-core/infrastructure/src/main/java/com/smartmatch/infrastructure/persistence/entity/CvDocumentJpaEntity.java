// File: \backend-core\infrastructure\src\main\java\com\smartmatch\infrastructure\persistence\entity\CvDocumentJpaEntity.java
package com.smartmatch.infrastructure.persistence.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "cv_documents")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CvDocumentJpaEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "candidate_id", nullable = false)
    private Long candidateId;

    @Column(name = "file_path")
    private String filePath;

    @Column(name = "raw_text", columnDefinition = "LONGTEXT")
    private String rawText;

    @Column(name = "is_generated", nullable = false)
    private Boolean isGenerated;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
}


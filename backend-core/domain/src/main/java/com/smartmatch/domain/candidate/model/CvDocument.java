package com.smartmatch.domain.candidate.model;

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
public class CvDocument {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "candidate_id", nullable = false)
    private Long candidateId;

    @Column(name = "file_path", nullable = false)
    private String filePath;

    @Column(name = "raw_text", columnDefinition = "LONGTEXT")
    private String rawText;

    @Column(name = "is_generated", nullable = false)
    private Boolean isGenerated;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
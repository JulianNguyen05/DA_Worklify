// File: \backend-core\infrastructure\src\main\\java\com\smartmatch\infrastructure\persistence\entity\CvDocumentJpaEntity.java
package com.worklify.infrastructure.persistence.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "cv_documents")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EntityListeners(AuditingEntityListener.class) // ĐÃ THÊM: Lắng nghe sự kiện để tự động hóa điền dữ liệu auditing
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

    @CreatedDate // ĐÃ THÊM: Spring sẽ tự động lấy thời gian hiện tại gán vào đây khi insert bản ghi mới
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
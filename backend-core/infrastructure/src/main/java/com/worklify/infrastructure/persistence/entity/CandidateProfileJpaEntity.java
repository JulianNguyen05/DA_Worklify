package com.worklify.infrastructure.persistence.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "candidate_profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CandidateProfileJpaEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", unique = true, nullable = false)
    private Long userId;

    @Column(name = "full_name", nullable = false, length = 255)
    private String fullName;

    @Column(length = 20)
    private String phone;

    @Column(length = 20)
    private String gender;

    private LocalDate dob;

    @Column(length = 500)
    private String address;

    @Column(name = "summary", columnDefinition = "TEXT")
    private String summary;
}
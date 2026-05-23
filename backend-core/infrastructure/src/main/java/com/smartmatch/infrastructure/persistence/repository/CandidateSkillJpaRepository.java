package com.smartmatch.infrastructure.persistence.repository;

import com.smartmatch.infrastructure.persistence.entity.CandidateSkillJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional; // Bổ sung import này

@Repository
public interface CandidateSkillJpaRepository extends JpaRepository<CandidateSkillJpaEntity, Long> {

    // Tìm danh sách kỹ năng theo ứng viên
    List<CandidateSkillJpaEntity> findByCandidateId(Long candidateId);

    // Tìm chính xác 1 bản ghi kỹ năng của ứng viên (để phục vụ chức năng Update)
    Optional<CandidateSkillJpaEntity> findByCandidateIdAndSkillId(Long candidateId, Long skillId);

    // Xóa cụ thể 1 kỹ năng của ứng viên
    void deleteByCandidateIdAndSkillId(Long candidateId, Long skillId);

    // Xóa toàn bộ kỹ năng của ứng viên (dùng khi lưu CV Sandbox)
    void deleteByCandidateId(Long candidateId);
}
package com.worklify.infrastructure.persistence.mapper;

import com.worklify.domain.candidate.model.CandidateProfile;
import com.worklify.domain.candidate.model.CandidateSkill;
import com.worklify.domain.candidate.model.CvDocument;
import com.worklify.domain.candidate.model.Skill;
import com.worklify.infrastructure.persistence.entity.CandidateProfileJpaEntity;
import com.worklify.infrastructure.persistence.entity.CandidateSkillJpaEntity;
import com.worklify.infrastructure.persistence.entity.CvDocumentJpaEntity;
import com.worklify.infrastructure.persistence.entity.SkillJpaEntity;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;
import org.springframework.stereotype.Component;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
@Component
public interface CandidateEntityMapper {

    CandidateProfileJpaEntity toEntity(CandidateProfile profile);
    CandidateProfile toDomain(CandidateProfileJpaEntity entity);

    CvDocumentJpaEntity toEntity(CvDocument document);
    CvDocument toDomain(CvDocumentJpaEntity entity);

    SkillJpaEntity toEntity(Skill skill);
    Skill toDomain(SkillJpaEntity entity);

    // XÓA DÒNG @Mapping(target = "id", ignore = true) vì Entity không còn 'id'
    CandidateSkillJpaEntity toEntity(CandidateSkill candidateSkill);
    CandidateSkill toDomain(CandidateSkillJpaEntity entity);
}
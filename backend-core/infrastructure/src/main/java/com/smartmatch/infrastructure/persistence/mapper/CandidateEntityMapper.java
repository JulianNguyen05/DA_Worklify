package com.smartmatch.infrastructure.persistence.mapper;

import com.smartmatch.domain.candidate.model.CandidateProfile;
import com.smartmatch.domain.candidate.model.CandidateSkill;
import com.smartmatch.domain.candidate.model.CvDocument;
import com.smartmatch.domain.candidate.model.Skill;
import com.smartmatch.infrastructure.persistence.entity.CandidateProfileJpaEntity;
import com.smartmatch.infrastructure.persistence.entity.CandidateSkillJpaEntity;
import com.smartmatch.infrastructure.persistence.entity.CvDocumentJpaEntity;
import com.smartmatch.infrastructure.persistence.entity.SkillJpaEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface CandidateEntityMapper {

    CandidateProfileJpaEntity toEntity(CandidateProfile profile);
    CandidateProfile toDomain(CandidateProfileJpaEntity entity);

    CvDocumentJpaEntity toEntity(CvDocument document);
    CvDocument toDomain(CvDocumentJpaEntity entity);

    SkillJpaEntity toEntity(Skill skill);
    Skill toDomain(SkillJpaEntity entity);

    @Mapping(target = "id", ignore = true)
    CandidateSkillJpaEntity toEntity(CandidateSkill candidateSkill);
    CandidateSkill toDomain(CandidateSkillJpaEntity entity);
}

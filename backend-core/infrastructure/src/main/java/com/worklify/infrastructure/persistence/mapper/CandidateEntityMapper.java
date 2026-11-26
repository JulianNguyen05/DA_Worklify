package com.worklify.infrastructure.persistence.mapper;

import com.worklify.domain.candidate.model.*;
import com.worklify.infrastructure.persistence.entity.*;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
// Lombok sinh isCurrent() nên MapStruct gọi property là "current" nhưng builder lại là isCurrent(...):
// phải map tay, nếu không cờ "đang làm/đang học" bị bỏ qua khi lưu và khi đọc.
public interface CandidateEntityMapper {

    CandidateProfileJpaEntity toEntity(CandidateProfile profile);
    CandidateProfile toDomain(CandidateProfileJpaEntity entity);

    CvDocumentJpaEntity toEntity(CvDocument document);
    CvDocument toDomain(CvDocumentJpaEntity entity);

    CandidateSkillJpaEntity toEntity(CandidateSkill candidateSkill);
    CandidateSkill toDomain(CandidateSkillJpaEntity entity);

    @Mapping(target = "isCurrent", source = "current")
    EducationJpaEntity toEntity(Education education);
    @Mapping(target = "isCurrent", source = "current")
    Education toDomain(EducationJpaEntity entity);

    @Mapping(target = "isCurrent", source = "current")
    ExperienceJpaEntity toEntity(Experience experience);
    @Mapping(target = "isCurrent", source = "current")
    Experience toDomain(ExperienceJpaEntity entity);

    @Mapping(target = "isCurrent", source = "current")
    ProjectJpaEntity toEntity(Project project);
    @Mapping(target = "isCurrent", source = "current")
    Project toDomain(ProjectJpaEntity entity);

    CertificationJpaEntity toEntity(Certification certification);
    Certification toDomain(CertificationJpaEntity entity);

    @Mapping(target = "isCurrent", source = "current")
    ActivityJpaEntity toEntity(Activity activity);
    @Mapping(target = "isCurrent", source = "current")
    Activity toDomain(ActivityJpaEntity entity);

    AwardJpaEntity toEntity(Award award);
    Award toDomain(AwardJpaEntity entity);

    HobbyJpaEntity toEntity(Hobby hobby);
    Hobby toDomain(HobbyJpaEntity entity);

    LanguageJpaEntity toEntity(Language language);
    Language toDomain(LanguageJpaEntity entity);

    CandidateProfileLayoutJpaEntity toEntity(CandidateProfileLayout layout);
    CandidateProfileLayout toDomain(CandidateProfileLayoutJpaEntity entity);
}
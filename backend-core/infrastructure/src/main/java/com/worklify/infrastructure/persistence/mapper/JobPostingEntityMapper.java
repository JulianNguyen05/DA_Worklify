package com.worklify.infrastructure.persistence.mapper;

import com.worklify.domain.job.model.JobPosting;
import com.worklify.infrastructure.persistence.entity.JobPostingJpaEntity;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface JobPostingEntityMapper {
    JobPostingJpaEntity toEntity(JobPosting jobPosting);
    JobPosting toDomain(JobPostingJpaEntity entity);
}
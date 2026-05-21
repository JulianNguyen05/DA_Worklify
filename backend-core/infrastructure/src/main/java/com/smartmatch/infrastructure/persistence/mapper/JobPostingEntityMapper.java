package com.smartmatch.infrastructure.persistence.mapper;

import com.smartmatch.domain.job.model.JobPosting;
import com.smartmatch.domain.job.model.SavedJob;
import com.smartmatch.infrastructure.persistence.entity.JobPostingJpaEntity;
import com.smartmatch.infrastructure.persistence.entity.SavedJobJpaEntity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface JobPostingEntityMapper {

    JobPostingJpaEntity toEntity(JobPosting jobPosting);
    JobPosting toDomain(JobPostingJpaEntity entity);

    SavedJobJpaEntity toEntity(SavedJob savedJob);
    SavedJob toDomain(SavedJobJpaEntity entity);
}

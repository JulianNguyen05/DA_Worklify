package com.smartmatch.infrastructure.persistence.mapper;

import com.worklify.domain.job.model.JobPosting;
import com.worklify.domain.job.model.SavedJob;
import com.smartmatch.infrastructure.persistence.entity.JobPostingJpaEntity;
import com.smartmatch.infrastructure.persistence.entity.SavedJobJpaEntity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface JobPostingEntityMapper {
    // MapStruct sẽ tự hiểu khi tên trường và kiểu dữ liệu khớp nhau
    JobPostingJpaEntity toEntity(JobPosting jobPosting);
    JobPosting toDomain(JobPostingJpaEntity entity);

    SavedJobJpaEntity toEntity(SavedJob savedJob);
    SavedJob toDomain(SavedJobJpaEntity entity);
}
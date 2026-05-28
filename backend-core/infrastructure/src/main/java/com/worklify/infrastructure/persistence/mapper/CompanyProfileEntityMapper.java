package com.worklify.infrastructure.persistence.mapper;

import com.worklify.domain.employer.model.CompanyProfile;
import com.worklify.infrastructure.persistence.entity.CompanyProfileJpaEntity;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface CompanyProfileEntityMapper {
    CompanyProfileJpaEntity toEntity(CompanyProfile profile);
    CompanyProfile toDomain(CompanyProfileJpaEntity entity);
}
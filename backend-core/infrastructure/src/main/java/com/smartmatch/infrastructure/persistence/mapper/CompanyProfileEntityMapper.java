package com.smartmatch.infrastructure.persistence.mapper;

import com.worklify.domain.employer.model.CompanyProfile;
import com.smartmatch.infrastructure.persistence.entity.CompanyProfileJpaEntity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface CompanyProfileEntityMapper {

    CompanyProfileJpaEntity toEntity(CompanyProfile profile);

    CompanyProfile toDomain(CompanyProfileJpaEntity entity);
}

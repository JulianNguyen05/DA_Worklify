package com.smartmatch.application.job.service.impl;

import com.smartmatch.application.common.dto.PageResponse;
import com.smartmatch.application.job.dto.*;
import com.smartmatch.application.job.service.JobService;
import com.worklify.domain.common.DomainPage;
import com.worklify.domain.common.DomainPageable;
import com.worklify.domain.job.model.JobPosting;
import com.worklify.domain.job.model.JobStatus;
import com.worklify.domain.job.repository.JobPostingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class JobServiceImpl implements JobService {

    private final JobPostingRepository jobPostingRepository;

    @Override
    public JobPostingResponse createJobPosting(Long companyId, JobPostingRequest request) {
        JobPosting jobPosting = JobPosting.createNewJob(
                companyId,
                request.getTitle(),
                request.getDescription(),
                request.getRequirements(),
                request.getSalaryRange(),
                request.getLocation(),
                request.getWorkType(),
                request.getExpiresAt() // Đã sửa thành getExpiresAt()
        );

        JobPosting savedJob = jobPostingRepository.save(jobPosting);
        return mapToResponse(savedJob);
    }

    @Override
    public JobPostingResponse updateJobPosting(Long companyId, Long jobId, JobPostingRequest request) {
        JobPosting jobPosting = jobPostingRepository.findById(jobId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy tin tuyển dụng"));

        if (!jobPosting.getCompanyId().equals(companyId)) {
            throw new IllegalArgumentException("Bạn không có quyền chỉnh sửa tin tuyển dụng này");
        }

        jobPosting.updateDetails(
                request.getTitle(),
                request.getDescription(),
                request.getRequirements(),
                request.getSalaryRange(),
                request.getLocation(),
                request.getWorkType(),
                request.getExpiresAt() // Đã sửa thành getExpiresAt()
        );

        JobPosting updatedJob = jobPostingRepository.save(jobPosting);
        return mapToResponse(updatedJob);
    }

    @Override
    @Transactional(readOnly = true)
    public JobPostingResponse getJobById(Long jobId) {
        JobPosting jobPosting = jobPostingRepository.findById(jobId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy tin tuyển dụng"));
        return mapToResponse(jobPosting);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<JobPostingResponse> getJobsByCompany(Long companyId, DomainPageable pageable) {
        DomainPage<JobPosting> page = jobPostingRepository.findByCompanyId(companyId, pageable);
        return mapToPageResponse(page);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<JobPostingResponse> searchJobs(String keyword, String location, DomainPageable pageable) {
        DomainPage<JobPosting> page = jobPostingRepository.searchJobs(keyword, location, JobStatus.ACTIVE, pageable);
        return mapToPageResponse(page);
    }

    @Override
    public void saveJobForCandidate(Long candidateId, Long jobId) {
        JobPosting jobPosting = jobPostingRepository.findById(jobId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy tin tuyển dụng"));

        if (jobPosting.getStatus() != JobStatus.ACTIVE) {
            throw new IllegalArgumentException("Không thể lưu tin tuyển dụng không còn hoạt động");
        }
    }

    @Override
    public void unsaveJobForCandidate(Long candidateId, Long jobId) {
        // Logic xử lý hủy lưu tin tuyển dụng phục vụ Use Case của Ứng viên
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<SavedJobResponse> getSavedJobsByCandidate(Long candidateId, DomainPageable pageable) {
        return PageResponse.<SavedJobResponse>builder().build();
    }

    private JobPostingResponse mapToResponse(JobPosting job) {
        return JobPostingResponse.builder()
                .id(job.getId())
                .companyId(job.getCompanyId())
                .title(job.getTitle())
                .description(job.getDescription())
                .requirements(job.getRequirements())
                .salaryRange(job.getSalaryRange())
                .location(job.getLocation())
                .workType(job.getWorkType())
                .status(job.getStatus())
                .createdAt(job.getCreatedAt())
                .expiresAt(job.getExpiresAt()) // Đã sửa thành getExpiresAt() và expiresAt()
                .build();
    }

    private PageResponse<JobPostingResponse> mapToPageResponse(DomainPage<JobPosting> page) {
        return PageResponse.<JobPostingResponse>builder()
                .content(page.getContent().stream()
                        .map(this::mapToResponse)
                        .collect(Collectors.toList()))
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .pageNumber(page.getPageNumber())
                .pageSize(page.getPageSize())
                .build();
    }
}
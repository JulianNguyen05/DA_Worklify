package com.worklify.application.job.service.impl;

import com.worklify.application.common.dto.PageResponse;
import com.worklify.application.job.dto.JobPostingRequest;
import com.worklify.application.job.dto.JobPostingResponse;
import com.worklify.application.job.dto.SavedJobResponse;
import com.worklify.application.job.service.JobService;
import com.worklify.domain.common.DomainPage;
import com.worklify.domain.common.DomainPageable;
import com.worklify.domain.job.model.JobPosting;
import com.worklify.domain.job.model.JobStatus;
import com.worklify.domain.job.model.SavedJob;
import com.worklify.domain.job.repository.JobPostingRepository;
import com.worklify.domain.job.repository.SavedJobRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class JobServiceImpl implements JobService {

    private final JobPostingRepository jobPostingRepository;
    private final SavedJobRepository savedJobRepository;

    @Override
    public JobPostingResponse createJobPosting(Long companyId, JobPostingRequest request) {
        JobPosting job = JobPosting.createNewJob(
                companyId,
                request.getTitle(),
                request.getDescription(),
                request.getRequirements(),
                request.getSalaryRange(),
                request.getLocation(),
                request.getWorkType(),
                request.getExpiresAt()
        );
        return mapToResponse(jobPostingRepository.save(job));
    }

    @Override
    public JobPostingResponse updateJobPosting(Long companyId, Long jobId, JobPostingRequest request) {
        JobPosting job = jobPostingRepository.findById(jobId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy tin tuyển dụng"));

        if (!job.getCompanyId().equals(companyId)) {
            throw new IllegalArgumentException("Bạn không có quyền chỉnh sửa tin tuyển dụng này");
        }

        job.updateDetails(
                request.getTitle(),
                request.getDescription(),
                request.getRequirements(),
                request.getSalaryRange(),
                request.getLocation(),
                request.getWorkType(),
                request.getExpiresAt()
        );
        return mapToResponse(jobPostingRepository.save(job));
    }

    @Override
    @Transactional(readOnly = true)
    public JobPostingResponse getJobById(Long jobId) {
        return mapToResponse(
                jobPostingRepository.findById(jobId)
                        .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy tin tuyển dụng"))
        );
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<JobPostingResponse> getJobsByCompany(Long companyId, DomainPageable pageable) {
        return mapToPageResponse(jobPostingRepository.findByCompanyId(companyId, pageable));
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<JobPostingResponse> searchJobs(String keyword, String location, DomainPageable pageable) {
        return mapToPageResponse(jobPostingRepository.searchJobs(keyword, location, JobStatus.ACTIVE, pageable));
    }

    @Override
    public void saveJobForCandidate(Long candidateId, Long jobId) {
        JobPosting job = jobPostingRepository.findById(jobId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy tin tuyển dụng"));

        if (job.getStatus() != JobStatus.ACTIVE) {
            throw new IllegalArgumentException("Không thể lưu tin tuyển dụng không còn hoạt động.");
        }

        if (savedJobRepository.findByCandidateIdAndJobId(candidateId, jobId).isPresent()) {
            throw new IllegalArgumentException("Bạn đã lưu tin tuyển dụng này rồi.");
        }

        savedJobRepository.save(SavedJob.markAsSaved(candidateId, jobId));
    }

    @Override
    public void unsaveJobForCandidate(Long candidateId, Long jobId) {
        SavedJob saved = savedJobRepository.findByCandidateIdAndJobId(candidateId, jobId)
                .orElseThrow(() -> new IllegalArgumentException("Bạn chưa lưu tin tuyển dụng này."));
        savedJobRepository.delete(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<SavedJobResponse> getSavedJobsByCandidate(Long candidateId, DomainPageable pageable) {
        DomainPage<SavedJob> page = savedJobRepository.findByCandidateId(candidateId, pageable);

        return PageResponse.<SavedJobResponse>builder()
                .content(page.getContent().stream()
                        .map(saved -> {
                            JobPostingResponse jobResponse = jobPostingRepository.findById(saved.getJobId())
                                    .map(this::mapToResponse)
                                    .orElse(null);
                            return SavedJobResponse.builder()
                                    .id(saved.getId())
                                    .candidateId(saved.getCandidateId())
                                    .job(jobResponse)
                                    .savedAt(saved.getSavedAt())
                                    .build();
                        })
                        .collect(Collectors.toList()))
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .pageNumber(page.getPageNumber())
                .pageSize(page.getPageSize())
                .build();
    }

    // ====================================================
    // PRIVATE HELPERS
    // ====================================================

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
                .expiresAt(job.getExpiresAt())
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
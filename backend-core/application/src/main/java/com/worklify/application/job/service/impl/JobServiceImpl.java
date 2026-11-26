package com.worklify.application.job.service.impl;

import com.worklify.application.common.dto.PageResponse;
import com.worklify.application.common.exception.ForbiddenOperationException;
import com.worklify.application.common.exception.ResourceNotFoundException;
import com.worklify.application.common.security.AccessControlService;
import com.worklify.application.job.dto.JobPostingRequest;
import com.worklify.application.job.dto.JobPostingResponse;
import com.worklify.application.job.dto.SavedJobResponse;
import com.worklify.application.job.service.JobService;
import com.worklify.domain.auth.model.Role;
import com.worklify.domain.auth.repository.UserRepository;
import com.worklify.domain.common.DomainPage;
import com.worklify.domain.common.DomainPageable;
import com.worklify.domain.employer.model.CompanyProfile;
import com.worklify.domain.employer.model.VerificationStatus;
import com.worklify.domain.employer.repository.CompanyProfileRepository;
import com.worklify.domain.job.model.JobPosting;
import com.worklify.domain.job.model.JobSearchFilter;
import com.worklify.domain.job.model.JobStatus;
import com.worklify.domain.job.model.SavedJob;
import com.worklify.domain.job.repository.JobPostingRepository;
import com.worklify.domain.job.repository.SavedJobRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class JobServiceImpl implements JobService {

    private final JobPostingRepository jobPostingRepository;
    private final SavedJobRepository savedJobRepository;
    private final CompanyProfileRepository companyProfileRepository;
    private final UserRepository userRepository;
    private final AccessControlService accessControlService;

    @Override
    public JobPostingResponse createJobPosting(Long companyId, JobPostingRequest request) {
        CompanyProfile company = companyProfileRepository.findById(companyId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy hồ sơ doanh nghiệp."));
        if (company.getVerificationStatus() == VerificationStatus.REJECTED) {
            throw new ForbiddenOperationException(
                    "Hồ sơ doanh nghiệp đã bị từ chối, vui lòng cập nhật hồ sơ để được duyệt lại trước khi đăng tin.");
        }

        JobPosting job = JobPosting.createNewJob(
                companyId,
                request.getTitle(),
                request.getDescription(),
                request.getRequirements(),
                request.getSalaryRange(),
                request.getSalaryMin(),
                request.getSalaryMax(),
                request.getLocation(),
                request.getWorkType(),
                request.getExpiresAt()
        );
        return mapToResponse(jobPostingRepository.save(job));
    }

    @Override
    public JobPostingResponse updateJobPosting(Long companyId, Long jobId, JobPostingRequest request) {
        JobPosting job = findOwnedJob(companyId, jobId);
        job.updateDetails(
                request.getTitle(),
                request.getDescription(),
                request.getRequirements(),
                request.getSalaryRange(),
                request.getSalaryMin(),
                request.getSalaryMax(),
                request.getLocation(),
                request.getWorkType(),
                request.getExpiresAt()
        );
        return mapToResponse(jobPostingRepository.save(job));
    }

    @Override
    public JobPostingResponse closeJobPosting(Long companyId, Long jobId) {
        JobPosting job = findOwnedJob(companyId, jobId);
        job.closeJob();
        return mapToResponse(jobPostingRepository.save(job));
    }

    @Override
    @Transactional(readOnly = true)
    public JobPostingResponse getJobForViewer(Long jobId, String viewerEmail) {
        JobPosting job = jobPostingRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy tin tuyển dụng"));

        // Tin ACTIVE/CLOSED ai cũng xem được (tin đã đóng vẫn giữ link cho ứng viên đã nộp);
        // tin chờ duyệt hoặc bị từ chối chỉ chủ tin và admin xem được.
        boolean publiclyVisible = job.getStatus() == JobStatus.ACTIVE || job.getStatus() == JobStatus.CLOSED;
        if (!publiclyVisible && !isAdmin(viewerEmail) && !accessControlService.ownsJob(jobId, viewerEmail)) {
            throw new ResourceNotFoundException("Không tìm thấy tin tuyển dụng");
        }
        return mapToResponse(job);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<JobPostingResponse> getJobsByCompany(Long companyId, DomainPageable pageable) {
        return mapToPageResponse(jobPostingRepository.findByCompanyId(companyId, pageable));
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<JobPostingResponse> searchJobs(JobSearchFilter filter, DomainPageable pageable) {
        return mapToPageResponse(jobPostingRepository.searchOpenJobs(filter, LocalDateTime.now(), pageable));
    }

    @Override
    public void saveJobForCandidate(Long candidateId, Long jobId) {
        JobPosting job = jobPostingRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy tin tuyển dụng"));

        // Lưu lại lần nữa coi như thành công (idempotent), không báo lỗi
        if (savedJobRepository.findByCandidateIdAndJobId(candidateId, jobId).isPresent()) {
            return;
        }
        if (job.getStatus() != JobStatus.ACTIVE) {
            throw new IllegalArgumentException("Không thể lưu tin tuyển dụng không còn hoạt động.");
        }
        savedJobRepository.save(SavedJob.markAsSaved(candidateId, jobId));
    }

    @Override
    public void unsaveJobForCandidate(Long candidateId, Long jobId) {
        savedJobRepository.findByCandidateIdAndJobId(candidateId, jobId)
                .ifPresent(savedJobRepository::delete);
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

    @Override
    @Transactional(readOnly = true)
    public List<Long> getSavedJobIds(Long candidateId) {
        return savedJobRepository.findJobIdsByCandidateId(candidateId);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<JobPostingResponse> getPublicJobsByCompany(Long companyId, DomainPageable pageable) {
        // Chỉ tin đang mở và còn hạn cho trang công khai
        return mapToPageResponse(jobPostingRepository.findOpenJobsByCompany(companyId, LocalDateTime.now(), pageable));
    }

    // ====================================================
    // PRIVATE HELPERS
    // ====================================================

    private JobPosting findOwnedJob(Long companyId, Long jobId) {
        JobPosting job = jobPostingRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy tin tuyển dụng"));
        if (!job.getCompanyId().equals(companyId)) {
            throw new ForbiddenOperationException("Bạn không có quyền thao tác trên tin tuyển dụng này");
        }
        return job;
    }

    private boolean isAdmin(String email) {
        return email != null && userRepository.findByEmail(email)
                .map(u -> u.getRole() == Role.ADMIN)
                .orElse(false);
    }

    private JobPostingResponse mapToResponse(JobPosting job) {
        CompanyProfile companyProfile = companyProfileRepository.findById(job.getCompanyId()).orElse(null);
        String companyName = companyProfile != null ? companyProfile.getCompanyName() : null;
        String logoUrl = companyProfile != null ? companyProfile.getLogoUrl() : null;

        return JobPostingResponse.builder()
                .id(job.getId())
                .companyId(job.getCompanyId())
                .companyName(companyName)
                .logoUrl(logoUrl)
                .title(job.getTitle())
                .description(job.getDescription())
                .requirements(job.getRequirements())
                .salaryRange(job.getSalaryRange())
                .salaryMin(job.getSalaryMin())
                .salaryMax(job.getSalaryMax())
                .location(job.getLocation())
                .workType(job.getWorkType())
                .status(job.getStatus())
                .createdAt(job.getCreatedAt())
                .expiresAt(job.getExpiresAt())
                .openForApplications(job.isOpenForApplications(LocalDateTime.now()))
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

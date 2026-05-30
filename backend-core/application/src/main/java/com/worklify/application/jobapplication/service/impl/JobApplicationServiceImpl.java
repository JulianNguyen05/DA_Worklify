package com.worklify.application.jobapplication.service.impl;

import com.worklify.application.common.dto.PageResponse;
import com.worklify.application.jobapplication.dto.ApplicationRequest;
import com.worklify.application.jobapplication.dto.ApplicationResponse;
import com.worklify.application.jobapplication.service.JobApplicationService;
import com.worklify.domain.application.model.Application;
import com.worklify.domain.application.model.ApplicationStatus;
import com.worklify.domain.application.repository.ApplicationRepository;
import com.worklify.domain.candidate.model.CandidateProfile;
import com.worklify.domain.candidate.model.CvDocument;
import com.worklify.domain.candidate.repository.CandidateProfileRepository;
import com.worklify.domain.candidate.repository.CvDocumentRepository;
import com.worklify.domain.common.DomainPage;
import com.worklify.domain.common.DomainPageable;
import com.worklify.domain.employer.model.CompanyProfile;
import com.worklify.domain.employer.repository.CompanyProfileRepository;
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
public class JobApplicationServiceImpl implements JobApplicationService {

    private final ApplicationRepository applicationRepository;
    private final JobPostingRepository jobPostingRepository;
    private final CompanyProfileRepository companyProfileRepository;
    private final CvDocumentRepository cvDocumentRepository;

    // BỔ SUNG: Inject CandidateProfileRepository thay vì UserRepository
    private final CandidateProfileRepository candidateProfileRepository;

    @Override
    public ApplicationResponse applyJob(Long candidateId, ApplicationRequest request) {
        // 1. Kiểm tra tính hợp lệ của Tin tuyển dụng từ JobPostingRepository port
        JobPosting jobPosting = jobPostingRepository.findById(request.getJobId())
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy tin tuyển dụng tương ứng"));

        if (jobPosting.getStatus() != JobStatus.ACTIVE) {
            throw new IllegalArgumentException("Tin tuyển dụng hiện tại không còn hoạt động hoặc đã đóng");
        }

        // 2. Khởi tạo đối tượng Rich Domain Model theo đúng phương thức factory có sẵn trong file Domain
        Application application = Application.createNew(
                request.getJobId(),
                request.getCvId(),
                candidateId,
                request.getCoverLetter()
        );

        // 3. Persist thực thể xuống cơ sở dữ liệu qua ApplicationRepository port
        Application savedApplication = applicationRepository.save(application);

        return mapToResponse(savedApplication);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<ApplicationResponse> getApplicationsByCandidate(Long candidateId, DomainPageable pageable) {
        DomainPage<Application> page = applicationRepository.findByCandidateId(candidateId, pageable);
        return mapToPageResponse(page);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<ApplicationResponse> getApplicationsForReviewBoard(Long jobId, DomainPageable pageable) {
        DomainPage<Application> page = applicationRepository.findByJobId(jobId, pageable);

        return mapToPageResponse(page);
    }

    @Override
    public void updateApplicationStatus(Long companyId, Long applicationId, ApplicationStatus status) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy đơn ứng tuyển"));

        JobPosting jobPosting = jobPostingRepository.findById(application.getJobId())
                .orElseThrow(() -> new IllegalArgumentException("Tin tuyển dụng liên kết không tồn tại"));

        // Kiểm tra quyền sở hữu công việc thuộc về doanh nghiệp thực hiện thao tác
        if (!jobPosting.getCompanyId().equals(companyId)) {
            throw new IllegalArgumentException("Bạn không có quyền thay đổi trạng thái đơn ứng tuyển của công việc này");
        }

        // Thay đổi trạng thái thông qua phương thức hành vi đóng gói sẵn của Domain Model
        application.updateStatus(status);
        applicationRepository.save(application);
    }

    // Mapper helper: Ánh xạ đầy đủ thông tin dành cho Ứng viên hoặc Nhà tuyển dụng sở hữu
    private ApplicationResponse mapToResponse(Application app) {

        // 1. Tìm thông tin Job
        JobPosting job = jobPostingRepository.findById(app.getJobId()).orElse(null);
        String jobTitle = (job != null) ? job.getTitle() : null;

        // 2. Tìm thông tin Công ty (Dựa vào companyId của Job)
        String companyName = null;
        String companyLogo = null;
        if (job != null) {
            CompanyProfile company = companyProfileRepository.findById(job.getCompanyId()).orElse(null);
            if (company != null) {
                companyName = company.getCompanyName();
                companyLogo = company.getLogoUrl();
            }
        }

        // 3. Tìm thông tin file CV
        CvDocument cv = cvDocumentRepository.findById(app.getCvId()).orElse(null);
        String cvFileName = (cv != null) ? cv.getFileName() : null;

        // 4. BỔ SUNG: Lấy thông tin Tên ứng viên từ CandidateProfile
        String candidateName = null;
        if (app.getCandidateId() != null) {
            CandidateProfile candidate = candidateProfileRepository.findByUserId(app.getCandidateId()).orElse(null);
            candidateName = (candidate != null) ? candidate.getFullName() : null;
        }

        return ApplicationResponse.builder()
                .id(app.getId())
                .jobId(app.getJobId())
                .cvId(app.getCvId())
                .candidateId(app.getCandidateId())
                .coverLetter(app.getCoverLetter())
                .status(app.getStatus())
                .appliedAt(app.getAppliedAt())
                .blindTestUrl(null)
                .jobTitle(jobTitle)
                .companyName(companyName)
                .companyLogo(companyLogo)
                .cvFileName(cvFileName)
                .candidateName(candidateName) // TRUYỀN TÊN VÀO DTO
                .build();
    }

    // Mapper helper: Chuyển đổi dữ liệu phân trang từ Domain sang Application DTO
    private PageResponse<ApplicationResponse> mapToPageResponse(DomainPage<Application> page) {
        return PageResponse.<ApplicationResponse>builder()
                .content(page.getContent().stream()
                        .map(this::mapToResponse)
                        .collect(Collectors.toList()))
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .build();
    }
}
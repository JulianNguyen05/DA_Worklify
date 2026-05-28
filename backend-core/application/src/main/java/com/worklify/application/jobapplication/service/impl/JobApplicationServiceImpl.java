// File: \backend-core\application\src\main\java\com\smartmatch\application\jobapplication\service\impl\JobApplicationServiceImpl.java
package com.worklify.application.jobapplication.service.impl;

import com.worklify.application.common.dto.PageResponse;
import com.smartmatch.application.jobapplication.dto.*;
import com.worklify.application.jobapplication.dto.ApplicationRequest;
import com.worklify.application.jobapplication.dto.ApplicationResponse;
import com.worklify.application.jobapplication.service.JobApplicationService;
import com.worklify.domain.application.model.Application;
import com.worklify.domain.application.model.ApplicationStatus;
import com.worklify.domain.application.repository.ApplicationRepository;
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
public class JobApplicationServiceImpl implements JobApplicationService {

    private final ApplicationRepository applicationRepository;
    private final JobPostingRepository jobPostingRepository;

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

        // Trả về dữ liệu ẩn danh (Khử định danh danh tính để phục vụ tính minh bạch của hội đồng sơ tuyển)
        return PageResponse.<ApplicationResponse>builder()
                .content(page.getContent().stream()
                        .map(this::mapToBlindResponse)
                        .collect(Collectors.toList()))
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .build();
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
        return ApplicationResponse.builder()
                .id(app.getId())
                .jobId(app.getJobId())
                .cvId(app.getCvId())
                .candidateId(app.getCandidateId())
                .coverLetter(app.getCoverLetter())
                .status(app.getStatus())
                .appliedAt(app.getAppliedAt())// Đồng bộ Token định danh ẩn danh
                .build();
    }

    // Mapper helper: Ẩn danh hóa thông tin (Gán null cho cvId, candidateId) phục vụ Review Board
    private ApplicationResponse mapToBlindResponse(Application app) {
        return ApplicationResponse.builder()
                .id(app.getId())
                .jobId(app.getJobId())
                .cvId(null)          // Khử liên kết đến CV gốc
                .candidateId(null)   // Khử định danh Ứng viên
                .coverLetter(app.getCoverLetter())
                .status(app.getStatus())
                .appliedAt(app.getAppliedAt())// Chỉ cung cấp mã Token kiểm tra ẩn danh
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
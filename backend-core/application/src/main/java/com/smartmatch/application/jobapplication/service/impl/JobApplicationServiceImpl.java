// File: \backend-core\application\src\main\java\com\smartmatch\application\jobapplication\service\impl\JobApplicationServiceImpl.java
package com.smartmatch.application.jobapplication.service.impl;

import com.smartmatch.application.common.dto.PageResponse;
import com.smartmatch.application.jobapplication.dto.*;
import com.smartmatch.application.jobapplication.service.JobApplicationService;
import com.smartmatch.domain.application.model.Application;
import com.smartmatch.domain.application.model.ApplicationStatus;
import com.smartmatch.domain.application.model.AiMatchScore;
import com.smartmatch.domain.application.repository.ApplicationRepository;
import com.smartmatch.domain.application.repository.AiMatchScoreRepository;
import com.smartmatch.domain.common.DomainPage;
import com.smartmatch.domain.common.DomainPageable;
import com.smartmatch.domain.job.model.JobPosting;
import com.smartmatch.domain.job.model.JobStatus;
import com.smartmatch.domain.job.repository.JobPostingRepository;
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
    private final AiMatchScoreRepository aiMatchScoreRepository;

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

        // 4. Gọi luồng phân tích AI bất đồng bộ
        this.triggerAiMatchingAsync(savedApplication.getId());

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

    @Override
    public void triggerAiMatchingAsync(Long applicationId) {
        // [Ý ĐỒ THIẾT KẾ KIẾN TRÚC]: Xử lý bất đồng bộ (Event-Driven Async via Message Broker) chống nghẽn hệ thống (5-8s ML Process)
        // Hiện tại gán tạm hành vi sinh mã Blind Testing của Domain trước khi hệ thống kích hoạt Consumer lắng nghe
        applicationRepository.findById(applicationId).ifPresent(app -> {
            app.enableBlindTesting();
            applicationRepository.save(app);

            // Giả lập lưu kết quả Match Score ban đầu từ mô hình phân tích học máy
            AiMatchScore mockScore = AiMatchScore.evaluate(applicationId, 85.0f, "Hồ sơ đáp ứng tốt các tiêu chí cốt lõi.");
            aiMatchScoreRepository.save(mockScore);
        });
    }

    @Override
    @Transactional(readOnly = true)
    public AiMatchScoreResponse getAiMatchResult(Long applicationId) {
        AiMatchScore score = aiMatchScoreRepository.findByApplicationId(applicationId)
                .orElseThrow(() -> new IllegalArgumentException("Chưa có kết quả phân tích AI cho đơn ứng tuyển này"));

        return AiMatchScoreResponse.builder()
                .id(score.getId())
                .applicationId(score.getApplicationId())
                .confidenceScore(score.getConfidenceScore())
                .analysisDetails(score.getAnalysisDetails())
                .build();
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
                .appliedAt(app.getAppliedAt())
                .blindTestUrl(app.getBlindTestToken()) // Đồng bộ Token định danh ẩn danh
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
                .appliedAt(app.getAppliedAt())
                .blindTestUrl(app.getBlindTestToken()) // Chỉ cung cấp mã Token kiểm tra ẩn danh
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
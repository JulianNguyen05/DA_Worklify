package com.smartmatch.application.jobapplication.service;

import com.smartmatch.application.jobapplication.dto.ApplicationRequest;
import com.smartmatch.application.jobapplication.dto.ApplicationResponse;
import com.smartmatch.domain.application.model.ApplicationStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Port (Use-case interface) cho Bounded Context Application (Ứng tuyển).
 * Xử lý nộp đơn, theo dõi trạng thái và tích hợp với AI Engine.
 */
public interface JobApplicationService {

    /**
     * Ứng viên nộp hồ sơ cho một vị trí công việc.
     */
    ApplicationResponse applyForJob(Long candidateId, ApplicationRequest request);

    /**
     * Lấy danh sách hồ sơ ứng viên đã nộp (Dành cho Ứng viên theo dõi).
     */
    Page<ApplicationResponse> getApplicationsByCandidate(Long candidateId, Pageable pageable);

    /**
     * Lấy danh sách hồ sơ nộp vào một công việc cụ thể (Dành cho Nhà tuyển dụng sàng lọc).
     */
    Page<ApplicationResponse> getApplicationsByJob(Long companyId, Long jobId, Pageable pageable);

    /**
     * Xem chi tiết một đơn ứng tuyển.
     */
    ApplicationResponse getApplicationDetail(Long applicationId);

    /**
     * Nhà tuyển dụng chuyển trạng thái đơn ứng tuyển (Ví dụ: Từ PENDING sang REVIEWED/ACCEPTED).
     * Hệ thống có thể trigger gửi email thông báo ở implementation.
     */
    void updateApplicationStatus(Long companyId, Long applicationId, ApplicationStatus status);

    /**
     * Kích hoạt tiến trình gửi CV sang Backend-ML (Python) để phân tích và chấm điểm.
     * Thường là call API nội bộ (Internal API).
     */
    void triggerAiMatching(Long applicationId);
}
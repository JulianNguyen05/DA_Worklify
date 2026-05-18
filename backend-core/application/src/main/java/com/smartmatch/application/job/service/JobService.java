package com.smartmatch.application.job.service;

import com.smartmatch.application.job.dto.JobPostingRequest;
import com.smartmatch.application.job.dto.JobPostingResponse;
import com.smartmatch.domain.job.model.JobStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Port (Use-case interface) cho Bounded Context Job.
 * Quản lý vòng đời của tin tuyển dụng (Job Posting).
 */
public interface JobService {

    /**
     * Nhà tuyển dụng tạo tin tuyển dụng mới.
     * Trạng thái mặc định thường là PENDING (chờ kiểm duyệt) hoặc ACTIVE tùy business.
     */
    JobPostingResponse createJobPosting(Long companyId, JobPostingRequest request);

    /**
     * Nhà tuyển dụng cập nhật tin tuyển dụng.
     */
    JobPostingResponse updateJobPosting(Long companyId, Long jobId, JobPostingRequest request);

    /**
     * Lấy chi tiết một tin tuyển dụng (Public cho Ứng viên).
     */
    JobPostingResponse getJobById(Long jobId);

    /**
     * Lấy danh sách tin tuyển dụng của một công ty cụ thể.
     */
    Page<JobPostingResponse> getJobsByCompanyId(Long companyId, Pageable pageable);

    /**
     * Lấy danh sách tin tuyển dụng đang ACTIVE để hiển thị trên Job Board (Public).
     * Có thể mở rộng thêm filter (từ khóa, địa điểm) trong tương lai.
     */
    Page<JobPostingResponse> searchActiveJobs(String keyword, String location, Pageable pageable);

    /**
     * Admin hoặc Nhà tuyển dụng thay đổi trạng thái tin tuyển dụng (Duyệt, Khóa, Đóng).
     */
    void changeJobStatus(Long jobId, JobStatus status);
}
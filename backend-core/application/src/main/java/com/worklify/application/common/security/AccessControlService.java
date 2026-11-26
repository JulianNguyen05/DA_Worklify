package com.worklify.application.common.security;

/**
 * Kiểm tra quyền sở hữu tài nguyên của người đang đăng nhập (xác định bằng email trong JWT).
 *
 * Dùng trong {@code @PreAuthorize} ở controller, ví dụ:
 * {@code @PreAuthorize("hasRole('CANDIDATE') and @accessControl.isSelf(#userId, authentication.name)")}.
 * Trả về false thay vì ném lỗi để Spring Security tự trả 403.
 */
public interface AccessControlService {

    /** userId trên URL có đúng là người đang đăng nhập không. */
    boolean isSelf(Long userId, String email);

    /** Người đang đăng nhập có phải chủ của hồ sơ công ty companyId không. */
    boolean ownsCompany(Long companyId, String email);

    /** Người đang đăng nhập có phải chủ công ty đăng tin jobId không. */
    boolean ownsJob(Long jobId, String email);

    /** Ứng viên nộp đơn, hoặc nhà tuyển dụng sở hữu tin của đơn. */
    boolean canViewApplication(Long applicationId, String email);

    /** Chủ CV, hoặc nhà tuyển dụng đã nhận đơn ứng tuyển dùng CV này. */
    boolean canViewCv(Long cvId, String email);

    /** id người dùng của email đang đăng nhập; ném ForbiddenOperationException nếu không tìm thấy. */
    Long requireUserId(String email);
}

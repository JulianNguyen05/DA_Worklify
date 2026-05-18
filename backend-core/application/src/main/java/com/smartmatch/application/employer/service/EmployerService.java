package com.smartmatch.application.employer.service;

import com.smartmatch.application.candidate.dto.CandidateProfileResponse;
import com.smartmatch.application.employer.dto.CompanyProfileRequest;
import com.smartmatch.application.employer.dto.CompanyProfileResponse;
import com.smartmatch.domain.employer.model.VerificationStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

/**
 * Port (Use-case interface) cho Bounded Context Employer.
 * Quản lý hồ sơ doanh nghiệp, xác minh pháp lý và logo công ty.
 */
public interface EmployerService {

    /**
     * Tạo hồ sơ doanh nghiệp lần đầu (sau khi đăng ký tài khoản EMPLOYER).
     * Ràng buộc: mỗi userId chỉ có đúng 1 hồ sơ công ty (quan hệ 1-1).
     * Trạng thái mặc định: PENDING (chờ Admin kiểm duyệt).
     *
     * @param userId  ID tài khoản nhà tuyển dụng
     * @param request thông tin công ty cần tạo
     * @return hồ sơ công ty vừa được tạo
     */
    CompanyProfileResponse createProfile(Long userId, CompanyProfileRequest request);

    /**
     * Cập nhật thông tin hồ sơ doanh nghiệp.
     * Nghiệp vụ: sau khi cập nhật, trạng thái verification_status reset về PENDING
     * nếu có thay đổi thông tin pháp lý quan trọng.
     *
     * @param userId  ID tài khoản nhà tuyển dụng
     * @param request thông tin cần cập nhật
     * @return hồ sơ công ty sau khi cập nhật
     */
    CompanyProfileResponse updateProfile(Long userId, CompanyProfileRequest request);

    /**
     * Lấy hồ sơ doanh nghiệp theo userId.
     *
     * @param userId ID tài khoản nhà tuyển dụng
     * @return hồ sơ doanh nghiệp
     */
    CompanyProfileResponse getProfileByUserId(Long userId);

    /**
     * Lấy hồ sơ doanh nghiệp theo ID hồ sơ công ty (public endpoint).
     *
     * @param companyId ID hồ sơ công ty
     * @return hồ sơ doanh nghiệp
     */
    CompanyProfileResponse getProfileById(Long companyId);

    /**
     * Tải lên ảnh logo công ty.
     * Nghiệp vụ: kiểm tra MIME type (JPG/PNG), giới hạn 5MB, lưu lại logo_url.
     *
     * @param userId ID tài khoản nhà tuyển dụng
     * @param logo   file ảnh logo
     * @return hồ sơ công ty sau khi cập nhật logo
     */
    CompanyProfileResponse uploadLogo(Long userId, MultipartFile logo);

    /**
     * Admin: Lấy danh sách tất cả công ty có phân trang, có thể lọc theo trạng thái.
     *
     * @param status   trạng thái xác minh để lọc (có thể null)
     * @param pageable thông tin phân trang
     * @return danh sách hồ sơ công ty
     */
    Page<CompanyProfileResponse> getAllCompanies(VerificationStatus status, Pageable pageable);

    /**
     * Admin: Phê duyệt hoặc từ chối hồ sơ doanh nghiệp.
     * Sau khi phê duyệt (APPROVED), nhà tuyển dụng mới có thể đăng tin.
     *
     * @param companyId          ID hồ sơ công ty
     * @param verificationStatus trạng thái xác minh mới (APPROVED / REJECTED)
     */
    void updateVerificationStatus(Long companyId, VerificationStatus verificationStatus);

    /**
     * Tìm kiếm ứng viên chủ động dựa trên từ khóa kỹ năng (Dành cho nhà tuyển dụng đã xác thực).
     */
    Page<CandidateProfileResponse> searchCandidatesBySkill(String skillName, Pageable pageable);
}
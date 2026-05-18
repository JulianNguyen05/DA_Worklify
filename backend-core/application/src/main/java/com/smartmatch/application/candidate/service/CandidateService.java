package com.smartmatch.application.candidate.service;

import com.smartmatch.application.candidate.dto.CandidateProfileRequest;
import com.smartmatch.application.candidate.dto.CandidateProfileResponse;
import com.smartmatch.application.candidate.dto.CvDocumentResponse;
import com.smartmatch.application.candidate.dto.SkillResponse;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/**
 * Port (Use-case interface) cho Bounded Context Candidate.
 * Quản lý vòng đời dữ liệu ứng viên: hồ sơ, CV, kỹ năng.
 */
public interface CandidateService {

    /**
     * Tạo hồ sơ cá nhân cho ứng viên sau khi đăng ký.
     * Ràng buộc: mỗi userId chỉ có đúng 1 hồ sơ (quan hệ 1-1 với User).
     *
     * @param userId  ID tài khoản ứng viên
     * @param request thông tin hồ sơ cần tạo
     * @return hồ sơ ứng viên vừa được tạo
     */
    CandidateProfileResponse createProfile(Long userId, CandidateProfileRequest request);

    /**
     * Cập nhật thông tin hồ sơ cá nhân ứng viên.
     *
     * @param userId  ID tài khoản ứng viên
     * @param request thông tin hồ sơ cần cập nhật
     * @return hồ sơ ứng viên sau khi cập nhật
     */
    CandidateProfileResponse updateProfile(Long userId, CandidateProfileRequest request);

    /**
     * Lấy hồ sơ ứng viên theo userId.
     *
     * @param userId ID tài khoản
     * @return hồ sơ ứng viên kèm danh sách kỹ năng
     */
    CandidateProfileResponse getProfileByUserId(Long userId);

    /**
     * Tải lên file CV (PDF hoặc Word) lên server.
     * Nghiệp vụ: kiểm tra MIME type, giới hạn 5MB, lưu file_path và raw_text.
     *
     * @param userId ID tài khoản ứng viên
     * @param file   file CV cần tải lên
     * @return thông tin tài liệu CV vừa lưu
     */
    CvDocumentResponse uploadCv(Long userId, MultipartFile file);

    /**
     * Lấy danh sách tất cả các phiên bản CV của ứng viên.
     *
     * @param userId ID tài khoản ứng viên
     * @return danh sách CV (1 ứng viên có thể có nhiều phiên bản CV)
     */
    List<CvDocumentResponse> getCvsByUserId(Long userId);

    /**
     * Xóa một phiên bản CV.
     *
     * @param userId     ID tài khoản ứng viên (để kiểm tra quyền sở hữu)
     * @param cvId       ID tài liệu CV cần xóa
     */
    void deleteCv(Long userId, Long cvId);

    /**
     * Thêm kỹ năng vào hồ sơ ứng viên.
     *
     * @param userId  ID tài khoản ứng viên
     * @param skillId ID kỹ năng cần thêm (từ danh mục Skills chuẩn hóa)
     * @return danh sách kỹ năng sau khi thêm
     */
    List<SkillResponse> addSkill(Long userId, Long skillId);

    /**
     * Xóa kỹ năng khỏi hồ sơ ứng viên.
     *
     * @param userId  ID tài khoản ứng viên
     * @param skillId ID kỹ năng cần xóa
     */
    void removeSkill(Long userId, Long skillId);

    /**
     * Lấy danh sách kỹ năng của ứng viên.
     *
     * @param userId ID tài khoản ứng viên
     * @return danh sách kỹ năng
     */
    List<SkillResponse> getSkillsByUserId(Long userId);

    /**
     * Lấy danh sách tất cả kỹ năng trong danh mục chuẩn hóa hệ thống.
     *
     * @return danh sách kỹ năng chuẩn hóa (Master Data)
     */
    List<SkillResponse> getAllSkills();

    /**
     * Tự động kết xuất và lưu CV dựa trên template do hệ thống cung cấp.
     */
    CvDocumentResponse generateCvFromTemplate(Long userId, String templateId, String jsonData);
}
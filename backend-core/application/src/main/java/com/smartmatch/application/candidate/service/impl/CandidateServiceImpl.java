// ============================================================
// File: \backend-core\application\src\main\java\com\smartmatch\application\candidate\service\impl\CandidateServiceImpl.java
// ============================================================

package com.smartmatch.application.candidate.service.impl;

import com.smartmatch.application.candidate.dto.CandidateProfileRequest;
import com.smartmatch.application.candidate.dto.CandidateProfileResponse;
import com.smartmatch.application.candidate.dto.CvDocumentResponse;
import com.smartmatch.application.candidate.service.CandidateService;
import com.smartmatch.application.common.dto.FileData;
import com.smartmatch.domain.auth.repository.UserRepository;
import com.smartmatch.domain.candidate.model.CandidateProfile;
import com.smartmatch.domain.candidate.model.CandidateSkill;
import com.smartmatch.domain.candidate.model.CvDocument;
import com.smartmatch.domain.candidate.repository.CandidateProfileRepository;
import com.smartmatch.domain.candidate.repository.CandidateSkillRepository;
import com.smartmatch.domain.candidate.repository.CvDocumentRepository;
import com.smartmatch.domain.candidate.repository.SkillRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class CandidateServiceImpl implements CandidateService {

    private final UserRepository userRepository;
    private final CandidateProfileRepository candidateProfileRepository;
    private final CvDocumentRepository cvDocumentRepository;
    private final CandidateSkillRepository candidateSkillRepository;
    private final SkillRepository skillRepository;

    // Giả định có một port/service để xử lý lưu trữ file thực tế (AWS S3, Local, v.v.)
    // private final FileStoragePort fileStoragePort; 

    @Override
    public CandidateProfileResponse createProfile(Long userId, CandidateProfileRequest request) {
        // 1. Kiểm tra user có tồn tại không
        if (!userRepository.findById(userId).isPresent()) {
            throw new IllegalArgumentException("Người dùng không tồn tại trong hệ thống.");
        }

        // 2. Kiểm tra profile đã tồn tại chưa
        if (candidateProfileRepository.findByUserId(userId).isPresent()) {
            throw new IllegalArgumentException("Hồ sơ ứng viên của người dùng này đã tồn tại.");
        }

        // 3. Khởi tạo Domain Entity
        CandidateProfile profile = CandidateProfile.create(userId, request.getFullName());
        profile.updateProfileDetails(
                request.getFullName(),
                request.getPhone(),
                request.getGender(),
                request.getDob(),
                request.getAddress()
        );

        // 4. Lưu vào Database
        CandidateProfile savedProfile = candidateProfileRepository.save(profile);

        // 5. Trả về DTO
        return mapToProfileResponse(savedProfile);
    }

    @Override
    public CandidateProfileResponse updateProfile(Long userId, CandidateProfileRequest request) {
        CandidateProfile profile = candidateProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy hồ sơ ứng viên."));

        // Cập nhật thông qua phương thức của Domain Entity
        profile.updateProfileDetails(
                request.getFullName(),
                request.getPhone(),
                request.getGender(),
                request.getDob(),
                request.getAddress()
        );

        CandidateProfile updatedProfile = candidateProfileRepository.save(profile);
        return mapToProfileResponse(updatedProfile);
    }

    @Override
    @Transactional(readOnly = true)
    public CandidateProfileResponse getProfileByUserId(Long userId) {
        CandidateProfile profile = candidateProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy hồ sơ ứng viên."));
        return mapToProfileResponse(profile);
    }

    @Override
    public CvDocumentResponse uploadCv(Long userId, FileData fileData) {
        // Kiểm tra User/Profile có tồn tại không
        candidateProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("Yêu cầu tạo hồ sơ cá nhân trước khi tải CV lên."));

        // TODO: Gọi hạ tầng lưu file (VD: fileStoragePort.upload(fileData)) và lấy đường dẫn URL
        String uploadedFilePath = "/uploads/cv/" + System.currentTimeMillis() + "_" + fileData.fileName();

        // TODO: Tích hợp module AI hoặc thư viện đọc PDF/Word để trích xuất text (rawText)
        String extractedRawText = "Extracted text content from " + fileData.fileName();

        // Khởi tạo CV theo quy tắc của Domain
        CvDocument cvDocument = CvDocument.upload(userId, uploadedFilePath, extractedRawText);

        CvDocument savedCv = cvDocumentRepository.save(cvDocument);
        return mapToCvResponse(savedCv);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CvDocumentResponse> getCvsByUserId(Long userId) {
        List<CvDocument> cvList = cvDocumentRepository.findByCandidateId(userId);
        return cvList.stream()
                .map(this::mapToCvResponse)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteCv(Long userId, Long cvId) {
        CvDocument cvDocument = cvDocumentRepository.findById(cvId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy CV."));

        // Xác thực CV này có thuộc về User đang request không
        if (!cvDocument.getCandidateId().equals(userId)) {
            throw new IllegalArgumentException("Bạn không có quyền xóa CV này.");
        }

        cvDocumentRepository.deleteById(cvId);
    }

    @Override
    public void addSkillToCandidate(Long userId, Long skillId) {
        // Kiểm tra tính hợp lệ
        candidateProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy hồ sơ ứng viên."));

        skillRepository.findById(skillId)
                .orElseThrow(() -> new IllegalArgumentException("Kỹ năng không tồn tại trong hệ thống."));

        CandidateSkill candidateSkill = new CandidateSkill(userId, skillId);
        candidateSkillRepository.save(candidateSkill);
    }

    @Override
    public void removeSkillFromCandidate(Long userId, Long skillId) {
        candidateSkillRepository.deleteByCandidateIdAndSkillId(userId, skillId);
    }

    // ==========================================================
    // PRIVATE HELPER METHODS (MAPPING)
    // ==========================================================

    private CandidateProfileResponse mapToProfileResponse(CandidateProfile profile) {
        return CandidateProfileResponse.builder()
                .id(profile.getId())
                .userId(profile.getUserId())
                .fullName(profile.getFullName())
                .phone(profile.getPhone())
                .gender(profile.getGender())
                .dob(profile.getDob())
                .address(profile.getAddress())
                .build();
    }

    private CvDocumentResponse mapToCvResponse(CvDocument cv) {
        return CvDocumentResponse.builder()
                .id(cv.getId())
                .candidateId(cv.getCandidateId())
                .filePath(cv.getFilePath())
                .isGenerated(cv.getIsGenerated())
                .createdAt(cv.getCreatedAt())
                .build();
    }
}
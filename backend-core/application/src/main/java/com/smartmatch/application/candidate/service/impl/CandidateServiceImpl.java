package com.smartmatch.application.candidate.service.impl;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
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
import java.util.Map;
import java.util.Optional;
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
    private final ObjectMapper objectMapper;

    @Override
    public CandidateProfileResponse createProfile(Long userId, CandidateProfileRequest request) {

        if (userRepository.findById(userId).isEmpty()) {
            throw new IllegalArgumentException("Người dùng không tồn tại trong hệ thống.");
        }

        Optional<CandidateProfile> existingProfileOpt =
                candidateProfileRepository.findByUserId(userId);

        CandidateProfile profile;

        if (existingProfileOpt.isPresent()) {
            profile = existingProfileOpt.get();
        } else {
            profile = CandidateProfile.create(userId, request.getFullName());
        }

        profile.updateProfileDetails(
                request.getFullName(),
                request.getPhone(),
                request.getGender(),
                request.getDob(),
                request.getAddress(),
                request.getSummary()
        );

        CandidateProfile savedProfile =
                candidateProfileRepository.save(profile);

        // ==================== ĐOẠN BỔ SUNG VÀO HÀM saveProfile ====================
        if (request.getSkills() != null && !request.getSkills().trim().isEmpty()) {
            // Xóa sạch các liên kết kỹ năng cũ để tránh ghi đè trùng lặp dữ liệu
            candidateSkillRepository.deleteByCandidateId(savedProfile.getId());

            // Tách chuỗi kỹ năng gửi từ Frontend (ví dụ: "Java, React, Docker")
            String[] skillNames = request.getSkills().split(",");
            for (String skillName : skillNames) {
                String trimmedName = skillName.trim();
                if (trimmedName.isEmpty()) continue;

                // ĐÃ SỬA: Sử dụng phương thức tĩnh Skill.create(name) có sẵn thay vì dùng `new` bị lỗi private
                com.smartmatch.domain.candidate.model.Skill skill = skillRepository.findByNameIgnoreCase(trimmedName)
                        .orElseGet(() -> skillRepository.save(com.smartmatch.domain.candidate.model.Skill.create(trimmedName)));

                // Lưu liên quan hệ vào bảng liên kết CandidateSkill theo profile ID chính xác
                CandidateSkill candidateSkill = new CandidateSkill(savedProfile.getId(), skill.getId());
                candidateSkillRepository.save(candidateSkill);
            }
        }
        // =========================================================================

        return mapToProfileResponse(savedProfile);
    }

    @Override
    public CandidateProfileResponse updateProfile(
            Long userId,
            CandidateProfileRequest request
    ) {

        CandidateProfile profile =
                candidateProfileRepository.findByUserId(userId)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Không tìm thấy hồ sơ ứng viên."
                                )
                        );

        profile.updateProfileDetails(
                request.getFullName(),
                request.getPhone(),
                request.getGender(),
                request.getDob(),
                request.getAddress(),
                request.getSummary()
        );

        CandidateProfile updatedProfile =
                candidateProfileRepository.save(profile);

        return mapToProfileResponse(updatedProfile);
    }

    @Override
    @Transactional(readOnly = true)
    public CandidateProfileResponse getProfileByUserId(Long userId) {

        CandidateProfile profile =
                candidateProfileRepository.findByUserId(userId)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Không tìm thấy hồ sơ ứng viên."
                                )
                        );

        return mapToProfileResponse(profile);
    }

    @Override
    public CvDocumentResponse uploadCv(Long userId, FileData fileData) {

        candidateProfileRepository.findByUserId(userId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Yêu cầu tạo hồ sơ cá nhân trước khi tải CV lên."
                        )
                );

        String uploadedFilePath =
                "/uploads/cv/"
                        + System.currentTimeMillis()
                        + "_"
                        + fileData.fileName();

        String extractedRawText =
                "Extracted text content from "
                        + fileData.fileName();

        CvDocument cvDocument =
                CvDocument.upload(
                        userId,
                        uploadedFilePath,
                        extractedRawText
                );

        CvDocument savedCv =
                cvDocumentRepository.save(cvDocument);

        return mapToCvResponse(savedCv);
    }

    @Override
    public CvDocumentResponse saveGeneratedCv(Long userId, String rawText) {
        // 1. Kiểm tra hồ sơ cá nhân và lấy chính xác candidateId (ID của bảng candidate_profiles)
        CandidateProfile profile = candidateProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("Yêu cầu tạo hồ sơ cá nhân trước khi lưu bản thảo CV."));

        Long candidateId = profile.getId();

        // 2. Lưu bản dịch CV thô vào DB
        CvDocument cvDocument = CvDocument.generate(userId, rawText);
        CvDocument savedCv = cvDocumentRepository.save(cvDocument);

        // 3. Bóc tách JSON xử lý đồng bộ chuỗi kỹ năng
        try {
            List<Map<String, Object>> blocks = objectMapper.readValue(
                    rawText,
                    new TypeReference<List<Map<String, Object>>>() {}
            );

            for (Map<String, Object> block : blocks) {
                String type = (String) block.get("type");

                if ("SKILLS".equals(type)) {
                    Map<String, Object> data = (Map<String, Object>) block.get("data");

                    if (data != null && data.containsKey("skills")) {
                        String rawSkills = (String) data.get("skills");

                        if (rawSkills != null && !rawSkills.trim().isEmpty()) {

                            // SỬA: Xóa theo candidateId thực tế của Profile, tránh xóa nhầm hoặc sai lệch
                            candidateSkillRepository.deleteByCandidateId(candidateId);

                            String[] skillArray = rawSkills.split(",");

                            for (String skillName : skillArray) {
                                String cleanSkillName = skillName.trim();
                                if (!cleanSkillName.isEmpty()) {

                                    // SỬA: Tìm kiếm ID thực tế từ bảng danh mục tổng 'skills'
                                    // (Cần bổ sung hàm findByNameIgnoreCase trong SkillRepository tầng Domain)
                                    Long validSkillId = skillRepository.findByNameIgnoreCase(cleanSkillName)
                                            .map(com.smartmatch.domain.candidate.model.Skill::getId)
                                            .orElseGet(() -> {
                                                // Nếu hệ thống chưa có từ khóa này, tiến hành tự động tạo mới vào danh mục tổng
                                                com.smartmatch.domain.candidate.model.Skill newSkill =
                                                        com.smartmatch.domain.candidate.model.Skill.create(cleanSkillName);
                                                return skillRepository.save(newSkill).getId();
                                            });

                                    // Khởi tạo đối tượng liên kết mapping chuẩn giữa Ứng viên và Kỹ năng
                                    CandidateSkill candidateSkill = new CandidateSkill(candidateId, validSkillId);
                                    candidateSkillRepository.save(candidateSkill);
                                }
                            }

                            log.info("Đã bóc tách & đồng bộ hóa toàn bộ kỹ năng Sandbox thành công cho candidateId={}", candidateId);
                        }
                    }
                }
            }
        } catch (Exception e) {
            log.error("Lỗi parse JSON Sandbox skills cho userId: " + userId, e);
        }

        return mapToCvResponse(savedCv);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CvDocumentResponse> getCvsByUserId(Long userId) {

        List<CvDocument> cvList =
                cvDocumentRepository.findByCandidateId(userId);

        return cvList.stream()
                .map(this::mapToCvResponse)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteCv(Long userId, Long cvId) {

        CvDocument cvDocument =
                cvDocumentRepository.findById(cvId)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Không tìm thấy CV."
                                )
                        );

        if (!cvDocument.getCandidateId().equals(userId)) {
            throw new IllegalArgumentException(
                    "Bạn không có quyền xóa CV này."
            );
        }

        cvDocumentRepository.deleteById(cvId);
    }

    @Override
    public void addSkillToCandidate(Long userId, Long skillId) {
        // ĐÃ BỔ SUNG: Dòng tìm profile để tránh lỗi 'Cannot resolve symbol profile'
        CandidateProfile profile = candidateProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy hồ sơ ứng viên với User ID: " + userId));

        skillRepository.findById(skillId)
                .orElseThrow(() -> new IllegalArgumentException("Kỹ năng không tồn tại trong hệ thống."));

        CandidateSkill candidateSkill = new CandidateSkill(profile.getId(), skillId);
        candidateSkillRepository.save(candidateSkill);
    }

    @Override
    public void removeSkillFromCandidate(Long userId, Long skillId) {
        // ĐÃ BỔ SUNG: Dòng tìm profile để tránh lỗi 'Cannot resolve symbol profile'
        CandidateProfile profile = candidateProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy hồ sơ ứng viên với User ID: " + userId));

        candidateSkillRepository.deleteByCandidateIdAndSkillId(profile.getId(), skillId);
    }

    private CandidateProfileResponse mapToProfileResponse(
            CandidateProfile profile
    ) {

        return CandidateProfileResponse.builder()
                .id(profile.getId())
                .userId(profile.getUserId())
                .fullName(profile.getFullName())
                .phone(profile.getPhone())
                .gender(profile.getGender())
                .dob(profile.getDob())
                .address(profile.getAddress())
                .summary(profile.getSummary())
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
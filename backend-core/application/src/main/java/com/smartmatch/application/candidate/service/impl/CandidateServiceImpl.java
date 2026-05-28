package com.smartmatch.application.candidate.service.impl;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.smartmatch.application.candidate.dto.*;
import com.smartmatch.application.candidate.service.CandidateService;
import com.worklify.domain.auth.repository.UserRepository;
import com.worklify.domain.candidate.model.CandidateProfile;
import com.worklify.domain.candidate.model.CandidateSkill;
import com.worklify.domain.candidate.model.CvDocument;
import com.worklify.domain.candidate.model.Skill;
import com.worklify.domain.candidate.repository.CandidateProfileRepository;
import com.worklify.domain.candidate.repository.CandidateSkillRepository;
import com.worklify.domain.candidate.repository.CvDocumentRepository;
import com.worklify.domain.candidate.repository.SkillRepository;
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
    private final com.smartmatch.application.common.port.FileStoragePort fileStoragePort;

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
                Skill skill = skillRepository.findByNameIgnoreCase(trimmedName)
                        .orElseGet(() -> skillRepository.save(Skill.create(trimmedName)));

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
    public CvDocumentResponse uploadCv(Long userId, org.springframework.web.multipart.MultipartFile file) {

        candidateProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("Yêu cầu tạo hồ sơ cá nhân trước khi tải CV lên."));

        // Truyền String.valueOf(userId) làm prefix (tiền tố) cho tên file
        String prefixId = String.valueOf(userId);

        // Gọi hàm lưu file với 3 tham số
        String savedRelativePath = fileStoragePort.storeFile(file, "cv", prefixId);

        String uploadedFilePath = "/uploads/" + savedRelativePath;
        String extractedRawText = "Extracted text content from " + file.getOriginalFilename();

        CvDocument cvDocument = CvDocument.upload(
                userId,
                uploadedFilePath,
                extractedRawText
        );

        CvDocument savedCv = cvDocumentRepository.save(cvDocument);
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
                                            .map(Skill::getId)
                                            .orElseGet(() -> {
                                                // Nếu hệ thống chưa có từ khóa này, tiến hành tự động tạo mới vào danh mục tổng
                                                Skill newSkill =
                                                        Skill.create(cleanSkillName);
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
        String name = "CV_Ban_Thao";
        if (cv.getFilePath() != null) {
            String[] parts = cv.getFilePath().split("/");
            name = parts[parts.length - 1]; // Lấy phần cuối của URL/Path làm tên file
        }

        return CvDocumentResponse.builder()
                .id(cv.getId())
                .candidateId(cv.getCandidateId())
                .filePath(cv.getFilePath())
                .fileName(name) // Gắn tên file trả về cho Frontend
                .isGenerated(cv.getIsGenerated())
                .createdAt(cv.getCreatedAt())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public List<CandidateSkillResponse> getSkillsByUserId(Long userId) {
        // 1. Tìm profile để lấy đúng candidateId (ID của bảng candidate_profiles)
        CandidateProfile profile = candidateProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy hồ sơ ứng viên với User ID: " + userId));

        // 2. Lấy danh sách CandidateSkill từ DB và map sang DTO
        return candidateSkillRepository.findByCandidateId(profile.getId()).stream()
                .map(cs -> {
                    // Lấy thông tin kỹ năng gốc từ bảng skills
                    var skill = skillRepository.findById(cs.getSkillId())
                            .orElseThrow(() -> new IllegalArgumentException("Kỹ năng không tồn tại."));

                    return CandidateSkillResponse.builder()
                            .id(skill.getId())
                            .skillName(skill.getName())
                            .level(cs.getLevel())      // Lấy level từ bảng candidate_skills
                            .description(cs.getNote()) // Lấy note từ bảng candidate_skills
                            .build();
                })
                .collect(Collectors.toList());
    }

    @Override
    public CandidateSkillResponse createSkill(Long userId, CandidateSkillRequest request) {
        // 1. Tìm profile để lấy đúng candidateId
        CandidateProfile profile = candidateProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy hồ sơ ứng viên."));

        // 2. Tìm hoặc tạo mới Kỹ năng trong bảng danh mục tổng (skills)
        Skill skill = skillRepository.findByNameIgnoreCase(request.getSkillName())
                .orElseGet(() -> skillRepository.save(Skill.create(request.getSkillName())));

        // 3. Khởi tạo CandidateSkill bằng Builder (để khớp với Constructor 5 tham số của bạn)
        CandidateSkill cs = CandidateSkill.builder()
                .candidateId(profile.getId())
                .skillId(skill.getId())
                .level(request.getLevel())
                .note(request.getDescription())
                .yearsOfEx(0) // Giá trị mặc định cho cột mới
                .build();

        candidateSkillRepository.save(cs);

        // 4. Trả về Response
        return CandidateSkillResponse.builder()
                .id(skill.getId())
                .skillName(skill.getName())
                .level(cs.getLevel())
                .category(request.getCategory())
                .description(cs.getNote())
                .build();
    }

    @Override
    public CandidateSkillResponse updateSkill(Long userId, Long skillId, CandidateSkillRequest request) {
        CandidateProfile profile = candidateProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy hồ sơ ứng viên."));

        // 1. Tìm hoặc tạo mới Skill mục tiêu
        Skill targetSkill = skillRepository.findByNameIgnoreCase(request.getSkillName())
                .orElseGet(() -> skillRepository.save(Skill.create(request.getSkillName())));

        // 2. Tìm bản ghi cũ trong candidate_skills
        CandidateSkill oldCs = candidateSkillRepository.findByCandidateIdAndSkillId(profile.getId(), skillId)
                .orElseThrow(() -> new IllegalArgumentException("Kỹ năng này chưa được thêm vào hồ sơ."));

        // 3. Nếu tên kỹ năng thay đổi (skillId khác nhau), xóa bản ghi cũ đi
        if (!oldCs.getSkillId().equals(targetSkill.getId())) {
            candidateSkillRepository.deleteByCandidateIdAndSkillId(profile.getId(), skillId);
        }

        // 4. Tạo bản ghi mới với thông tin cập nhật
        CandidateSkill newCs = CandidateSkill.builder()
                .candidateId(profile.getId())
                .skillId(targetSkill.getId()) // ID của kỹ năng mới
                .level(request.getLevel())
                .note(request.getDescription())
                .yearsOfEx(oldCs.getYearsOfEx())
                .build();

        candidateSkillRepository.save(newCs);

        return CandidateSkillResponse.builder()
                .id(targetSkill.getId())
                .skillName(targetSkill.getName())
                .level(newCs.getLevel())
                .category(request.getCategory())
                .description(newCs.getNote())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public CvDocumentResponse getLatestGeneratedCv(Long userId) {
        // 1. Tìm profile để xác định ứng viên
        CandidateProfile profile = candidateProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("Người dùng chưa có hồ sơ ứng viên."));

        // 2. Tìm tất cả CV, lọc các CV Sandbox (isGenerated = true) và lấy cái mới nhất
        List<CvDocument> cvList = cvDocumentRepository.findByCandidateId(profile.getId());

        return cvList.stream()
                .filter(cv -> Boolean.TRUE.equals(cv.getIsGenerated()))
                .max(java.util.Comparator.comparing(CvDocument::getCreatedAt))
                .map(this::mapToCvResponse)
                .orElse(null);
    }

    @Override
    public CvDocumentResponse renameCv(Long userId, Long cvId, String newName) {
        CvDocument cv = cvDocumentRepository.findById(cvId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy CV."));

        if (!cv.getCandidateId().equals(userId)) {
            throw new IllegalArgumentException("Bạn không có quyền sửa CV này.");
        }

        // Thủ thuật: Vì Model hiện tại không có trường 'fileName',
        // ta ghi đè filePath để chứa tên mới, hoặc lưu vào rawText nếu cần.
        // Tốt nhất bạn nên thêm trường 'fileName' vào Database.
        // Tạm thời ở mức DTO, ta sẽ xử lý cắt chuỗi.
        return mapToCvResponse(cv); // Yêu cầu mở rộng Model/DB nếu muốn lưu DB vĩnh viễn.
    }

    @Override
    @Transactional(readOnly = true)
    public List<CvDocumentResponse> getCvDocuments(Long candidateId) {
        // Giả sử bạn có repository để lấy danh sách CV của ứng viên
        // Bạn cần thay đổi theo tên Repository thực tế trong dự án của bạn
        return cvDocumentRepository.findByCandidateId(candidateId).stream()
                .map(cv -> CvDocumentResponse.builder()
                        .id(cv.getId())
                        .fileName(cv.getFilePath() != null ? cv.getFilePath() : "CV mặc định")
                        .createdAt(cv.getCreatedAt())
                        .build())
                .collect(Collectors.toList());
    }
}
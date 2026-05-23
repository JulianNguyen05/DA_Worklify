package com.smartmatch.application.candidate.service;
import com.smartmatch.application.candidate.dto.*;
import com.smartmatch.application.common.dto.FileData;
import jakarta.validation.constraints.NotBlank;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

public interface CandidateService {
    CandidateProfileResponse createProfile(Long userId, CandidateProfileRequest request);
    CandidateProfileResponse updateProfile(Long userId, CandidateProfileRequest request);
    CandidateProfileResponse getProfileByUserId(Long userId);
    CvDocumentResponse uploadCv(Long userId, FileData fileData);
    List<CvDocumentResponse> getCvsByUserId(Long userId);
    void deleteCv(Long userId, Long cvId);
    void addSkillToCandidate(Long userId, Long skillId);
    void removeSkillFromCandidate(Long userId, Long skillId);

    CvDocumentResponse saveGeneratedCv(Long userId, String rawText);
    // SKILLS
    List<CandidateSkillResponse> getSkillsByUserId(Long userId);
    CandidateSkillResponse createSkill(Long userId, CandidateSkillRequest request);
    CandidateSkillResponse updateSkill(Long userId, Long skillId, CandidateSkillRequest request);

    // LATEST CV
    CvDocumentResponse getLatestGeneratedCv(Long userId);
}
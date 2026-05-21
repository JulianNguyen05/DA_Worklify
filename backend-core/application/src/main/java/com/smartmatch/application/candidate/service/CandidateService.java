package com.smartmatch.application.candidate.service;
import com.smartmatch.application.candidate.dto.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

public interface CandidateService {
    CandidateProfileResponse createProfile(Long userId, CandidateProfileRequest request);
    CandidateProfileResponse updateProfile(Long userId, CandidateProfileRequest request);
    CandidateProfileResponse getProfileByUserId(Long userId);
    CvDocumentResponse uploadCv(Long userId, MultipartFile file);
    List<CvDocumentResponse> getCvsByUserId(Long userId);
    void deleteCv(Long userId, Long cvId);
    List<SkillResponse> addSkill(Long userId, Long skillId);
    void removeSkill(Long userId, Long skillId);
    List<SkillResponse> getSkillsByUserId(Long userId);
    List<SkillResponse> getAllSkills();
    CvDocumentResponse generateCvFromTemplate(Long userId, String templateId, String jsonData);
}
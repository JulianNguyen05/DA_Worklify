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
    void addSkillToCandidate(Long userId, Long skillId);
    void removeSkillFromCandidate(Long userId, Long skillId);
}
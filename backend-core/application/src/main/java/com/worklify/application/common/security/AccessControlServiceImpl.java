package com.worklify.application.common.security;

import com.worklify.application.common.exception.ForbiddenOperationException;
import com.worklify.domain.application.repository.ApplicationRepository;
import com.worklify.domain.auth.model.User;
import com.worklify.domain.auth.repository.UserRepository;
import com.worklify.domain.candidate.model.CvDocument;
import com.worklify.domain.candidate.repository.CandidateProfileRepository;
import com.worklify.domain.candidate.repository.CvDocumentRepository;
import com.worklify.domain.employer.repository.CompanyProfileRepository;
import com.worklify.domain.job.repository.JobPostingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service("accessControl")
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AccessControlServiceImpl implements AccessControlService {

    private final UserRepository userRepository;
    private final CompanyProfileRepository companyProfileRepository;
    private final JobPostingRepository jobPostingRepository;
    private final ApplicationRepository applicationRepository;
    private final CvDocumentRepository cvDocumentRepository;
    private final CandidateProfileRepository candidateProfileRepository;

    @Override
    public boolean isSelf(Long userId, String email) {
        return userId != null && currentUserId(email).map(userId::equals).orElse(false);
    }

    @Override
    public boolean ownsCompany(Long companyId, String email) {
        if (companyId == null) {
            return false;
        }
        return currentUserId(email)
                .flatMap(companyProfileRepository::findByUserId)
                .map(company -> companyId.equals(company.getId()))
                .orElse(false);
    }

    @Override
    public boolean ownsJob(Long jobId, String email) {
        if (jobId == null) {
            return false;
        }
        return jobPostingRepository.findById(jobId)
                .map(job -> ownsCompany(job.getCompanyId(), email))
                .orElse(false);
    }

    @Override
    public boolean canViewApplication(Long applicationId, String email) {
        if (applicationId == null) {
            return false;
        }
        return applicationRepository.findById(applicationId)
                .map(app -> isSelf(app.getCandidateId(), email) || ownsJob(app.getJobId(), email))
                .orElse(false);
    }

    @Override
    public boolean canViewCv(Long cvId, String email) {
        if (cvId == null) {
            return false;
        }
        CvDocument cv = cvDocumentRepository.findById(cvId).orElse(null);
        if (cv == null) {
            return false;
        }
        // cv_documents.candidate_id là id hồ sơ ứng viên (candidate_profiles.id), không phải user id
        boolean isOwner = currentUserId(email)
                .flatMap(candidateProfileRepository::findByUserId)
                .map(profile -> profile.getId().equals(cv.getCandidateId()))
                .orElse(false);
        return isOwner || applicationRepository.findByCvId(cvId).stream()
                .anyMatch(app -> ownsJob(app.getJobId(), email));
    }

    @Override
    public Long requireUserId(String email) {
        return currentUserId(email)
                .orElseThrow(() -> new ForbiddenOperationException("Không xác định được người dùng đang đăng nhập."));
    }

    private Optional<Long> currentUserId(String email) {
        if (email == null || email.isBlank()) {
            return Optional.empty();
        }
        return userRepository.findByEmail(email).map(User::getId);
    }
}

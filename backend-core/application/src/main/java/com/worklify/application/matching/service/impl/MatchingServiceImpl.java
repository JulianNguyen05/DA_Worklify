package com.worklify.application.matching.service.impl;

import com.worklify.application.candidate.dto.CandidateProfileFullResponse;
import com.worklify.application.candidate.dto.CandidateProfileResponse;
import com.worklify.application.candidate.dto.CandidateSkillResponse;
import com.worklify.application.candidate.dto.CertificationResponse;
import com.worklify.application.candidate.dto.EducationResponse;
import com.worklify.application.candidate.dto.ExperienceResponse;
import com.worklify.application.candidate.dto.LanguageResponse;
import com.worklify.application.candidate.dto.ProjectResponse;
import com.worklify.application.candidate.service.CandidateService;
import com.worklify.application.common.exception.ResourceNotFoundException;
import com.worklify.application.matching.dto.CvJdScoreRequest;
import com.worklify.application.matching.dto.CvJdScoreResponse;
import com.worklify.application.matching.port.CvJdScoringPort;
import com.worklify.application.matching.service.MatchingService;
import com.worklify.domain.job.model.JobPosting;
import com.worklify.domain.job.repository.JobPostingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.StringJoiner;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MatchingServiceImpl implements MatchingService {

    private final CandidateService candidateService;
    private final JobPostingRepository jobPostingRepository;
    private final CvJdScoringPort cvJdScoringPort;

    @Override
    public CvJdScoreResponse scoreCandidateForJob(Long userId, Long jobId) {
        JobPosting job = jobPostingRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy tin tuyển dụng"));
        CandidateProfileFullResponse profile = candidateService.getFullProfile(userId);

        String cvText = buildCvText(profile);
        if (cvText.isBlank()) {
            throw new IllegalArgumentException("Hồ sơ của bạn chưa có nội dung để chấm điểm, hãy cập nhật hồ sơ trước.");
        }

        CvJdScoreRequest request = CvJdScoreRequest.builder()
                .cv(CvJdScoreRequest.Cv.builder()
                        .text(cvText)
                        .skills(collectSkills(profile))
                        .yearsOfExperience(totalYearsOfExperience(profile.getExperiences()))
                        .build())
                .jd(CvJdScoreRequest.Jd.builder()
                        .text(joinLines(job.getTitle(), job.getDescription(), job.getRequirements()))
                        .build())
                .build();

        return cvJdScoringPort.score(request);
    }

    // ---------------------------------------------------------------------
    // Ghép hồ sơ online thành văn bản để backend-ml đọc
    // ---------------------------------------------------------------------

    private String buildCvText(CandidateProfileFullResponse full) {
        List<String> lines = new ArrayList<>();
        CandidateProfileResponse p = full.getProfile();
        if (p != null) {
            lines.add(p.getHeadline());
            lines.add(p.getSummary());
        }

        List<String> skills = collectSkills(full);
        if (!skills.isEmpty()) {
            lines.add("Kỹ năng: " + String.join(", ", skills));
        }
        for (ExperienceResponse e : nullSafe(full.getExperiences())) {
            lines.add(joinInline(e.getPosition(), e.getCompanyName()) + ": " + orEmpty(e.getDescription()));
        }
        for (ProjectResponse pr : nullSafe(full.getProjects())) {
            lines.add("Dự án " + joinInline(pr.getProjectName(), pr.getRole(), pr.getTechStack()) + ": " + orEmpty(pr.getDescription()));
        }
        for (EducationResponse ed : nullSafe(full.getEducations())) {
            lines.add(joinInline(ed.getDegree(), ed.getMajor(), ed.getSchoolName()));
        }
        for (CertificationResponse c : nullSafe(full.getCertifications())) {
            lines.add("Chứng chỉ " + joinInline(c.getName(), c.getIssuingOrg()));
        }
        for (LanguageResponse l : nullSafe(full.getLanguages())) {
            lines.add("Ngoại ngữ " + joinInline(l.getLanguageName(), l.getProficiency()));
        }
        return joinLines(lines.toArray(String[]::new));
    }

    private List<String> collectSkills(CandidateProfileFullResponse full) {
        Stream<String> fromSkillBlock = nullSafe(full.getSkills()).stream().map(CandidateSkillResponse::getSkillName);
        Stream<String> fromProfile = full.getProfile() != null ? nullSafe(full.getProfile().getSkills()).stream() : Stream.empty();
        Set<String> unique = Stream.concat(fromSkillBlock, fromProfile)
                .filter(s -> s != null && !s.isBlank())
                .map(String::trim)
                .collect(Collectors.toCollection(LinkedHashSet::new));
        return new ArrayList<>(unique);
    }

    /** Tổng số năm kinh nghiệm (không trừ các khoảng thời gian chồng lấn), làm tròn 1 chữ số. */
    private Double totalYearsOfExperience(List<ExperienceResponse> experiences) {
        long months = 0;
        for (ExperienceResponse e : nullSafe(experiences)) {
            if (e.getStartDate() == null) {
                continue;
            }
            LocalDate end = (e.isCurrent() || e.getEndDate() == null) ? LocalDate.now() : e.getEndDate();
            months += Math.max(0, ChronoUnit.MONTHS.between(e.getStartDate(), end));
        }
        return Math.round(months / 12.0 * 10) / 10.0;
    }

    private static <T> List<T> nullSafe(List<T> list) {
        return list != null ? list : List.of();
    }

    private static String orEmpty(String s) {
        return s != null ? s : "";
    }

    private static String joinInline(String... parts) {
        StringJoiner joiner = new StringJoiner(" - ");
        Stream.of(parts).filter(Objects::nonNull).filter(s -> !s.isBlank()).forEach(joiner::add);
        return joiner.toString();
    }

    private static String joinLines(String... parts) {
        return Stream.of(parts)
                .filter(Objects::nonNull)
                .map(String::trim)
                .filter(s -> !s.isEmpty() && !s.equals(":"))
                .collect(Collectors.joining("\n"));
    }
}

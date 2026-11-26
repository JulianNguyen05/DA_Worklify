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
import com.worklify.application.common.exception.ForbiddenOperationException;
import com.worklify.application.common.exception.ResourceNotFoundException;
import com.worklify.application.matching.dto.ApplicationMatchResponse;
import com.worklify.application.matching.dto.CvJdBatchRequest;
import com.worklify.application.matching.dto.CvJdScoreRequest;
import com.worklify.application.matching.dto.CvJdScoreResponse;
import com.worklify.application.matching.port.CvJdScoringPort;
import com.worklify.application.matching.service.MatchingService;
import com.worklify.domain.application.model.Application;
import com.worklify.domain.application.repository.ApplicationRepository;
import com.worklify.domain.auth.model.User;
import com.worklify.domain.auth.repository.UserRepository;
import com.worklify.domain.common.DomainPageable;
import com.worklify.domain.employer.model.CompanyProfile;
import com.worklify.domain.employer.repository.CompanyProfileRepository;
import com.worklify.domain.job.model.JobPosting;
import com.worklify.domain.job.repository.JobPostingRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.StringJoiner;
import java.util.stream.Collectors;
import java.util.stream.Stream;

/**
 * Cố ý KHÔNG đặt @Transactional ở đây:
 * - candidateService.getFullProfile() có thể ghi (tạo bố cục hồ sơ mặc định), nên không chạy được trong
 *   transaction read-only;
 * - khi xếp hạng, lỗi đọc hồ sơ của một ứng viên được bắt lại để chấm tiếp các ứng viên khác — nếu dùng chung
 *   một transaction, lỗi đó sẽ đánh dấu rollback-only cho cả lượt;
 * - không giữ transaction database trong lúc chờ backend-ml chấm điểm.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class MatchingServiceImpl implements MatchingService {

    /** Số hồ sơ tối đa chấm trong một lần xếp hạng (giới hạn thời gian chờ của backend-ml). */
    private static final int MAX_APPLICATIONS = 200;

    private final CandidateService candidateService;
    private final JobPostingRepository jobPostingRepository;
    private final ApplicationRepository applicationRepository;
    private final CompanyProfileRepository companyProfileRepository;
    private final UserRepository userRepository;
    private final CvJdScoringPort cvJdScoringPort;

    @Override
    public CvJdScoreResponse scoreCandidateForJob(String candidateEmail, Long jobId) {
        User candidate = findUserByEmail(candidateEmail);
        JobPosting job = findJob(jobId);

        CvJdScoreRequest.Cv cv = toCvInput(candidateService.getFullProfile(candidate.getId()));
        if (cv.getText().isBlank()) {
            throw new IllegalArgumentException("Hồ sơ của bạn chưa có nội dung để chấm điểm, hãy cập nhật hồ sơ trước.");
        }
        return cvJdScoringPort.score(CvJdScoreRequest.builder().cv(cv).jd(toJdInput(job)).build());
    }

    @Override
    public List<ApplicationMatchResponse> rankApplicationsForJob(String employerEmail, Long jobId) {
        JobPosting job = findJob(jobId);
        assertEmployerOwnsJob(findUserByEmail(employerEmail), job);

        List<Application> applications = applicationRepository.findByJobId(jobId, firstPage(MAX_APPLICATIONS)).getContent();

        // Ghép hồ sơ online của từng ứng viên; ứng viên chưa có hồ sơ thì ghi chú lý do thay vì chấm.
        List<ApplicationMatchResponse.ApplicationMatchResponseBuilder> rows = new ArrayList<>();
        List<CvJdScoreRequest.Cv> cvsToScore = new ArrayList<>();
        List<Integer> scoredRowIndexes = new ArrayList<>();

        for (Application app : applications) {
            ApplicationMatchResponse.ApplicationMatchResponseBuilder row = ApplicationMatchResponse.builder()
                    .applicationId(app.getId())
                    .candidateId(app.getCandidateId())
                    .status(app.getStatus())
                    .appliedAt(app.getAppliedAt());
            try {
                CandidateProfileFullResponse profile = candidateService.getFullProfile(app.getCandidateId());
                if (profile.getProfile() != null) {
                    row.candidateName(profile.getProfile().getFullName());
                }
                CvJdScoreRequest.Cv cv = toCvInput(profile);
                if (cv.getText().isBlank()) {
                    row.note("Ứng viên chưa điền hồ sơ online nên chưa chấm được.");
                } else {
                    scoredRowIndexes.add(rows.size());
                    cvsToScore.add(cv);
                }
            } catch (RuntimeException ex) {
                log.debug("Không đọc được hồ sơ ứng viên {}: {}", app.getCandidateId(), ex.getMessage());
                row.note("Ứng viên chưa tạo hồ sơ online nên chưa chấm được.");
            }
            rows.add(row);
        }

        if (!cvsToScore.isEmpty()) {
            List<CvJdScoreResponse> scores = cvJdScoringPort.scoreBatch(
                    CvJdBatchRequest.builder().jd(toJdInput(job)).cvs(cvsToScore).build());
            for (int i = 0; i < scoredRowIndexes.size() && i < scores.size(); i++) {
                rows.get(scoredRowIndexes.get(i)).match(scores.get(i));
            }
        }

        return rows.stream()
                .map(ApplicationMatchResponse.ApplicationMatchResponseBuilder::build)
                .sorted(Comparator.comparing(
                        (ApplicationMatchResponse r) -> r.getMatch() != null ? r.getMatch().getScore() : null,
                        Comparator.nullsLast(Comparator.reverseOrder())))
                .toList();
    }

    // ---------------------------------------------------------------------
    // Phân quyền & tra cứu
    // ---------------------------------------------------------------------

    private User findUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy tài khoản đang đăng nhập"));
    }

    private JobPosting findJob(Long jobId) {
        return jobPostingRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy tin tuyển dụng"));
    }

    private void assertEmployerOwnsJob(User employer, JobPosting job) {
        CompanyProfile company = companyProfileRepository.findByUserId(employer.getId())
                .orElseThrow(() -> new ForbiddenOperationException("Bạn chưa có hồ sơ doanh nghiệp."));
        if (!Objects.equals(company.getId(), job.getCompanyId())) {
            throw new ForbiddenOperationException("Bạn không có quyền xem ứng viên của tin tuyển dụng này.");
        }
    }

    private static DomainPageable firstPage(int size) {
        return new DomainPageable() {
            @Override
            public int getPageNumber() { return 0; }

            @Override
            public int getPageSize() { return size; }

            @Override
            public Pageable toSpringPageable() { return PageRequest.of(0, size); }
        };
    }

    // ---------------------------------------------------------------------
    // Ghép hồ sơ online / tin tuyển dụng thành văn bản để backend-ml đọc
    // ---------------------------------------------------------------------

    private CvJdScoreRequest.Jd toJdInput(JobPosting job) {
        return CvJdScoreRequest.Jd.builder()
                .text(joinLines(job.getTitle(), job.getDescription(), job.getRequirements()))
                .build();
    }

    private CvJdScoreRequest.Cv toCvInput(CandidateProfileFullResponse profile) {
        return CvJdScoreRequest.Cv.builder()
                .text(buildCvText(profile))
                .skills(collectSkills(profile))
                .yearsOfExperience(totalYearsOfExperience(profile.getExperiences()))
                .build();
    }

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

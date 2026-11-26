package com.worklify.domain.job.model;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Getter
@Builder
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class JobPosting {
    private Long id;
    private Long companyId;
    private String title;
    private String description;
    private String requirements;
    private String salaryRange;
    // Khoảng lương dạng số (triệu VNĐ/tháng) để lọc; null = không rõ / thoả thuận.
    private Integer salaryMin;
    private Integer salaryMax;
    private String location;
    private String workType;
    private JobStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime expiresAt;

    // Factory Method: Tạo tin tuyển dụng mới, mặc định ở trạng thái PENDING chờ Admin duyệt
    public static JobPosting createNewJob(Long companyId, String title, String description,
                                          String requirements, String salaryRange,
                                          Integer salaryMin, Integer salaryMax,
                                          String location, String workType, LocalDateTime expiresAt) {
        if (companyId == null || title == null || title.trim().isEmpty()) {
            throw new IllegalArgumentException("Thiếu thông tin bắt buộc để tạo tin tuyển dụng.");
        }
        validateExpiry(expiresAt);
        JobPosting job = JobPosting.builder()
                .companyId(companyId)
                .title(title)
                .description(description)
                .requirements(requirements)
                .salaryRange(salaryRange)
                .location(location)
                .workType(workType)
                .status(JobStatus.PENDING)
                .createdAt(LocalDateTime.now())
                .expiresAt(expiresAt)
                .build();
        job.applySalary(salaryRange, salaryMin, salaryMax);
        return job;
    }

    // Business Behavior: Employer cập nhật tin → tự động về PENDING để Admin kiểm duyệt lại
    public void updateDetails(String title, String description, String requirements,
                              String salaryRange, Integer salaryMin, Integer salaryMax,
                              String location, String workType, LocalDateTime expiresAt) {
        if (title == null || title.trim().isEmpty()) {
            throw new IllegalArgumentException("Tiêu đề công việc không được để trống.");
        }
        if (this.status == JobStatus.CLOSED) {
            throw new IllegalStateException("Tin tuyển dụng đã đóng, không thể chỉnh sửa.");
        }
        validateExpiry(expiresAt);
        this.title = title;
        this.description = description;
        this.requirements = requirements;
        this.salaryRange = salaryRange;
        this.location = location;
        this.workType = workType;
        this.expiresAt = expiresAt;
        this.status = JobStatus.PENDING;
        applySalary(salaryRange, salaryMin, salaryMax);
    }

    // Business Behavior: Admin duyệt tin
    public void publish() {
        if (this.status != JobStatus.PENDING) {
            throw new IllegalStateException("Chỉ có thể duyệt tin đang ở trạng thái PENDING.");
        }
        this.status = JobStatus.ACTIVE;
    }

    // Business Behavior: Admin từ chối tin
    public void reject() {
        if (this.status != JobStatus.PENDING) {
            throw new IllegalStateException("Chỉ có thể từ chối tin đang ở trạng thái PENDING.");
        }
        this.status = JobStatus.REJECTED;
    }

    // Business Behavior: Employer/Admin đóng tin
    public void closeJob() {
        if (this.status == JobStatus.CLOSED) {
            throw new IllegalStateException("Tin tuyển dụng này đã ở trạng thái đóng.");
        }
        this.status = JobStatus.CLOSED;
    }

    // Business Behavior: Gia hạn ngày hết hạn
    public void extendExpirationDate(int daysToAdd) {
        if (this.status == JobStatus.CLOSED) {
            throw new IllegalStateException("Không thể gia hạn một tin tuyển dụng đã đóng.");
        }
        if (daysToAdd <= 0) {
            throw new IllegalArgumentException("Số ngày gia hạn phải lớn hơn 0.");
        }
        this.expiresAt = this.expiresAt.plusDays(daysToAdd);
    }

    /** Tin đang mở (đã duyệt) và chưa quá hạn nộp. */
    public boolean isOpenForApplications(LocalDateTime now) {
        return this.status == JobStatus.ACTIVE && (this.expiresAt == null || this.expiresAt.isAfter(now));
    }

    /** Điền salaryMin/salaryMax từ chuỗi salaryRange cho tin cũ chưa có. Trả về true nếu có thay đổi. */
    public boolean backfillSalaryFromRange() {
        if (this.salaryMin != null || this.salaryMax != null) {
            return false;
        }
        Integer[] parsed = parseSalaryRange(this.salaryRange);
        if (parsed == null) {
            return false;
        }
        this.salaryMin = parsed[0];
        this.salaryMax = parsed[1];
        return true;
    }

    private static void validateExpiry(LocalDateTime expiresAt) {
        if (expiresAt != null && !expiresAt.isAfter(LocalDateTime.now())) {
            throw new IllegalArgumentException("Hạn nộp hồ sơ phải sau thời điểm hiện tại.");
        }
    }

    private void applySalary(String salaryRange, Integer salaryMin, Integer salaryMax) {
        if ((salaryMin != null && salaryMin < 0) || (salaryMax != null && salaryMax < 0)) {
            throw new IllegalArgumentException("Mức lương không được âm.");
        }
        if (salaryMin != null && salaryMax != null && salaryMin > salaryMax) {
            throw new IllegalArgumentException("Mức lương tối thiểu không được lớn hơn mức lương tối đa.");
        }
        this.salaryMin = salaryMin;
        this.salaryMax = salaryMax;
        if (salaryMin == null && salaryMax == null) {
            backfillSalaryFromRange();
        }
    }

    private static final Pattern NUMBER = Pattern.compile("\\d+(?:[.,]\\d+)?");

    /**
     * Đọc khoảng lương (triệu VNĐ) từ chuỗi tự do: "15 - 25 triệu", "Lên đến 30 triệu", "Từ 10 triệu".
     * Bỏ qua lương ngoại tệ và chuỗi không có số ("Thoả thuận"). Trả về [min, max] hoặc null.
     */
    static Integer[] parseSalaryRange(String text) {
        if (text == null || text.isBlank()) {
            return null;
        }
        String lower = text.toLowerCase(Locale.ROOT);
        if (lower.contains("$") || lower.contains("usd")) {
            return null;
        }
        List<Integer> values = new ArrayList<>();
        Matcher m = NUMBER.matcher(lower);
        while (m.find() && values.size() < 2) {
            double v = Double.parseDouble(m.group().replace(',', '.'));
            // Số viết đủ đơn vị đồng (vd 15000000) → đổi sang triệu
            if (v >= 100_000) {
                v = v / 1_000_000d;
            }
            if (v > 1000) {
                return null; // không giống mức lương theo triệu
            }
            values.add((int) Math.round(v));
        }
        if (values.isEmpty()) {
            return null;
        }
        if (values.size() == 2) {
            int a = values.get(0), b = values.get(1);
            return new Integer[]{Math.min(a, b), Math.max(a, b)};
        }
        int v = values.get(0);
        if (lower.contains("đến") || lower.contains("tới") || lower.contains("up to")) {
            return new Integer[]{null, v};
        }
        if (lower.contains("từ") || lower.contains("trên") || lower.contains("from")) {
            return new Integer[]{v, null};
        }
        return new Integer[]{v, v};
    }
}

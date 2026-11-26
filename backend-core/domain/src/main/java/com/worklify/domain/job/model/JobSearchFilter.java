package com.worklify.domain.job.model;

/**
 * Điều kiện tìm việc làm công khai. Trường null/rỗng = không lọc theo trường đó.
 * Lương tính theo triệu VNĐ/tháng: tin được giữ lại nếu khoảng lương của tin giao với [salaryMin, salaryMax].
 */
public record JobSearchFilter(String keyword, String location, String workType,
                              Integer salaryMin, Integer salaryMax) {

    public JobSearchFilter {
        keyword = blankToNull(keyword);
        location = blankToNull(location);
        workType = blankToNull(workType);
        if (salaryMin != null && salaryMax != null && salaryMin > salaryMax) {
            throw new IllegalArgumentException("Mức lương tối thiểu không được lớn hơn mức lương tối đa.");
        }
    }

    private static String blankToNull(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }
}

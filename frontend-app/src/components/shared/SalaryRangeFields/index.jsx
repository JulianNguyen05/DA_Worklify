import React from 'react';
import Input from '../../common/Input';

/**
 * Hai ô lương tối thiểu / tối đa (triệu VNĐ/tháng) cho form đăng/sửa tin.
 * Backend dùng hai số này để ứng viên lọc theo mức lương; bỏ trống = thoả thuận
 * (khi đó backend thử đọc từ chuỗi "Mức lương" hiển thị).
 */
export default function SalaryRangeFields({ values, onChange }) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <Input
        label="Lương tối thiểu (triệu VNĐ/tháng)"
        name="salaryMin"
        type="number"
        min={0}
        max={1000}
        value={values.salaryMin}
        onChange={onChange}
        placeholder="VD: 15"
        hint="Dùng cho bộ lọc lương"
      />
      <Input
        label="Lương tối đa (triệu VNĐ/tháng)"
        name="salaryMax"
        type="number"
        min={0}
        max={1000}
        value={values.salaryMax}
        onChange={onChange}
        placeholder="VD: 25"
      />
    </div>
  );
}

/** '' → null, chuỗi số → số nguyên (để gửi JSON đúng kiểu Integer). */
export const toSalaryNumber = (value) => {
  if (value === '' || value === null || value === undefined) return null;
  const n = Number(value);
  return Number.isFinite(n) ? Math.round(n) : null;
};

/** Kiểm tra nhanh phía client, trả về thông báo lỗi hoặc null. */
export const validateSalaryRange = ({ salaryMin, salaryMax }) => {
  const min = toSalaryNumber(salaryMin);
  const max = toSalaryNumber(salaryMax);
  if ((min !== null && min < 0) || (max !== null && max < 0)) return 'Mức lương không được âm.';
  if (min !== null && max !== null && min > max) return 'Lương tối thiểu không được lớn hơn lương tối đa.';
  return null;
};

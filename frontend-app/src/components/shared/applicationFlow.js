// Quy trình xử lý hồ sơ ứng tuyển — khớp với ApplicationStatus.nextStatuses() ở backend:
// PENDING → REVIEWED → INTERVIEW_SCHEDULED → ACCEPTED / REJECTED (từ chối được ở mọi bước trước khi có kết quả).

export const APPLICATION_STATUS_LABEL = {
  PENDING: 'Chờ duyệt',
  REVIEWED: 'Đã xem',
  INTERVIEW_SCHEDULED: 'Mời phỏng vấn',
  ACCEPTED: 'Trúng tuyển',
  REJECTED: 'Từ chối',
};

const NEXT_STATUSES = {
  PENDING: ['REVIEWED', 'REJECTED'],
  REVIEWED: ['INTERVIEW_SCHEDULED', 'ACCEPTED', 'REJECTED'],
  INTERVIEW_SCHEDULED: ['ACCEPTED', 'REJECTED'],
  ACCEPTED: [],
  REJECTED: [],
};

// Nhãn + kiểu nút cho từng bước chuyển
export const STATUS_ACTIONS = {
  REVIEWED: { label: 'Đã xem', variant: 'outline' },
  INTERVIEW_SCHEDULED: { label: 'Mời phỏng vấn', variant: 'primary' },
  ACCEPTED: { label: 'Nhận', variant: 'success' },
  REJECTED: { label: 'Loại', variant: 'danger-outline' },
};

/** Các trạng thái được chuyển tới tiếp theo; ưu tiên danh sách backend trả về. */
export const getNextStatuses = (app) => {
  const order = ['REVIEWED', 'INTERVIEW_SCHEDULED', 'ACCEPTED', 'REJECTED'];
  const list = Array.isArray(app?.nextStatuses) ? app.nextStatuses : NEXT_STATUSES[app?.status] || [];
  return order.filter((s) => list.includes(s));
};

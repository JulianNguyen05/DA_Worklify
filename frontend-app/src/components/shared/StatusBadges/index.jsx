import React from 'react';
import Badge from '../../common/Badge';

// Nhãn + màu thống nhất cho trạng thái tin tuyển dụng và đơn ứng tuyển.

export const JOB_STATUS = {
  ACTIVE: { label: 'Đang mở', variant: 'success' },
  PENDING: { label: 'Chờ duyệt', variant: 'warning' },
  CLOSED: { label: 'Đã đóng', variant: 'neutral' },
  EXPIRED: { label: 'Hết hạn', variant: 'neutral' },
  REJECTED: { label: 'Từ chối', variant: 'danger' },
};

export const APP_STATUS = {
  PENDING: { label: 'Chờ xử lý', variant: 'warning' },
  REVIEWED: { label: 'Đã xem', variant: 'info' },
  REVIEWING: { label: 'Đang xem xét', variant: 'info' },
  INTERVIEW_SCHEDULED: { label: 'Phỏng vấn', variant: 'purple' },
  ACCEPTED: { label: 'Đã duyệt', variant: 'success' },
  REJECTED: { label: 'Từ chối', variant: 'danger' },
};

export function JobStatusBadge({ status, label }) {
  const cfg = JOB_STATUS[status] ?? { label: status || 'Không rõ', variant: 'neutral' };
  return <Badge variant={cfg.variant} dot>{label || cfg.label}</Badge>;
}

export function AppStatusBadge({ status, label }) {
  const cfg = APP_STATUS[status] ?? { label: status || 'Không rõ', variant: 'neutral' };
  return <Badge variant={cfg.variant} dot>{label || cfg.label}</Badge>;
}

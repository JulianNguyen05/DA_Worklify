import React from 'react';

export default function ApplicationStatusBadge({ status }) {
  const config = {
    PENDING: { text: 'Chờ duyệt', classes: 'bg-amber-50 text-amber-700 border-amber-200' },
    REVIEWING: { text: 'Đang xem xét', classes: 'bg-blue-50 text-blue-700 border-blue-200' },
    ACCEPTED: { text: 'Mời phỏng vấn', classes: 'bg-green-50 text-green-700 border-green-200' },
    REJECTED: { text: 'Từ chối', classes: 'bg-red-50 text-red-700 border-red-200' },
  };

  const current = config[status?.toUpperCase()] || { 
    text: status || 'Không rõ', 
    classes: 'bg-gray-50 text-gray-700 border-gray-200' 
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${current.classes}`}>
      <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current opacity-70"></span>
      {current.text}
    </span>
  );
}
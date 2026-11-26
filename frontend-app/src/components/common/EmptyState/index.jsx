import React from 'react';
import { Inbox } from 'lucide-react';
import { cn } from '@/utils/cn';

/** Trạng thái rỗng / lỗi: icon tròn + tiêu đề + mô tả + action tuỳ chọn. */
export default function EmptyState({ icon: Icon = Inbox, title = 'Chưa có dữ liệu', description, action, tone = 'neutral', className }) {
  const toneClass =
    tone === 'danger' ? 'bg-rose-50 text-rose-500 ring-rose-50/60' : 'bg-slate-100 text-slate-500 ring-slate-50';
  return (
    <div className={cn('flex flex-col items-center justify-center px-6 py-12 text-center', className)}>
      <div className={cn('mb-4 flex h-12 w-12 items-center justify-center rounded-full ring-8', toneClass)}>
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="text-[15px] font-semibold text-slate-900">{title}</h3>
      {description && <p className="mt-1 max-w-sm text-sm text-slate-500">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

import React from 'react';
import { cn } from '@/utils/cn';

/** Đầu trang quản lý: tiêu đề + mô tả bên trái, nút hành động bên phải. */
export default function PageHeader({ title, description, eyebrow, actions, icon: Icon, className, children }) {
  return (
    <div className={cn('mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between', className)}>
      <div className="flex min-w-0 items-start gap-3">
        {Icon && (
          <span className="mt-0.5 hidden h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-brand-600 shadow-xs sm:flex">
            <Icon className="h-5 w-5" />
          </span>
        )}
        <div className="min-w-0">
          {eyebrow && <p className="eyebrow mb-1">{eyebrow}</p>}
          <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900">{title}</h1>
          {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
          {children}
        </div>
      </div>
      {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

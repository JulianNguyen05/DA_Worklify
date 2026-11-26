import React from 'react';
import { cn } from '@/utils/cn';

/** Khung trắng viền mảnh — khối nội dung cơ bản của mọi trang. */
export default function Card({ as: Tag = 'div', className, hover = false, children, ...props }) {
  return (
    <Tag className={cn('card', hover && 'card-hover', className)} {...props}>
      {children}
    </Tag>
  );
}

/** Tiêu đề card: title + mô tả bên trái, action (nút/link) bên phải. */
export function CardHeader({ title, description, icon: Icon, action, className, children }) {
  return (
    <div className={cn('flex items-start justify-between gap-4 border-b border-slate-100 px-5 py-4', className)}>
      <div className="flex min-w-0 items-start gap-3">
        {Icon && (
          <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
            <Icon className="h-4 w-4" />
          </span>
        )}
        <div className="min-w-0">
          {title && <h3 className="text-[15px] font-semibold text-slate-900">{title}</h3>}
          {description && <p className="mt-0.5 text-sm text-slate-500">{description}</p>}
          {children}
        </div>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export function CardBody({ className, children }) {
  return <div className={cn('p-5', className)}>{children}</div>;
}

export function CardFooter({ className, children }) {
  return (
    <div className={cn('flex items-center justify-end gap-2 rounded-b-xl border-t border-slate-100 bg-slate-50/60 px-5 py-3', className)}>
      {children}
    </div>
  );
}

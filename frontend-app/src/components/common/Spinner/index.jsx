import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/utils/cn';

export default function Spinner({ className, label }) {
  return (
    <span className="inline-flex items-center gap-2 text-sm text-slate-500">
      <Loader2 className={cn('h-5 w-5 animate-spin text-brand-600', className)} />
      {label}
    </span>
  );
}

/** Khối loading chiếm chỗ cả vùng nội dung. */
export function PageLoader({ label = 'Đang tải dữ liệu...', className }) {
  return (
    <div className={cn('flex min-h-[40vh] items-center justify-center', className)}>
      <Spinner label={label} />
    </div>
  );
}

/** Thanh xương (skeleton) dùng khi chờ dữ liệu. */
export function Skeleton({ className }) {
  return <div className={cn('animate-pulse rounded-md bg-slate-200/70', className)} />;
}

import React, { useState } from 'react';
import { cn } from '@/utils/cn';

const SIZES = {
  xs: 'h-6 w-6 text-[10px]',
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
  xl: 'h-16 w-16 text-xl',
};

/** Ảnh đại diện / logo; tự rơi về chữ cái đầu khi không có ảnh hoặc ảnh lỗi. */
export default function Avatar({ src, name = '', size = 'md', square = false, className }) {
  const [failed, setFailed] = useState(false);
  const initial = (name || '?').trim().charAt(0).toUpperCase();
  const shape = square ? 'rounded-lg' : 'rounded-full';
  if (src && !failed) {
    return (
      <img
        src={src}
        alt={name}
        onError={() => setFailed(true)}
        className={cn('shrink-0 border border-slate-200 bg-white object-cover', shape, SIZES[size], className)}
      />
    );
  }
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center justify-center bg-brand-50 font-semibold text-brand-700 ring-1 ring-inset ring-brand-100',
        shape,
        SIZES[size],
        className,
      )}
    >
      {initial}
    </span>
  );
}

import React from 'react';
import { cn } from '@/utils/cn';

const VARIANTS = {
  primary: 'bg-brand-50 text-brand-700 ring-brand-600/15',
  info: 'bg-sky-50 text-sky-700 ring-sky-600/15',
  success: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  warning: 'bg-amber-50 text-amber-800 ring-amber-600/20',
  danger: 'bg-rose-50 text-rose-700 ring-rose-600/15',
  neutral: 'bg-slate-100 text-slate-700 ring-slate-500/15',
  purple: 'bg-violet-50 text-violet-700 ring-violet-600/15',
};

const DOTS = {
  primary: 'bg-brand-500',
  info: 'bg-sky-500',
  success: 'bg-emerald-500',
  warning: 'bg-amber-500',
  danger: 'bg-rose-500',
  neutral: 'bg-slate-400',
  purple: 'bg-violet-500',
};

export default function Badge({ children, variant = 'primary', dot = false, size = 'sm', icon: Icon, className }) {
  const v = VARIANTS[variant] ? variant : 'primary';
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 whitespace-nowrap rounded-full font-medium ring-1 ring-inset',
        size === 'xs' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-0.5 text-xs',
        VARIANTS[v],
        className,
      )}
    >
      {dot && <span className={cn('h-1.5 w-1.5 rounded-full', DOTS[v])} />}
      {Icon && <Icon className="h-3.5 w-3.5" />}
      {children}
    </span>
  );
}

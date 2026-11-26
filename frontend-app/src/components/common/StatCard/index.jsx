import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { cn } from '@/utils/cn';

const TONES = {
  brand: 'bg-brand-50 text-brand-600',
  emerald: 'bg-emerald-50 text-emerald-600',
  amber: 'bg-amber-50 text-amber-600',
  rose: 'bg-rose-50 text-rose-600',
  violet: 'bg-violet-50 text-violet-600',
  slate: 'bg-slate-100 text-slate-600',
  sky: 'bg-sky-50 text-sky-600',
};

/** Ô số liệu: nhãn, giá trị lớn, mô tả nhỏ, icon; truyền `to` để thành link. */
export default function StatCard({ label, value, hint, icon: Icon, tone = 'brand', to, onClick, className }) {
  const body = (
    <>
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-slate-500">{label}</p>
        {Icon && (
          <span className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-lg', TONES[tone] || TONES.brand)}>
            <Icon className="h-[18px] w-[18px]" />
          </span>
        )}
      </div>
      <p className="mt-1 font-display text-3xl font-bold tracking-tight text-slate-900 tabular-nums">{value}</p>
      {(hint || to) && (
        <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
          {hint}
          {to && <ArrowUpRight className="ml-auto h-4 w-4 text-slate-300 transition-colors group-hover:text-brand-600" />}
        </p>
      )}
    </>
  );
  const cls = cn('card group block p-5', (to || onClick) && 'card-hover', className);
  if (to) return <Link to={to} className={cls}>{body}</Link>;
  if (onClick) return <button type="button" onClick={onClick} className={cn(cls, 'w-full text-left')}>{body}</button>;
  return <div className={cls}>{body}</div>;
}

import React from 'react';
import { cn } from '@/utils/cn';

/**
 * Thanh tab. items: [{ value, label, count?, icon? }]
 * variant 'underline' (gạch chân) hoặc 'pills' (segmented).
 */
export default function Tabs({ items, value, onChange, variant = 'underline', className }) {
  if (variant === 'pills') {
    return (
      <div className={cn('inline-flex max-w-full flex-wrap gap-1 rounded-lg bg-slate-100 p-1', className)}>
        {items.map((it) => {
          const active = it.value === value;
          const Icon = it.icon;
          return (
            <button
              key={it.value}
              type="button"
              onClick={() => onChange(it.value)}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                active ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800',
              )}
            >
              {Icon && <Icon className="h-4 w-4" />}
              {it.label}
              {it.count !== undefined && (
                <span className={cn('rounded-full px-1.5 text-xs tabular-nums', active ? 'bg-brand-50 text-brand-700' : 'bg-slate-200 text-slate-600')}>
                  {it.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  }
  return (
    <div className={cn('flex gap-6 overflow-x-auto border-b border-slate-200', className)}>
      {items.map((it) => {
        const active = it.value === value;
        const Icon = it.icon;
        return (
          <button
            key={it.value}
            type="button"
            onClick={() => onChange(it.value)}
            className={cn(
              '-mb-px inline-flex shrink-0 items-center gap-2 border-b-2 pb-3 pt-1 text-sm font-medium transition-colors',
              active ? 'border-brand-600 text-brand-700' : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-800',
            )}
          >
            {Icon && <Icon className="h-4 w-4" />}
            {it.label}
            {it.count !== undefined && (
              <span className={cn('rounded-full px-2 py-0.5 text-xs tabular-nums', active ? 'bg-brand-50 text-brand-700' : 'bg-slate-100 text-slate-600')}>
                {it.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

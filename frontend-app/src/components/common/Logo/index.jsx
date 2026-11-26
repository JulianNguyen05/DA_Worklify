import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/utils/cn';

/** Logo Worklify: ô vuông gradient chữ W + chữ "Worklify". */
export default function Logo({ to = '/', compact = false, className, inverted = false, onClick }) {
  return (
    <Link to={to} onClick={onClick} className={cn('group inline-flex items-center gap-2.5', className)}>
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-600 to-accent-500 shadow-xs transition-transform group-hover:scale-105">
        <span className="font-display text-[15px] font-extrabold leading-none text-white">W</span>
      </span>
      {!compact && (
        <span className={cn('font-display text-lg font-bold tracking-tight', inverted ? 'text-white' : 'text-slate-900')}>
          Work<span className={inverted ? 'text-brand-300' : 'text-brand-600'}>lify</span>
        </span>
      )}
    </Link>
  );
}

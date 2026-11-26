import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/utils/cn';

const VARIANTS = {
  primary:
    'bg-brand-600 text-white shadow-xs hover:bg-brand-700 active:bg-brand-800 focus-visible:ring-brand-500/40',
  secondary:
    'bg-slate-100 text-slate-800 hover:bg-slate-200 active:bg-slate-300 focus-visible:ring-slate-400/40',
  outline:
    'border border-slate-300 bg-white text-slate-700 shadow-xs hover:bg-slate-50 hover:text-slate-900 focus-visible:ring-slate-400/40',
  ghost:
    'text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus-visible:ring-slate-400/40',
  danger:
    'bg-rose-600 text-white shadow-xs hover:bg-rose-700 active:bg-rose-800 focus-visible:ring-rose-500/40',
  'danger-outline':
    'border border-rose-200 bg-white text-rose-600 shadow-xs hover:bg-rose-50 focus-visible:ring-rose-500/40',
  success:
    'bg-emerald-600 text-white shadow-xs hover:bg-emerald-700 focus-visible:ring-emerald-500/40',
  link: 'h-auto! px-0! text-brand-600 hover:text-brand-700 hover:underline underline-offset-4',
};

const SIZES = {
  xs: 'h-7 px-2.5 text-xs gap-1.5 rounded-md',
  sm: 'h-8 px-3 text-sm gap-1.5 rounded-lg',
  md: 'h-10 px-4 text-sm gap-2 rounded-lg',
  lg: 'h-11 px-5 text-[15px] gap-2 rounded-lg',
  icon: 'h-9 w-9 rounded-lg',
};

/**
 * Class của Button — dùng cho <Link> muốn trông như nút:
 *   <Link className={buttonClasses({ variant: 'outline' })} />
 */
export function buttonClasses({ variant = 'primary', size = 'md', className } = {}) {
  return cn(
    'inline-flex shrink-0 items-center justify-center font-semibold whitespace-nowrap select-none',
    'transition-colors duration-150 focus:outline-none focus-visible:ring-4',
    'disabled:pointer-events-none disabled:opacity-50',
    SIZES[size] || SIZES.md,
    VARIANTS[variant] || VARIANTS.primary,
    className,
  );
}

const Button = React.forwardRef(function Button(
  // Không đặt type mặc định: code cũ dựa vào hành vi submit mặc định của <button> trong <form>.
  { children, isLoading, className = '', variant = 'primary', size = 'md', ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      className={buttonClasses({ variant, size, className })}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
});

export default Button;

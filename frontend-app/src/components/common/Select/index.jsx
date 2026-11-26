import React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/utils/cn';

/**
 * Select gốc của trình duyệt, style theo design system.
 * options: [{ value, label }] — hoặc truyền <option> qua children.
 */
const Select = React.forwardRef(function Select(
  { label, name, options, children, required, hint, error, className = '', wrapperClassName = '', placeholder, ...props },
  ref,
) {
  return (
    <div className={cn('w-full', wrapperClassName)}>
      {label && (
        <label htmlFor={name} className="mb-1.5 flex items-baseline justify-between gap-2">
          <span className="text-sm font-medium text-slate-700">
            {label} {required && <span className="text-rose-500">*</span>}
          </span>
          {hint && <span className="text-xs text-slate-400">{hint}</span>}
        </label>
      )}
      <div className="relative">
        <select
          ref={ref}
          id={name}
          name={name}
          required={required}
          className={cn('field-input h-10 appearance-none pr-9', error && 'border-rose-400', className)}
          {...props}
        >
          {placeholder !== undefined && <option value="">{placeholder}</option>}
          {options
            ? options.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))
            : children}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      </div>
      {error && <p className="mt-1.5 text-xs font-medium text-rose-600">{error}</p>}
    </div>
  );
});

export default Select;

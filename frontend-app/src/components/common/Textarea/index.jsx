import React from 'react';
import { cn } from '@/utils/cn';

const Textarea = React.forwardRef(function Textarea(
  { label, name, required, hint, error, rows = 4, className = '', wrapperClassName = '', ...props },
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
      <textarea
        ref={ref}
        id={name}
        name={name}
        rows={rows}
        required={required}
        className={cn('field-input resize-y leading-relaxed', error && 'border-rose-400', className)}
        {...props}
      />
      {error && <p className="mt-1.5 text-xs font-medium text-rose-600">{error}</p>}
    </div>
  );
});

export default Textarea;

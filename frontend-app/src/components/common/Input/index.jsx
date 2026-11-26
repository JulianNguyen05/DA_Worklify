import React from 'react';
import { cn } from '@/utils/cn';

/**
 * Ô nhập liệu có nhãn. Tương thích API cũ (label, name, value, onChange, hint, required)
 * và hỗ trợ thêm: error (thông báo lỗi), icon (component lucide hiển thị bên trái).
 */
const Input = React.forwardRef(function Input(
  { label, type = 'text', name, value, onChange, placeholder, required = false, hint, error, icon: Icon, className = '', wrapperClassName = '', ...props },
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
        {Icon && (
          <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        )}
        <input
          ref={ref}
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
          aria-invalid={error ? true : undefined}
          className={cn(
            'field-input h-10',
            Icon && 'pl-9',
            error && 'border-rose-400 focus:border-rose-500',
            className,
          )}
          {...props}
        />
      </div>
      {error && <p className="mt-1.5 text-xs font-medium text-rose-600">{error}</p>}
    </div>
  );
});

export default Input;

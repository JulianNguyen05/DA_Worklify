import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { cn } from '@/utils/cn';

const TYPES = {
  success: { cls: 'border-emerald-200 bg-emerald-50 text-emerald-900', icon: CheckCircle2, iconCls: 'text-emerald-600' },
  error: { cls: 'border-rose-200 bg-rose-50 text-rose-900', icon: AlertCircle, iconCls: 'text-rose-600' },
  info: { cls: 'border-brand-200 bg-brand-50 text-brand-900', icon: Info, iconCls: 'text-brand-600' },
  warning: { cls: 'border-amber-200 bg-amber-50 text-amber-900', icon: AlertTriangle, iconCls: 'text-amber-600' },
};

/**
 * Thông báo nội tuyến (inline alert). API cũ: type, message, onClose — tự đóng sau 3 giây
 * nếu có onClose. Thông báo nổi toàn cục dùng react-hot-toast (Toaster đặt ở App).
 */
const Toast = ({ type = 'info', message, onClose, className }) => {
  useEffect(() => {
    if (!message || !onClose) return undefined;
    const timer = setTimeout(() => onClose(), 3000);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;
  const t = TYPES[type] || TYPES.info;
  const Icon = t.icon;

  return (
    <div role="alert" className={cn('flex items-start justify-between gap-3 rounded-lg border px-3.5 py-3 text-sm animate-fade-in', t.cls, className)}>
      <div className="flex items-start gap-2.5">
        <Icon className={cn('mt-px h-[18px] w-[18px] shrink-0', t.iconCls)} />
        <span className="font-medium leading-5">{message}</span>
      </div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="rounded p-0.5 opacity-60 transition-opacity hover:opacity-100"
          aria-label="Đóng thông báo"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

export default Toast;

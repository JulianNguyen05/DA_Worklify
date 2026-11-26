import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/utils/cn';

/** Phân trang, currentPage bắt đầu từ 1. API giữ nguyên. */
export default function Pagination({ currentPage, totalPages, onPageChange, className }) {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (currentPage <= 4) return [1, 2, 3, 4, 5, '...', totalPages];
    if (currentPage >= totalPages - 3)
      return [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
  };

  const navBtn =
    'inline-flex h-9 items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 text-sm font-medium text-slate-600 shadow-xs transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white';

  return (
    <nav className={cn('mt-6 flex items-center justify-between gap-2 sm:justify-center', className)} aria-label="Phân trang">
      <button type="button" onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} className={navBtn}>
        <ChevronLeft className="h-4 w-4" />
        <span className="hidden sm:inline">Trước</span>
      </button>

      <div className="hidden items-center gap-1 sm:flex">
        {getPageNumbers().map((page, index) =>
          page === '...' ? (
            <span key={`dots-${index}`} className="px-1.5 text-slate-400">…</span>
          ) : (
            <button
              type="button"
              key={page}
              onClick={() => onPageChange(page)}
              aria-current={currentPage === page ? 'page' : undefined}
              className={cn(
                'h-9 min-w-9 rounded-lg px-2 text-sm font-medium tabular-nums transition-colors',
                currentPage === page
                  ? 'bg-brand-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100',
              )}
            >
              {page}
            </button>
          ),
        )}
      </div>
      <span className="text-sm text-slate-500 sm:hidden">
        Trang <b className="text-slate-900">{currentPage}</b> / {totalPages}
      </span>

      <button type="button" onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} className={navBtn}>
        <span className="hidden sm:inline">Sau</span>
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  );
}

import React from 'react';
import EmptyState from '../EmptyState';
import { Skeleton } from '../Spinner';

/**
 * Bảng dữ liệu. columns: [{ header, accessor | render(row), className }]
 * API cũ giữ nguyên; bảng tự cuộn ngang trên màn hình hẹp.
 */
export default function Table({ columns, data, isLoading, emptyMessage, emptyIcon, onRowClick }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50/80">
            {columns.map((col, index) => (
              <th
                key={index}
                className={`whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 ${col.className || ''}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {isLoading ? (
            [0, 1, 2, 3].map((i) => (
              <tr key={i}>
                {columns.map((_, c) => (
                  <td key={c} className="px-4 py-4">
                    <Skeleton className="h-4 w-full max-w-[160px]" />
                  </td>
                ))}
              </tr>
            ))
          ) : !data || data.length === 0 ? (
            <tr>
              <td colSpan={columns.length}>
                <EmptyState title={emptyMessage || 'Không có dữ liệu.'} icon={emptyIcon} />
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr
                key={row.id ?? rowIndex}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                className={`transition-colors hover:bg-slate-50/80 ${onRowClick ? 'cursor-pointer' : ''}`}
              >
                {columns.map((col, colIndex) => (
                  <td key={colIndex} className={`px-4 py-3.5 align-middle text-slate-700 ${col.cellClassName || ''}`}>
                    {col.render ? col.render(row) : row[col.accessor]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

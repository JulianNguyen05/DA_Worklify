import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logo from '../../common/Logo';
import { findActivePath } from '../navConfig';
import { cn } from '@/utils/cn';

/**
 * Sidebar điều hướng cho khu vực quản lý (nhà tuyển dụng, admin).
 * groups: [{ label, items: [{ name, path, icon }] }]
 */
export default function Sidebar({ groups, workspaceLabel, homePath = '/', onNavigate, footer }) {
  const location = useLocation();
  const allPaths = groups.flatMap((g) => g.items.map((i) => i.path));
  const activePath = findActivePath(location.pathname, allPaths);

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 shrink-0 items-center gap-3 border-b border-slate-200/80 px-5">
        <Logo to={homePath} onClick={onNavigate} />
        {workspaceLabel && (
          <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
            {workspaceLabel}
          </span>
        )}
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-5">
        {groups.map((group) => (
          <div key={group.label}>
            <p className="mb-1.5 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">{group.label}</p>
            <div className="space-y-0.5">
              {group.items.map(({ name, path, icon: Icon }) => {
                const active = activePath === path;
                return (
                  <Link
                    key={path}
                    to={path}
                    onClick={onNavigate}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                      active ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
                    )}
                  >
                    <Icon className={cn('h-[18px] w-[18px] shrink-0', active ? 'text-brand-600' : 'text-slate-400 group-hover:text-slate-600')} />
                    <span className="truncate">{name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {footer && <div className="shrink-0 border-t border-slate-200/80 p-4">{footer}</div>}
    </div>
  );
}

/** Link nhỏ ở chân sidebar, quay về trang việc làm công khai. */
export function SidebarFooterLink({ to = '/jobs', children }) {
  return (
    <Link to={to} className="block rounded-lg px-3 py-2 text-xs font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-800">
      {children}
    </Link>
  );
}

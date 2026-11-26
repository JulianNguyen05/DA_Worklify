import React, { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import Sidebar, { SidebarFooterLink } from '../Sidebar';
import UserMenu from '../UserMenu';
import { findActivePath } from '../navConfig';

/**
 * Khung trang quản lý: sidebar cố định (desktop) / ngăn kéo (mobile) + thanh trên.
 * Dùng cho EmployerLayout và AdminLayout.
 */
export default function DashboardShell({ groups, workspaceLabel, homePath }) {
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => setDrawerOpen(false), [location.pathname]);

  const allItems = groups.flatMap((g) => g.items);
  const activePath = findActivePath(location.pathname, allItems.map((i) => i.path));
  const activeItem = allItems.find((i) => i.path === activePath);

  const sidebar = (
    <Sidebar
      groups={groups}
      workspaceLabel={workspaceLabel}
      homePath={homePath}
      onNavigate={() => setDrawerOpen(false)}
      footer={<SidebarFooterLink to="/jobs">← Xem trang việc làm công khai</SidebarFooterLink>}
    />
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sidebar desktop */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-slate-200/80 bg-white lg:block">{sidebar}</aside>

      {/* Ngăn kéo mobile */}
      {drawerOpen && (
        <div className="fixed inset-0 z-[55] lg:hidden">
          <div className="absolute inset-0 bg-slate-900/40 animate-fade-in" onClick={() => setDrawerOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-72 max-w-[85vw] bg-white shadow-pop animate-pop-in">
            <button
              type="button"
              onClick={() => setDrawerOpen(false)}
              className="absolute right-3 top-4 flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
              aria-label="Đóng menu"
            >
              <X className="h-5 w-5" />
            </button>
            {sidebar}
          </aside>
        </div>
      )}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-slate-200/80 bg-white/85 px-4 backdrop-blur-md sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="-ml-1 flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 lg:hidden"
            aria-label="Mở menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <p className="truncate text-sm font-semibold text-slate-900">{activeItem?.name}</p>
          <div className="ml-auto">
            <UserMenu />
          </div>
        </header>

        <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

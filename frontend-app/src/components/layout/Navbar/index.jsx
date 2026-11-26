import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, LayoutDashboard } from 'lucide-react';
import Logo from '../../common/Logo';
import { buttonClasses } from '../../common/Button';
import UserMenu from '../UserMenu';
import { PUBLIC_LINKS, CANDIDATE_LINKS, ROLE_HOME, findActivePath } from '../navConfig';
import { cn } from '@/utils/cn';

/** Thanh điều hướng trên cùng cho khu vực public + ứng viên (MainLayout). */
export default function Navbar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const token = localStorage.getItem('accessToken');
  const role = localStorage.getItem('userRole');
  const isAuthenticated = !!token;

  useEffect(() => setMobileOpen(false), [location.pathname]);

  let links = PUBLIC_LINKS;
  if (isAuthenticated && role === 'CANDIDATE') links = CANDIDATE_LINKS;
  else if (isAuthenticated && ROLE_HOME[role]) {
    links = [{ name: 'Bảng điều khiển', path: ROLE_HOME[role], icon: LayoutDashboard }, ...PUBLIC_LINKS];
  }
  const activePath = findActivePath(location.pathname, links.map((l) => l.path));
  const logoTo = isAuthenticated && ROLE_HOME[role] ? ROLE_HOME[role] : '/';

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/85 backdrop-blur-md supports-[backdrop-filter]:bg-white/75">
      <div className="page-container flex h-16 items-center gap-6">
        <Logo to={logoTo} />

        <nav className="hidden flex-1 items-center gap-1 lg:flex">
          {links.map((l) => (
            <Link
              key={l.path}
              to={l.path}
              className={cn(
                'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                activePath === l.path ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900',
              )}
            >
              {l.name}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          {!isAuthenticated ? (
            <>
              <Link to="/auth/login" className={buttonClasses({ variant: 'ghost', size: 'sm', className: 'hidden sm:inline-flex' })}>
                Đăng nhập
              </Link>
              <Link to="/auth/register" className={buttonClasses({ size: 'sm' })}>
                Đăng ký
              </Link>
            </>
          ) : (
            <UserMenu />
          )}
          <button
            type="button"
            className="ml-1 flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 lg:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? 'Đóng menu' : 'Mở menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-slate-200 bg-white lg:hidden animate-fade-in">
          <nav className="page-container grid gap-1 py-3">
            {links.map(({ name, path, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium',
                  activePath === path ? 'bg-brand-50 text-brand-700' : 'text-slate-700 hover:bg-slate-50',
                )}
              >
                <Icon className="h-[18px] w-[18px] opacity-70" />
                {name}
              </Link>
            ))}
            {!isAuthenticated && (
              <Link to="/auth/login" className={buttonClasses({ variant: 'outline', className: 'mt-2 w-full' })}>
                Đăng nhập
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}

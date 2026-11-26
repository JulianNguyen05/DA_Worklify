import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronDown, LogOut, UserRound, Building2, Settings, LayoutDashboard } from 'lucide-react';
import authService from '../../../features/auth/authService';
import Avatar from '../../common/Avatar';
import { ROLE_HOME, ROLE_LABEL } from '../navConfig';
import { cn } from '@/utils/cn';

const ROLE_ITEMS = {
  CANDIDATE: [
    { name: 'Hồ sơ của tôi', path: '/candidate/profile', icon: UserRound },
    { name: 'Cài đặt tài khoản', path: '/candidate/settings', icon: Settings },
  ],
  EMPLOYER: [
    { name: 'Hồ sơ công ty', path: '/employer/profile', icon: Building2 },
    { name: 'Cài đặt tài khoản', path: '/employer/settings', icon: Settings },
  ],
  ADMIN: [],
};

/** Nút avatar + menu thả xuống (tài khoản, đăng xuất). */
export default function UserMenu() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const currentUser = authService.getCurrentUser();
  const role = localStorage.getItem('userRole') || '';
  const displayName = currentUser?.fullName || currentUser?.email?.split('@')[0] || 'bạn';

  useEffect(() => {
    const onDown = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  const handleLogout = () => {
    authService.logout();
    setOpen(false);
    navigate('/');
  };

  const items = [
    ...(ROLE_HOME[role] ? [{ name: 'Bảng điều khiển', path: ROLE_HOME[role], icon: LayoutDashboard }] : []),
    ...(ROLE_ITEMS[role] || []),
  ];

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className={cn(
          'flex items-center gap-2.5 rounded-full p-1 pr-2 transition-colors hover:bg-slate-100 focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/20',
          open && 'bg-slate-100',
        )}
      >
        <Avatar name={displayName} size="sm" />
        <span className="hidden max-w-[160px] flex-col items-start text-left md:flex">
          <span className="w-full truncate text-sm font-semibold leading-tight text-slate-900">{displayName}</span>
          <span className="text-xs leading-tight text-slate-500">{ROLE_LABEL[role] || role}</span>
        </span>
        <ChevronDown className={cn('hidden h-4 w-4 text-slate-400 transition-transform md:block', open && 'rotate-180')} />
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-64 origin-top-right rounded-xl border border-slate-200 bg-white p-1.5 shadow-pop animate-pop-in">
          <div className="px-3 py-2.5">
            <p className="truncate text-sm font-semibold text-slate-900">{displayName}</p>
            <p className="truncate text-xs text-slate-500">{currentUser?.email}</p>
          </div>
          {items.length > 0 && (
            <div className="border-t border-slate-100 py-1">
              {items.map(({ name, path, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                >
                  <Icon className="h-4 w-4 text-slate-400" />
                  {name}
                </Link>
              ))}
            </div>
          )}
          <div className="border-t border-slate-100 pt-1">
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm font-medium text-rose-600 hover:bg-rose-50"
            >
              <LogOut className="h-4 w-4" />
              Đăng xuất
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

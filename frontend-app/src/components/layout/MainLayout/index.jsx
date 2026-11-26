import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import Navbar from '../Navbar';
import Logo from '../../common/Logo';

const FOOTER_COLUMNS = [
  {
    title: 'Ứng viên',
    links: [
      { name: 'Tìm việc làm', to: '/jobs' },
      { name: 'Danh sách công ty', to: '/companies' },
      { name: 'Tạo CV', to: '/candidate/cv-templates' },
    ],
  },
  {
    title: 'Nhà tuyển dụng',
    links: [
      { name: 'Đăng tin tuyển dụng', to: '/employer/jobs/create' },
      { name: 'Tìm ứng viên', to: '/employer/candidates/search' },
      { name: 'Đăng ký tài khoản', to: '/auth/register' },
    ],
  },
];

export default function MainLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <Navbar />

      <main className="flex-grow">
        <Outlet />
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="page-container grid gap-10 py-12 md:grid-cols-[1.5fr_1fr_1fr]">
          <div className="max-w-sm">
            <Logo />
            <p className="mt-3 text-sm leading-relaxed text-slate-500">
              Nền tảng kết nối tuyển dụng thông minh — chấm điểm mức độ phù hợp giữa CV và tin tuyển dụng bằng AI.
            </p>
          </div>
          {FOOTER_COLUMNS.map((col) => (
            <div key={col.title}>
              <p className="text-sm font-semibold text-slate-900">{col.title}</p>
              <ul className="mt-3 space-y-2">
                {col.links.map((l) => (
                  <li key={l.to}>
                    <Link to={l.to} className="text-sm text-slate-500 transition-colors hover:text-slate-900">
                      {l.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-slate-100">
          <div className="page-container flex flex-col gap-2 py-5 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
            <span>&copy; {new Date().getFullYear()} Worklify. Tất cả các quyền được bảo lưu.</span>
            <span>Đồ án môn học — Hệ thống tuyển dụng</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sparkles, ShieldCheck, Zap } from 'lucide-react';
import Logo from '../../common/Logo';

const HIGHLIGHTS = [
  { icon: Sparkles, title: 'Chấm điểm CV bằng AI', text: 'Biết ngay hồ sơ phù hợp bao nhiêu % với từng tin tuyển dụng.' },
  { icon: Zap, title: 'Ứng tuyển nhanh', text: 'Tạo CV từ hồ sơ có sẵn, nộp đơn chỉ với vài cú nhấp.' },
  { icon: ShieldCheck, title: 'Doanh nghiệp đã xác minh', text: 'Mọi công ty đều được quản trị viên kiểm duyệt.' },
];

export default function AuthLayout() {
  return (
    <div className="flex min-h-screen w-full bg-white text-slate-900">
      {/* Panel thương hiệu (từ lg) */}
      <div className="relative hidden w-[44%] max-w-[640px] flex-col justify-between overflow-hidden bg-slate-950 p-12 text-white lg:flex">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgb(255 255 255 / 0.12) 1px, transparent 1px), linear-gradient(to bottom, rgb(255 255 255 / 0.12) 1px, transparent 1px)',
            backgroundSize: '44px 44px',
            maskImage: 'radial-gradient(ellipse 80% 60% at 30% 20%, #000 40%, transparent 100%)',
          }}
        />
        <div className="pointer-events-none absolute -left-24 -top-24 h-96 w-96 rounded-full bg-brand-600/40 blur-[110px]" />
        <div className="pointer-events-none absolute -bottom-32 right-0 h-80 w-80 rounded-full bg-accent-500/25 blur-[110px]" />

        <Logo inverted className="relative" />

        <div className="relative max-w-md">
          <h1 className="font-display text-4xl font-bold leading-tight tracking-tight">
            Tìm đúng việc. <br />
            <span className="text-brand-300">Tuyển đúng người.</span>
          </h1>
          <p className="mt-4 text-[15px] leading-relaxed text-slate-300">
            Worklify kết nối ứng viên và doanh nghiệp với công cụ đánh giá mức độ phù hợp dựa trên AI.
          </p>
          <ul className="mt-10 space-y-5">
            {HIGHLIGHTS.map(({ icon: Icon, title, text }) => (
              <li key={title} className="flex gap-3.5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10 ring-1 ring-inset ring-white/15">
                  <Icon className="h-[18px] w-[18px] text-brand-200" />
                </span>
                <div>
                  <p className="text-sm font-semibold">{title}</p>
                  <p className="mt-0.5 text-sm text-slate-400">{text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative flex items-center justify-between text-xs text-slate-500">
          <span>&copy; {new Date().getFullYear()} Worklify</span>
          <span>Đồ án môn học</span>
        </div>
      </div>

      {/* Khu vực form */}
      <div className="flex flex-1 flex-col bg-slate-50 lg:bg-white">
        <div className="flex h-16 items-center px-6 lg:hidden">
          <Logo />
        </div>
        <div className="flex flex-1 items-center justify-center px-4 py-8 sm:px-6 lg:py-12">
          <div className="w-full max-w-[420px] rounded-2xl border border-slate-200 bg-white p-6 shadow-card sm:p-8 lg:border-0 lg:p-0 lg:shadow-none">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}

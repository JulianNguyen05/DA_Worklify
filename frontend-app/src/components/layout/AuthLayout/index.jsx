import React from 'react';
import { Outlet, Link } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <div 
      className="min-h-screen w-full flex bg-[#F8FAFC] text-[#0F172A] overflow-x-hidden"
      style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}
    >
      {/* Import Font Be Vietnam Pro đồng bộ với MainLayout */}
      <link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />

      {/* PANEL TRÁI: Nhận diện thương hiệu (Hiện từ màn hình MD) */}
      <div className="hidden md:flex md:w-[45%] lg:w-[40%] bg-white p-12 flex-col justify-between relative border-r border-[#E2E8F0] overflow-hidden">
        
        {/* Các khối màu Gradient hình học tạo sự trẻ trung */}
        <div className="absolute -top-20 -left-20 w-[350px] h-[350px] bg-[#2563EB]/10 rounded-full blur-[80px] pointer-events-none"></div>
        <div className="absolute bottom-10 right-[-100px] w-[300px] h-[300px] bg-[#14B8A6]/10 rounded-full blur-[70px] pointer-events-none"></div>
        
        {/* Grid pattern ẩn nhẹ phía sau */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 pointer-events-none"></div>

        {/* Logo Worklify - Đồng bộ 100% với Navbar của MainLayout */}
        <div className="z-10">
          <Link 
            to="/" 
            className="flex items-center gap-[10px] group no-underline"
          >
            <div 
              className="w-[36px] h-[36px] rounded-[10px] flex items-center justify-center transform group-hover:scale-105 transition-transform duration-200"
              style={{ 
                background: 'linear-gradient(135deg, #2563EB 0%, #14B8A6 100%)',
                boxShadow: '0 4px 12px rgba(37,99,235,0.25)' 
              }}
            >
              <span className="text-white font-black text-[16px] tracking-[-0.5px]">W</span>
            </div>
            <span className="font-extrabold text-[18px] tracking-[-0.5px] text-[#0F172A]">
              Work<span className="text-[#2563EB]">lify</span>
            </span>
          </Link>
        </div>

        {/* Nội dung truyền động lực */}
        <div className="max-w-sm z-10 my-auto space-y-5">
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-[#EFF6FF] border border-[#BFDBFE]">
            <span className="flex h-2 w-2 rounded-full bg-[#2563EB]"></span>
            <span className="text-[13px] font-semibold text-[#2563EB] tracking-wide uppercase">Cơ hội mới mỗi ngày</span>
          </div>
          
          <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#0F172A] leading-[1.25]">
            Kiến tạo sự nghiệp. <br />
            Bứt phá <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2563EB] to-[#14B8A6]">Tương lai.</span>
          </h1>
          
          <p className="text-[15px] text-[#64748B] leading-relaxed font-medium">
            Nền tảng kết nối việc làm tinh gọn, giúp ứng viên định hình phong cách và doanh nghiệp xây dựng đội ngũ vững mạnh.
          </p>
        </div>

        {/* Footer bản quyền - Style giống Footer MainLayout */}
        <div className="z-10 text-[13px] text-[#64748B] flex items-center justify-between border-t border-[#E2E8F0] pt-6">
          <span>&copy; {new Date().getFullYear()} Worklify.</span>
          <div className="flex gap-5 font-medium">
            <a href="#help" className="hover:text-[#0F172A] transition-colors text-[#64748B] no-underline">Trợ giúp</a>
            <a href="#privacy" className="hover:text-[#0F172A] transition-colors text-[#64748B] no-underline">Bảo mật</a>
          </div>
        </div>
      </div>

      {/* PANEL PHẢI: Khu vực chứa Form */}
      <div className="w-full md:w-[55%] lg:w-[60%] flex items-center justify-center p-6 sm:p-12 lg:p-16 relative">
        
        {/* Đốm màu sáng nhẹ trên mobile */}
        <div className="absolute top-1/4 left-1/3 w-[250px] h-[250px] bg-[#14B8A6]/5 rounded-full blur-[60px] pointer-events-none md:hidden"></div>

        <div className="w-full max-w-[440px] flex flex-col relative z-10">
          
          {/* Logo phụ trên Mobile - Đồng bộ Logo */}
          <div className="flex md:hidden items-center justify-center gap-[10px] mb-8">
            <div 
              className="w-[36px] h-[36px] rounded-[10px] flex items-center justify-center"
              style={{ 
                background: 'linear-gradient(135deg, #2563EB 0%, #14B8A6 100%)',
                boxShadow: '0 4px 12px rgba(37,99,235,0.25)' 
              }}
            >
              <span className="text-white font-black text-[16px] tracking-[-0.5px]">W</span>
            </div>
            <span className="font-extrabold text-[18px] tracking-[-0.5px] text-[#0F172A]">
              Work<span className="text-[#2563EB]">lify</span>
            </span>
          </div>

          {/* Card chứa nội dung động (Outlet) */}
          <div className="bg-white sm:p-10 p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[#E2E8F0] transition-all duration-300">
            {/* Nơi render LoginPage, RegisterPage, ForgotPasswordPage */}
            <Outlet />
          </div>
          
        </div>
      </div>

    </div>
  );
}
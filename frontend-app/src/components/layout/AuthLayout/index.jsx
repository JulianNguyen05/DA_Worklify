import React from 'react';
import { Outlet, Link } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <div className="min-h-screen w-full flex bg-[#F8FAFC] font-sans antialiased text-[#0F172A] overflow-x-hidden">
      
      {/* PANEL TRÁI: Nhận diện thương hiệu Trẻ trung & Truyền cảm hứng (Hiện từ màn hình MD) */}
      <div className="hidden md:flex md:w-[45%] lg:w-[40%] bg-white p-12 flex-col justify-between relative border-r border-[#E2E8F0] overflow-hidden">
        
        {/* Các khối màu Gradient hình học tạo sự trẻ trung, hiện đại */}
        <div className="absolute -top-20 -left-20 w-[350px] h-[350px] bg-[#2563EB]/10 rounded-full blur-[80px] pointer-events-none"></div>
        <div className="absolute bottom-10 right-[-100px] w-[300px] h-[300px] bg-[#14B8A6]/10 rounded-full blur-[70px] pointer-events-none"></div>
        
        {/* Grid pattern ẩn nhẹ phía sau tạo chiều sâu công nghệ tinh tế */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 pointer-events-none"></div>

        {/* Logo Worklify */}
        <div className="z-10">
          <Link to="/" className="flex items-center space-x-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-[#2563EB] flex items-center justify-center shadow-md shadow-blue-500/20 transform group-hover:scale-105 transition-transform duration-200">
              <span className="text-white font-black text-lg tracking-wider">W</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-[#0F172A]">
              Work<span className="text-[#2563EB]">lify</span>
            </span>
          </Link>
        </div>

        {/* Nội dung truyền động lực cho Ứng viên & Nhà tuyển dụng */}
        <div className="max-w-sm z-10 my-auto space-y-5">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100/50">
            <span className="flex h-2 w-2 rounded-full bg-[#2563EB]"></span>
            <span className="text-xs font-semibold text-[#2563EB] tracking-wide uppercase">Cơ hội mới mỗi ngày</span>
          </div>
          
          <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-[#0F172A] leading-[1.2]">
            Kiến tạo sự nghiệp. <br />
            Bứt phá <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2563EB] to-[#14B8A6]">Tương lai.</span>
          </h1>
          
          <p className="text-sm text-[#64748B] leading-relaxed">
            Chào mừng bạn đến với Worklify. Nền tảng kết nối việc làm tinh gọn, giúp ứng viên gen Z định hình phong cách và doanh nghiệp xây dựng đội ngũ vững mạnh.
          </p>
        </div>

        {/* Footer bản quyền */}
        <div className="z-10 text-xs text-[#64748B] flex items-center justify-between border-t border-[#E2E8F0] pt-6">
          <span>&copy; {new Date().getFullYear()} Worklify.</span>
          <div className="space-x-4 font-medium">
            <a href="#help" className="hover:text-[#2563EB] transition-colors">Trợ giúp</a>
            <a href="#privacy" className="hover:text-[#2563EB] transition-colors">Bảo mật</a>
          </div>
        </div>
      </div>

      {/* PANEL PHẢI: Khu vực chứa Form (Login / Register / Forgot Password) */}
      <div className="w-full md:w-[55%] lg:w-[60%] flex items-center justify-center p-6 sm:p-12 lg:p-16 relative">
        
        {/* Đốm màu sáng nhẹ phía sau form tạo hiệu ứng nổi trên nền mobile */}
        <div className="absolute top-1/4 left-1/3 w-[250px] h-[250px] bg-[#14B8A6]/5 rounded-full blur-[60px] pointer-events-none md:hidden"></div>

        <div className="w-full max-w-[440px] flex flex-col">
          
          {/* Logo phụ: Chỉ hiển thị trên Mobile để tối ưu diện tích */}
          <div className="flex md:hidden items-center justify-center space-x-2 mb-8">
            <div className="w-8 h-8 rounded-xl bg-[#2563EB] flex items-center justify-center shadow-md shadow-blue-500/20">
              <span className="text-white font-black text-base">W</span>
            </div>
            <span className="text-lg font-bold text-[#0F172A]">
              Work<span className="text-[#2563EB]">lify</span>
            </span>
          </div>

          {/* Card chứa nội dung động (Outlet) */}
          <div className="bg-white sm:p-10 p-6 rounded-2xl shadow-xl shadow-slate-200/50 border border-[#E2E8F0]/60 transition-all duration-300">
            {/* Nơi render các component con như LoginPage, RegisterPage */}
            <Outlet />
          </div>
          
        </div>
      </div>

    </div>
  );
}
import React from 'react';
import { Outlet, Link } from 'react-router-dom';

export default function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen font-sans">
      
      {/* HEADER / NAVBAR */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <Link to="/" className="text-2xl font-extrabold text-blue-700 tracking-tight">
              SmartMatch
            </Link>

            {/* Navigation Links */}
            <nav className="hidden md:flex gap-6 items-center">
              <Link to="/jobs" className="text-gray-600 hover:text-blue-700 font-medium transition-colors">
                Việc Làm
              </Link>
              <Link to="/companies" className="text-gray-600 hover:text-blue-700 font-medium transition-colors">
                Công Ty
              </Link>
            </nav>

            {/* Auth Buttons */}
            <div className="flex gap-3">
              <Link 
                to="/auth/login" 
                className="text-blue-700 font-medium px-4 py-2 hover:bg-blue-50 rounded-md transition-colors"
              >
                Đăng nhập
              </Link>
              <Link 
                to="/auth/register" 
                className="bg-blue-700 text-white px-5 py-2 rounded-md hover:bg-blue-800 font-medium transition-colors shadow-sm"
              >
                Đăng ký
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* PHẦN THÂN TRANG (Nội dung HomePage sẽ được chèn vào đây thông qua Outlet) */}
      <main className="flex-grow bg-gray-50">
        <Outlet />
      </main>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-gray-300 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <span className="text-xl font-bold text-white">SmartMatch</span>
            <p className="text-sm mt-1">Hệ thống kết nối tuyển dụng thông minh.</p>
          </div>
          <div className="text-sm">
            &copy; 2026 SmartMatch. Tất cả các quyền được bảo lưu.
          </div>
        </div>
      </footer>

    </div>
  );
}
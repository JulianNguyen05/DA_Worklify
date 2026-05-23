import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  
  // 1. Kiểm tra trạng thái đăng nhập và phân quyền
  const token = localStorage.getItem('accessToken');
  const role = localStorage.getItem('userRole'); // Lấy Role từ localStorage
  const isAuthenticated = !!token;

  // 2. Logic xác định đích đến khi nhấn vào Logo SmartMatch
  const getLogoLink = () => {
    if (!isAuthenticated) return '/'; // Khách vãng lai về trang chủ mặc định
    if (role === 'CANDIDATE') return '/candidate/dashboard'; // Ứng viên về Dashboard ứng viên
    if (role === 'EMPLOYER') return '/employer/dashboard';   // NTD về Dashboard NTD
    if (role === 'ADMIN') return '/admin/dashboard';         // Admin về Dashboard Admin
    return '/'; 
  };

  const handleLogout = () => {
    // Xóa toàn bộ dữ liệu phiên khi đăng xuất
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userRole');
    
    // Chuyển hướng về trang chủ mặc định
    navigate('/');
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo - Link động dựa vào trạng thái người dùng */}
          <Link to={getLogoLink()} className="text-2xl font-extrabold text-blue-700 tracking-tight">
            SmartMatch
          </Link>

          {/* Navigation Links - CHỈ HIỂN THỊ KHI ĐÃ ĐĂNG NHẬP */}
          {isAuthenticated && (
            <nav className="hidden md:flex gap-6 items-center">
              <Link to="/jobs" className="text-gray-600 hover:text-blue-700 font-medium transition-colors">
                Việc Làm
              </Link>
              <Link to="/companies" className="text-gray-600 hover:text-blue-700 font-medium transition-colors">
                Công Ty
              </Link>
            </nav>
          )}

          {/* Auth Buttons: Render có điều kiện */}
          <div className="flex gap-3 items-center">
            {isAuthenticated ? (
              // --- GIAO DIỆN KHI ĐÃ ĐĂNG NHẬP ---
              <>
                <span className="text-sm font-medium text-gray-600 hidden sm:block">
                  Chào bạn!
                </span>
                <button 
                  onClick={handleLogout}
                  className="text-red-600 font-medium px-4 py-2 hover:bg-red-50 rounded-md transition-colors"
                >
                  Đăng xuất
                </button>
              </>
            ) : (
              // --- GIAO DIỆN KHI CHƯA ĐĂNG NHẬP (Khách) ---
              <>
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
              </>
            )}
          </div>
          
        </div>
      </div>
    </header>
  );
}
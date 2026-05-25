import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import Navbar from '../Navbar'; // Navbar dùng chung (tự động nhận diện Role)
import Sidebar from '../Sidebar'; // Sidebar chuyên dụng cho Admin
import authService from '../../../features/auth/authService';

export default function AdminLayout() {
  // Kiểm tra trạng thái đăng nhập và vai trò (Security Gate)
  const token = localStorage.getItem('accessToken');
  const role = localStorage.getItem('userRole');

  // Nếu chưa đăng nhập hoặc không phải ADMIN, đá về trang Login
  if (!token || role !== 'ADMIN') {
    authService.logout();
    return <Navigate to="/auth/login" replace />;
  }

  return (
    // Sử dụng Flexbox để dàn trang: h-screen giúp sidebar và layout luôn full màn hình
    <div className="flex h-screen bg-[#f3f4f6] overflow-hidden">
      
      {/* 1. Sidebar cố định bên trái */}
      <Sidebar />

      {/* 2. Cột chính bên phải */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        
        {/* Navbar phía trên */}
        <Navbar />

        {/* Khung nội dung chính (Nội dung sẽ cuộn trong main này) */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 scroll-smooth">
          <div className="max-w-7xl mx-auto">
            {/* Đây là nơi các trang con (Dashboard, UserManagement,...) sẽ hiển thị */}
            <Outlet /> 
          </div>
        </main>
        
      </div>
    </div>
  );
}
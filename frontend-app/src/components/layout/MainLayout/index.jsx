import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../Navbar'; // Import Navbar từ thư mục bên cạnh

export default function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen font-sans">
      
      {/* HEADER / NAVBAR ĐÃ ĐƯỢC TÁCH RA COMPONENT */}
      <Navbar />

      {/* PHẦN THÂN TRANG (Nội dung HomePage/Dashboard sẽ được chèn vào đây thông qua Outlet) */}
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
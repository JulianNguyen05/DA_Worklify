import React from 'react';
import { Outlet, Link } from 'react-router-dom'; // 1. Import thêm Link

export default function EmployerLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      
      {/* 2. Căn chỉnh header */}
      <header className="bg-blue-900 text-white p-4 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center">
          
          {/* 3. Bọc text (hoặc thẻ <img> logo) bằng Link để chuyển hướng */}
          <Link 
            to="/employer/dashboard" 
            className="text-2xl font-bold tracking-wide hover:text-blue-200 transition-colors cursor-pointer"
          >
            SmartMatch
          </Link>
          
        </div>
      </header>
      
      <main className="flex-grow p-6 bg-gray-50">
        <Outlet />
      </main>
      
    </div>
  );
}
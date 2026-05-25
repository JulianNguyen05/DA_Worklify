import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../Navbar'; // 1. Import component Navbar

export default function EmployerLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      
      {/* 2. Sử dụng Navbar chung thay cho phần header tự code tay */}
      <Navbar />
      
      {/* Phần nội dung chính (Dashboard, Quản lý tin,...) sẽ hiển thị ở đây */}
      <main className="flex-grow p-6 bg-gray-50">
        <Outlet />
      </main>
      
    </div>
  );
}
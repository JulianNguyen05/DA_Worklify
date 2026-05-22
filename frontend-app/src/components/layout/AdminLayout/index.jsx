import React from 'react';
import { Outlet } from 'react-router-dom';

export default function AdminLayout() {
  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-gray-800 text-white p-4">Admin Sidebar</aside>
      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet /> {/* Rất quan trọng để hiển thị nội dung bên trong */}
      </main>
    </div>
  );
}
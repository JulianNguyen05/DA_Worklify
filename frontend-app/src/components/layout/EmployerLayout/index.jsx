import React from 'react';
import { Outlet } from 'react-router-dom';

export default function EmployerLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-blue-900 text-white p-4">Employer Header</header>
      <main className="flex-grow p-6 bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
}
import React from 'react';
import { Navigate } from 'react-router-dom';
import DashboardShell from '../DashboardShell';
import { ADMIN_NAV } from '../navConfig';
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

  return <DashboardShell groups={ADMIN_NAV} workspaceLabel="Admin" homePath="/admin/dashboard" />;
}

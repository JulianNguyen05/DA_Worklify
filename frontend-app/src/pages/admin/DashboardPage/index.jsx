import React, { useState, useEffect } from 'react';
import adminService from '../../../features/admin/adminService';
import Toast from '../../../components/common/Toast';

const DashboardPage = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalJobs: 0,
    pendingJobs: 0,
    successfulApplications: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await adminService.getDashboardStats();
        setStats(res.data);
      } catch (err) {
        setError('Không thể tải dữ liệu thống kê.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (isLoading) return <div className="text-gray-500">Đang tải dữ liệu hệ thống...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Tổng quan hệ thống</h1>
      {error && <Toast type="error" message={error} />}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Tổng người dùng" value={stats.totalUsers} color="bg-blue-500" />
        <StatCard title="Tin đang hoạt động" value={stats.totalJobs} color="bg-green-500" />
        <StatCard title="Tin chờ duyệt" value={stats.pendingJobs} color="bg-yellow-500" />
        <StatCard title="Ứng tuyển thành công" value={stats.successfulApplications} color="bg-purple-500" />
      </div>
    </div>
  );
};

const StatCard = ({ title, value, color }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center gap-4">
    <div className={`w-12 h-12 rounded-full ${color} flex items-center justify-center text-white font-bold text-xl`}>
      {/* Icon giả định */}
      #
    </div>
    <div>
      <p className="text-sm text-gray-500 font-medium">{title}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  </div>
);

export default DashboardPage;
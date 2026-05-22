import React from 'react';
import { Link } from 'react-router-dom';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Bảng điều khiển Nhà tuyển dụng</h1>
        <Link to="/employer/jobs/create" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm font-medium transition-colors">
          + Đăng tin mới
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Tin đang hiển thị" value="12" color="bg-blue-500" link="/employer/jobs" />
        <StatCard title="Hồ sơ chờ duyệt" value="48" color="bg-yellow-500" link="/employer/applications" />
        <StatCard title="Đã phỏng vấn" value="15" color="bg-green-500" link="/employer/applications" />
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mt-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Mẹo tuyển dụng hiệu quả</h3>
        <p className="text-sm text-gray-600">Sử dụng tính năng <strong>Quét AI (AI Scanner)</strong> trong phần quản lý hồ sơ để hệ thống tự động chấm điểm độ tương thích của ứng viên với mô tả công việc của bạn, giúp tiết kiệm 70% thời gian sàng lọc sơ bộ.</p>
      </div>
    </div>
  );
}

const StatCard = ({ title, value, color, link }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex justify-between items-center">
    <div>
      <p className="text-sm text-gray-500 font-medium">{title}</p>
      <p className="text-3xl font-bold text-gray-800 mt-1">{value}</p>
      <Link to={link} className="text-sm text-blue-600 hover:underline mt-2 inline-block">Xem chi tiết &rarr;</Link>
    </div>
    <div className={`w-12 h-12 rounded-full ${color} opacity-20`}></div>
  </div>
);
import React from 'react';
import { Link } from 'react-router-dom';

export default function DashboardPage() {
  // Dữ liệu giả lập cho các đường dẫn cần ID động (Dynamic Routes)
  const dummyJobId = 123;
  const dummyApplicationId = 456;

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* 1. Header & Call to Action */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Bảng điều khiển Nhà tuyển dụng</h1>
          <p className="text-sm text-gray-500 mt-1">Quản lý tổng thể chiến dịch tuyển dụng và hồ sơ doanh nghiệp.</p>
        </div>
        <Link 
          to="/employer/jobs/create" 
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-sm flex items-center gap-2"
        >
          <span>+</span> Tạo Tin Tuyển Dụng Mới
        </Link>
      </div>

      {/* 2. Menu Điều hướng Chính (Quick Access) */}
      <div>
        <h2 className="text-lg font-bold text-gray-800 mb-4">Danh mục Quản lý Chính</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <DashboardCard 
            title="Quản lý Tin tuyển dụng"
            desc="Xem danh sách, thêm, sửa, ẩn tin đăng."
            link="/employer/jobs"
            icon="📋"
            color="bg-blue-50 border-blue-100"
          />
          
          <DashboardCard 
            title="Hồ sơ Ứng tuyển"
            desc="Quét AI, chấm điểm và quản lý CV ứng viên."
            link="/employer/applications"
            icon="🗂️"
            color="bg-amber-50 border-amber-100"
          />

          <DashboardCard 
            title="Tìm kiếm Ứng viên"
            desc="Tra cứu chủ động từ kho dữ liệu public."
            link="/employer/candidates/search"
            icon="🔍"
            color="bg-green-50 border-green-100"
          />

          <DashboardCard 
            title="Hồ sơ Doanh nghiệp"
            desc="Cập nhật thông tin, logo và pháp lý."
            link="/employer/profile"
            icon="🏢"
            color="bg-purple-50 border-purple-100"
          />
        </div>
      </div>

      {/* 3. Khu vực Thao tác Chi tiết (Các đường dẫn chứa ID động & Cài đặt) */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Lối tắt & Thao tác chi tiết (Developer Tools)</h2>
        <p className="text-sm text-gray-500 mb-6">
          Khu vực này chứa các liên kết trực tiếp đến mọi file trong thư mục để bạn dễ dàng test giao diện.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Nhóm Job */}
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold text-gray-700 mb-3 border-b pb-2">Nghiệp vụ Tin đăng</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/employer/jobs" className="text-sm text-blue-600 hover:underline">1. Danh sách Tin (JobManagement)</Link>
              </li>
              <li>
                <Link to="/employer/jobs/create" className="text-sm text-blue-600 hover:underline">2. Thêm mới (JobCreate)</Link>
              </li>
              <li>
                <Link to={`/employer/jobs/${dummyJobId}/edit`} className="text-sm text-blue-600 hover:underline">3. Sửa tin #{dummyJobId} (JobEdit)</Link>
              </li>
            </ul>
          </div>

          {/* Nhóm Application */}
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold text-gray-700 mb-3 border-b pb-2">Nghiệp vụ Ứng viên</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/employer/applications" className="text-sm text-blue-600 hover:underline">1. Danh sách CV (ApplicationList)</Link>
              </li>
              <li>
                <Link to={`/employer/applications/${dummyApplicationId}`} className="text-sm text-blue-600 hover:underline">2. Xem chi tiết CV #{dummyApplicationId} (ApplicationDetail)</Link>
              </li>
              <li>
                <Link to="/employer/candidates/search" className="text-sm text-blue-600 hover:underline">3. Tìm kiếm chủ động (CandidateSearch)</Link>
              </li>
            </ul>
          </div>

          {/* Nhóm Account */}
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold text-gray-700 mb-3 border-b pb-2">Tài khoản & Cài đặt</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/employer/profile" className="text-sm text-blue-600 hover:underline">1. Hồ sơ Công ty (CompanyProfile)</Link>
              </li>
              <li>
                <Link to="/employer/settings" className="text-sm text-blue-600 hover:underline">2. Cài đặt bảo mật (Settings)</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

    </div>
  );
}

// Component phụ trợ để vẽ các thẻ tính năng (Card)
const DashboardCard = ({ title, desc, link, icon, color }) => (
  <Link 
    to={link} 
    className={`p-5 rounded-xl border transition-all hover:-translate-y-1 hover:shadow-md block ${color}`}
  >
    <div className="text-3xl mb-3">{icon}</div>
    <h3 className="font-bold text-gray-800 mb-1">{title}</h3>
    <p className="text-xs text-gray-600 leading-relaxed">{desc}</p>
  </Link>
);
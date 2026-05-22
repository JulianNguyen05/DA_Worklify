import React from 'react';
import { Link } from 'react-router-dom';

const DashboardPage = () => {
  // Trong thực tế, bạn sẽ lấy thông tin user từ Context/Redux
  const userName = "Ứng viên"; 

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Chào mừng trở lại, {userName}!</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-700">Hồ sơ cá nhân</h3>
          <p className="text-sm text-gray-500 mt-2">Cập nhật thông tin kỹ năng và kinh nghiệm.</p>
          <Link to="/candidate/profile" className="mt-4 inline-block text-blue-600 hover:underline text-sm font-medium">
            Cập nhật ngay &rarr;
          </Link>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-700">Quản lý CV</h3>
          <p className="text-sm text-gray-500 mt-2">Tải lên hoặc tạo CV mới từ biểu mẫu.</p>
          <Link to="/candidate/cv-builder" className="mt-4 inline-block text-blue-600 hover:underline text-sm font-medium">
            Quản lý CV &rarr;
          </Link>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-700">Việc làm đã ứng tuyển</h3>
          <p className="text-sm text-gray-500 mt-2">Theo dõi trạng thái duyệt hồ sơ của bạn.</p>
          <Link to="/candidate/applications" className="mt-4 inline-block text-blue-600 hover:underline text-sm font-medium">
            Xem danh sách &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
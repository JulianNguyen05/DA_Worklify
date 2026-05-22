import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Input from '../../../components/common/Input';
import Button from '../../../components/common/Button';

export default function HomePage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useState({ keyword: '', location: '' });

  const handleSearch = (e) => {
    e.preventDefault();
    // Điều hướng sang trang JobList kèm query parameters
    const query = new URLSearchParams(searchParams).toString();
    navigate(`/jobs?${query}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-blue-700 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            Tìm Công Việc Phù Hợp Cùng SmartMatch
          </h1>
          <p className="text-lg md:text-xl text-blue-100">
            Hệ thống ứng dụng AI để phân tích và kết nối bạn với những cơ hội tuyệt vời nhất.
          </p>

          <form onSubmit={handleSearch} className="mt-8 bg-white p-2 rounded-lg flex flex-col md:flex-row gap-2 shadow-lg">
            <div className="flex-1">
              <input 
                type="text" 
                placeholder="Chức danh, từ khóa hoặc kỹ năng..." 
                className="w-full p-3 text-gray-800 outline-none rounded-md"
                value={searchParams.keyword}
                onChange={(e) => setSearchParams({ ...searchParams, keyword: e.target.value })}
              />
            </div>
            <div className="w-px bg-gray-300 hidden md:block my-2"></div>
            <div className="flex-1">
              <input 
                type="text" 
                placeholder="Địa điểm (VD: Hà Nội, TP.HCM)" 
                className="w-full p-3 text-gray-800 outline-none rounded-md"
                value={searchParams.location}
                onChange={(e) => setSearchParams({ ...searchParams, location: e.target.value })}
              />
            </div>
            <Button type="submit" className="px-8 py-3 text-lg">Tìm Việc</Button>
          </form>
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="max-w-5xl mx-auto py-16 px-4 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-8">Bạn đang tìm kiếm gì?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link to="/jobs" className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <h3 className="text-xl font-bold text-blue-600 mb-2">Dành cho Ứng viên</h3>
            <p className="text-gray-600">Khám phá hàng ngàn việc làm và để AI giúp bạn tối ưu hóa hồ sơ.</p>
          </Link>
          <Link to="/auth/register" className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <h3 className="text-xl font-bold text-green-600 mb-2">Dành cho Nhà tuyển dụng</h3>
            <p className="text-gray-600">Đăng tin tuyển dụng và tìm kiếm nhân tài phù hợp nhất trong nháy mắt.</p>
          </Link>
        </div>
      </section>
    </div>
  );
}
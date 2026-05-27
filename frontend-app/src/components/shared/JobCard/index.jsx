import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../common/Button';

export default function JobCard({ job }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      
      <div className="flex items-start gap-4">
        {/* Khung hiển thị Logo công ty */}
        <div className="w-16 h-16 bg-white border border-gray-200 rounded-md flex items-center justify-center flex-shrink-0 overflow-hidden">
          {job.logoUrl ? (
            <img src={`http://localhost:8080${job.logoUrl}`} alt="Logo" className="w-full h-full object-contain p-1" />
          ) : (
            <span className="text-xs text-gray-400 font-medium">No Logo</span>
          )}
        </div>

        {/* Thông tin chính của công việc */}
        <div>
          <Link to={`/jobs/${job.id}`}>
            <h3 className="text-lg font-bold text-blue-700 hover:text-blue-800 hover:underline transition-colors">
              {job.title}
            </h3>
          </Link>
          
          {/* Lưu ý: Tạm thời hiển thị companyId, tôi sẽ hướng dẫn bạn hiển thị Tên công ty ở phần dưới */}
          <p className="text-gray-600 font-medium mt-1">
            {job.companyName || `Công ty ID: ${job.companyId}`}
          </p>
          
          <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-500">
            <span className="flex items-center gap-1">📍 {job.location}</span>
            <span className="flex items-center gap-1 font-medium text-green-600">💰 {job.salaryRange || 'Thỏa thuận'}</span>
            <span className="flex items-center gap-1">🕒 {new Date(job.createdAt).toLocaleDateString('vi-VN')}</span>
          </div>
        </div>
      </div>

      {/* Nút hành động */}
      <div className="w-full md:w-auto mt-4 md:mt-0">
        <Link to={`/jobs/${job.id}`} className="block w-full">
          <Button variant="outline" className="w-full md:w-auto border-blue-600 text-blue-600 hover:bg-blue-50">
            Xem chi tiết
          </Button>
        </Link>
      </div>
      
    </div>
  );
}
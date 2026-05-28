import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, MapPin, DollarSign, Clock } from 'lucide-react';
import Button from '../../common/Button';

export default function JobCard({ job }) {
  // 1. Xử lý đồng bộ key JSON
  const actualCompanyName = job.companyName || job.company_name;
  const actualCompanyId = job.companyId || job.company_id;
  const actualLogoUrl = job.logoUrl || job.logo_url;
  const actualSalaryRange = job.salaryRange || job.salary_range;
  const actualCreatedAt = job.createdAt || job.created_at;

  const displayName = actualCompanyName || `Công ty ID: ${actualCompanyId}`;

  // 2. Xử lý URL Logo an toàn tuyệt đối (Đã nâng cấp)
  let displayLogo = null;
  if (actualLogoUrl) {
    // Nếu URL đã có sẵn http thì giữ nguyên, nếu chưa có thì mới nối thêm localhost:8080
    displayLogo = actualLogoUrl.startsWith('http') 
      ? actualLogoUrl 
      : `http://localhost:8080${actualLogoUrl.startsWith('/') ? '' : '/'}${actualLogoUrl}`;
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-100 transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4 group">
      
      <div className="flex items-start gap-5">
        {/* KHUNG HIỂN THỊ LOGO */}
        <div className="w-16 h-16 bg-gray-50 border border-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden shadow-sm">
          {displayLogo ? (
            <img 
              src={displayLogo} 
              alt={displayName} 
              className="w-full h-full object-contain p-1 bg-white" 
              // Bắt lỗi: Nếu load ảnh thất bại, thay bằng ảnh placeholder
              onError={(e) => { 
                e.target.onerror = null; 
                e.target.src = 'https://via.placeholder.com/150?text=Logo'; 
              }}
            />
          ) : (
            <Building2 className="w-8 h-8 text-gray-300" />
          )}
        </div>

        {/* THÔNG TIN CÔNG VIỆC & CÔNG TY */}
        <div>
          <Link to={`/jobs/${job.id}`}>
            <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-700 transition-colors line-clamp-1">
              {job.title}
            </h3>
          </Link>
          
          <p className="text-gray-600 font-medium mt-1 text-sm flex items-center gap-2">
            {displayName}
          </p>
          
          <div className="flex flex-wrap gap-x-4 gap-y-2 mt-3 text-sm text-gray-500">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-gray-400" /> 
              {job.location || 'Chưa cập nhật'}
            </span>
            <span className="flex items-center gap-1.5 font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
              <DollarSign className="w-4 h-4 text-emerald-500" /> 
              {actualSalaryRange || 'Thỏa thuận'}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-gray-400" /> 
              {actualCreatedAt ? new Date(actualCreatedAt).toLocaleDateString('vi-VN') : 'Mới nhất'}
            </span>
          </div>
        </div>
      </div>

      <div className="w-full md:w-auto mt-4 md:mt-0 shrink-0">
        <Link to={`/jobs/${job.id}`} className="block w-full">
          <Button variant="outline" className="w-full md:w-auto border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-600 transition-all">
            Xem chi tiết
          </Button>
        </Link>
      </div>
      
    </div>
  );
}
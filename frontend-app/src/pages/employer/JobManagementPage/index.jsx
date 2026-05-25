// frontend-app\src\pages\employer\JobManagementPage\index.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import employerService from '../../../features/employer/employerService';
import Button from '../../../components/common/Button';

export default function JobManagementPage() {
  const companyId = 10; // Mock Company ID
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    // Giả lập dữ liệu cho đến khi API getMyJobs hoàn thiện
    setJobs([
      { id: 101, title: 'Senior React Developer', status: 'PUBLISHED', applicantsCount: 12, createdAt: '2026-05-10' },
      { id: 102, title: 'Backend Spring Boot', status: 'PENDING', applicantsCount: 0, createdAt: '2026-05-20' },
    ]);
  }, [companyId]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Quản lý Tin tuyển dụng</h2>
        <Button onClick={() => navigate('/employer/jobs/create')}>+ Đăng tin mới</Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="p-3 font-medium text-gray-600">Tiêu đề công việc</th>
              <th className="p-3 font-medium text-gray-600">Ngày đăng</th>
              <th className="p-3 font-medium text-gray-600">Trạng thái</th>
              <th className="p-3 font-medium text-gray-600 text-center">Số ứng viên</th>
              <th className="p-3 font-medium text-gray-600 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {jobs.map((job) => (
              <tr key={job.id} className="hover:bg-gray-50">
                <td className="p-3 font-medium text-gray-800">{job.title}</td>
                <td className="p-3 text-gray-500">{new Date(job.createdAt).toLocaleDateString()}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded text-xs ${job.status === 'PUBLISHED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {job.status === 'PUBLISHED' ? 'Đang hiển thị' : 'Chờ duyệt'}
                  </span>
                </td>
                <td className="p-3 text-center font-bold text-blue-600">{job.applicantsCount}</td>
                <td className="p-3 flex gap-2 justify-center">
                  <Link to={`/employer/applications?jobId=${job.id}`} className="text-blue-600 hover:underline text-xs font-medium">
                    Xem hồ sơ
                  </Link>
                  <span className="text-gray-300">|</span>
                  <Link to={`/employer/jobs/edit/${job.id}`} className="text-gray-500 hover:text-gray-700 text-xs font-medium">
                    Sửa
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
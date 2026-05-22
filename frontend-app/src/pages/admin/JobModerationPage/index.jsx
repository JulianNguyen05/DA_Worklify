import React, { useState, useEffect } from 'react';
import adminService from '../../../features/admin/adminService';
import Button from '../../../components/common/Button';
import Toast from '../../../components/common/Toast';

const JobModerationPage = () => {
  const [jobs, setJobs] = useState([]);
  const [statusMsg, setStatusMsg] = useState({ type: null, message: '' });

  const fetchPendingJobs = async () => {
    try {
      const res = await adminService.getPendingJobs();
      setJobs(res.data.content || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPendingJobs();
  }, []);

  const handleModerate = async (jobId, actionStatus) => {
    try {
      await adminService.moderateJob(jobId, actionStatus);
      setStatusMsg({ type: 'success', message: `Đã ${actionStatus === 'PUBLISHED' ? 'duyệt' : 'từ chối'} tin tuyển dụng.` });
      fetchPendingJobs(); // Tải lại danh sách
    } catch (err) {
      setStatusMsg({ type: 'error', message: 'Thao tác thất bại.' });
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Kiểm duyệt Tin tuyển dụng</h2>
      {statusMsg.type && <div className="mb-4"><Toast type={statusMsg.type} message={statusMsg.message} /></div>}

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="p-3 font-medium text-gray-600">Tiêu đề công việc</th>
              <th className="p-3 font-medium text-gray-600">Công ty</th>
              <th className="p-3 font-medium text-gray-600">Ngày đăng</th>
              <th className="p-3 font-medium text-gray-600 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {jobs.length === 0 ? (
              <tr><td colSpan="4" className="p-4 text-center text-gray-500">Không có tin nào chờ duyệt.</td></tr>
            ) : (
              jobs.map((job) => (
                <tr key={job.id} className="hover:bg-gray-50">
                  <td className="p-3 font-medium text-gray-800">{job.title}</td>
                  <td className="p-3 text-gray-600">{job.companyName}</td>
                  <td className="p-3 text-gray-500">{new Date(job.createdAt).toLocaleDateString()}</td>
                  <td className="p-3 flex gap-2 justify-center">
                    <Button variant="primary" onClick={() => handleModerate(job.id, 'PUBLISHED')} className="px-3 py-1">
                      Duyệt
                    </Button>
                    <Button variant="outline" onClick={() => handleModerate(job.id, 'REJECTED')} className="px-3 py-1 text-red-600 border-red-600 hover:bg-red-50">
                      Từ chối
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default JobModerationPage;
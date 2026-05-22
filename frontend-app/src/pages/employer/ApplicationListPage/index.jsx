import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import employerService from '../../../features/employer/employerService';
import Button from '../../../components/common/Button';
import Toast from '../../../components/common/Toast';

export default function ApplicationListPage() {
  const [searchParams] = useSearchParams();
  const jobId = searchParams.get('jobId') || 101; 
  const companyId = 10;
  
  const [applications, setApplications] = useState([]);
  const [isLoadingScore, setIsLoadingScore] = useState(null);
  const [statusMsg, setStatusMsg] = useState({ type: null, message: '' });

  useEffect(() => {
    // Giả lập dữ liệu fetch từ getApplicationsForJob(jobId)
    setApplications([
      { id: 501, candidateName: 'Nguyễn Văn A', appliedAt: '2026-05-21', status: 'PENDING', aiScore: null },
      { id: 502, candidateName: 'Trần Thị B', appliedAt: '2026-05-22', status: 'REVIEWING', aiScore: 85 }
    ]);
  }, [jobId]);

  const handleAiScan = async (appId) => {
    setIsLoadingScore(appId);
    try {
      // await employerService.getAiScore(appId);
      // Giả lập delay quét AI 2 giây theo chuẩn (thực tế 5-8s [cite: 336])
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const fakeScore = Math.floor(Math.random() * 30) + 70; // 70-99
      setApplications(apps => apps.map(app => app.id === appId ? { ...app, aiScore: fakeScore } : app));
      setStatusMsg({ type: 'success', message: 'Đã hoàn tất phân tích độ phù hợp của AI!' });
    } catch (error) {
      setStatusMsg({ type: 'error', message: 'Lỗi khi quét AI.' });
    } finally {
      setIsLoadingScore(null);
    }
  };

  const handleUpdateStatus = async (appId, newStatus) => {
    try {
      // await employerService.updateApplicationStatus(companyId, appId, newStatus);
      setApplications(apps => apps.map(app => app.id === appId ? { ...app, status: newStatus } : app));
      setStatusMsg({ type: 'success', message: 'Đã cập nhật trạng thái hồ sơ.' });
    } catch (error) {
      setStatusMsg({ type: 'error', message: 'Lỗi cập nhật trạng thái.' });
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Danh sách Hồ sơ ứng tuyển (Tin #{jobId})</h2>
      {statusMsg.type && <div className="mb-4"><Toast type={statusMsg.type} message={statusMsg.message} /></div>}

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="p-3 font-medium text-gray-600">Ứng viên</th>
              <th className="p-3 font-medium text-gray-600">Ngày nộp</th>
              <th className="p-3 font-medium text-gray-600">Điểm AI Matching</th>
              <th className="p-3 font-medium text-gray-600 text-center">Trạng thái</th>
              <th className="p-3 font-medium text-gray-600 text-center">Đánh giá</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {applications.map((app) => (
              <tr key={app.id} className="hover:bg-gray-50">
                <td className="p-3 font-medium text-blue-600 cursor-pointer">{app.candidateName}</td>
                <td className="p-3 text-gray-500">{new Date(app.appliedAt).toLocaleDateString()}</td>
                <td className="p-3">
                  {app.aiScore ? (
                    <span className="font-bold text-green-600">{app.aiScore}% Phù hợp</span>
                  ) : (
                    <Button 
                      variant="outline" 
                      onClick={() => handleAiScan(app.id)} 
                      isLoading={isLoadingScore === app.id}
                      className="px-2 py-1 text-xs border-purple-500 text-purple-600 hover:bg-purple-50"
                    >
                      Quét AI
                    </Button>
                  )}
                </td>
                <td className="p-3 text-center">
                  <span className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-600">{app.status}</span>
                </td>
                <td className="p-3 flex gap-2 justify-center">
                  <Button variant="primary" onClick={() => handleUpdateStatus(app.id, 'ACCEPTED')} className="px-3 py-1 bg-green-600 hover:bg-green-700">Duyệt</Button>
                  <Button variant="outline" onClick={() => handleUpdateStatus(app.id, 'REJECTED')} className="px-3 py-1 text-red-600 border-red-600 hover:bg-red-50">Loại</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
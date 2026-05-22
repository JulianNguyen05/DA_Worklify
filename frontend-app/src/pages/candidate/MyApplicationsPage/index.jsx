import React, { useState, useEffect } from 'react';
import candidateService from '../../../features/candidate/candidateService';
// Giả định bạn đã có component Badge cho trạng thái
import Badge from '../../../components/common/Badge'; 

const MyApplicationsPage = () => {
  const userId = 1; // Mock ID
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await candidateService.getMyApplications(userId);
        setApplications(res.data.content || []);
      } catch (error) {
        console.error("Lỗi tải danh sách ứng tuyển", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchApplications();
  }, [userId]);

  const getStatusConfig = (status) => {
    switch(status) {
      case 'PENDING': return { text: 'Chờ duyệt', type: 'warning' };
      case 'REVIEWING': return { text: 'Đang xem xét', type: 'info' };
      case 'ACCEPTED': return { text: 'Mời phỏng vấn', type: 'success' };
      case 'REJECTED': return { text: 'Từ chối', type: 'error' };
      default: return { text: status, type: 'info' };
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Lịch sử ứng tuyển</h2>
      
      {isLoading ? (
        <p className="text-sm text-gray-500">Đang tải dữ liệu...</p>
      ) : applications.length === 0 ? (
        <p className="text-sm text-gray-500">Bạn chưa ứng tuyển công việc nào.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="p-3 font-medium text-gray-600">Vị trí công việc</th>
                <th className="p-3 font-medium text-gray-600">Công ty</th>
                <th className="p-3 font-medium text-gray-600">Ngày nộp</th>
                <th className="p-3 font-medium text-gray-600">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {applications.map((app) => {
                const statusConf = getStatusConfig(app.status);
                return (
                  <tr key={app.id} className="hover:bg-gray-50">
                    <td className="p-3 font-medium text-blue-600 cursor-pointer">{app.jobTitle}</td>
                    <td className="p-3 text-gray-700">{app.companyName}</td>
                    <td className="p-3 text-gray-500">{new Date(app.appliedAt).toLocaleDateString()}</td>
                    <td className="p-3">
                       <Badge type={statusConf.type}>{statusConf.text}</Badge>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyApplicationsPage;
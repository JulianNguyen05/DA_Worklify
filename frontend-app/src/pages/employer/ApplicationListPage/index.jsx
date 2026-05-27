import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import employerService from '../../../features/employer/employerService';
import authService from '../../../features/auth/authService'; // Khai báo authService
import Button from '../../../components/common/Button';
import Toast from '../../../components/common/Toast';

export default function ApplicationListPage() {
  const [searchParams] = useSearchParams();
  const jobId = searchParams.get('jobId') || 101; 
  
  // LẤY COMPANY ID ĐỘNG: Trích xuất từ nhà tuyển dụng đang đăng nhập thay vì gán cứng bằng 10
  const currentUser = authService.getCurrentUser();
  const companyId = currentUser?.companyId || 10;
  
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingScore, setIsLoadingScore] = useState(null);
  const [statusMsg, setStatusMsg] = useState({ type: null, message: '' });

  // 1. LẤY DANH SÁCH ĐƠN TUYỂN DỤNG THẬT TỪ BACKEND
  useEffect(() => {
    const fetchApplications = async () => {
      setIsLoading(true);
      try {
        const res = await employerService.getApplicationsForJob(jobId);
        // Backend bóc tách ApiResponse wrapped PageResponse, danh sách bản ghi nằm ở res.data.content
        const appList = res.data?.content || [];
        
        // Gắn thêm thuộc tính aiScore cục bộ để theo dõi tiến trình Quét AI trên UI
        const mappedList = appList.map(app => ({
          ...app,
          aiScore: app.aiScore || null 
        }));
        setApplications(mappedList);
      } catch (error) {
        console.error("Lỗi lấy danh sách hồ sơ tuyển dụng từ máy chủ:", error);
        setStatusMsg({ type: 'error', message: 'Không thể kết nối đến máy chủ lấy dữ liệu hồ sơ!' });
      } finally {
        setIsLoading(false);
      }
    };

    if (jobId) {
      fetchApplications();
    }
  }, [jobId]);

  // 2. KẾT NỐI AI MATCH SCORE THỰC TẾ (Quét NLP và Học máy từ backend)
  const handleAiScan = async (appId) => {
    setIsLoadingScore(appId);
    try {
      const res = await employerService.getAiScore(appId);
      // Kết quả trả về cấu trúc AiMatchScoreResponse { confidenceScore: float }
      const aiData = res.data;
      const scorePercentage = aiData?.confidenceScore ? Math.round(aiData.confidenceScore) : 0;

      setStatusMsg({ type: 'success', message: `Phân tích AI Matcher hoàn tất! Độ trùng khớp: ${scorePercentage}%` });
      
      // Đồng bộ điểm số phân tích NLP thật vào danh sách hiển thị
      setApplications(prev => prev.map(app => 
        app.id === appId ? { ...app, aiScore: scorePercentage } : app
      ));
    } catch (error) {
      console.error("Lỗi đồng bộ hoặc xử lý tiến trình AI:", error);
      setStatusMsg({ type: 'error', message: 'Hệ thống AI đang xử lý bất đồng bộ hoặc gặp sự cố!' });
    } finally {
      setIsLoadingScore(null);
    }
  };

  // 3. CẬP NHẬT TRẠNG THÁI HỒ SƠ THẬT QUA ENDPOINT PATCH
  const handleUpdateStatus = async (appId, newStatus) => {
    try {
      await employerService.updateApplicationStatus(companyId, appId, newStatus);
      setStatusMsg({ type: 'success', message: `Đã chuyển đổi trạng thái hồ sơ thành công sang: ${newStatus}` });
      
      // Cập nhật State tức thời trên View UI
      setApplications(prev => prev.map(app => 
        app.id === appId ? { ...app, status: newStatus } : app
      ));
    } catch (error) {
      console.error("Lỗi thực thi cập nhật trạng thái đơn ứng tuyển:", error);
      setStatusMsg({ type: 'error', message: 'Thao tác phê duyệt/loại lên hệ thống thất bại!' });
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      {statusMsg.message && (
        <Toast type={statusMsg.type} message={statusMsg.message} onClose={() => setStatusMsg({ type: null, message: '' })} />
      )}

      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Danh sách đơn ứng tuyển</h2>
          <p className="text-sm text-gray-500 mt-1">Cơ chế Tuyển dụng Ẩn danh (Blind Recruitment) đảm bảo tính công bằng (Mã Job: #{jobId})</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="p-3 font-medium text-gray-600">Ứng viên (Hệ thống ẩn danh)</th>
              <th className="p-3 font-medium text-gray-600">Ngày nộp đơn</th>
              <th className="p-3 font-medium text-gray-600">Đánh giá độ phù hợp AI</th>
              <th className="p-3 font-medium text-gray-600 text-center">Trạng thái hiện tại</th>
              <th className="p-3 font-medium text-gray-600 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              <tr>
                <td colSpan="5" className="p-8 text-center text-gray-500">Đang tải dữ liệu thực tế từ máy chủ SmartMatch...</td>
              </tr>
            ) : applications.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-8 text-center text-gray-500">Chưa có ứng viên nào nộp hồ sơ cho vị trí này.</td>
              </tr>
            ) : (
              applications.map((app) => (
                <tr key={app.id} className="hover:bg-gray-50">
                  <td className="p-3 font-medium text-blue-600 cursor-pointer">
                    {/* Sử dụng blindTestUrl trung lập từ Domain Entity phục vụ đánh giá khách quan */}
                    <a href={app.blindTestUrl} target="_blank" rel="noreferrer" className="hover:underline">
                      {app.candidateName || `Hồ sơ ứng viên ẩn danh #${app.id}`}
                    </a>
                  </td>
                  <td className="p-3 text-gray-500">
                    {app.appliedAt ? new Date(app.appliedAt).toLocaleDateString('vi-VN') : 'Vừa mới nộp'}
                  </td>
                  <td className="p-3">
                    {app.aiScore !== null ? (
                      <span className="font-bold text-green-600">🎯 {app.aiScore}% Phù hợp</span>
                    ) : (
                      <Button 
                        variant="outline" 
                        onClick={() => handleAiScan(app.id)} 
                        isLoading={isLoadingScore === app.id}
                        className="px-2 py-1 text-xs border-purple-500 text-purple-600 hover:bg-purple-50"
                      >
                        🤖 Quét AI Match
                      </Button>
                    )}
                  </td>
                  <td className="p-3 text-center">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      app.status === 'ACCEPTED' || app.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                      app.status === 'REJECTED' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {app.status}
                    </span>
                  </td>
                  <td className="p-3 flex gap-2 justify-center">
                    <Button 
                      variant="primary" 
                      onClick={() => handleUpdateStatus(app.id, 'ACCEPTED')} 
                      className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-xs rounded"
                      disabled={app.status === 'ACCEPTED' || app.status === 'REJECTED'}
                    >
                      Duyệt
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => handleUpdateStatus(app.id, 'REJECTED')} 
                      className="px-3 py-1 text-red-600 border border-red-600 hover:bg-red-50 text-xs rounded"
                      disabled={app.status === 'ACCEPTED' || app.status === 'REJECTED'}
                    >
                      Loại
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
}
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import employerService from '../../../features/employer/employerService';
import Button from '../../../components/common/Button';
import Badge from '../../../components/common/Badge'; // Đảm bảo đường dẫn import đúng

export default function JobManagementPage() {
  const companyId = 10; // TODO: Lấy từ Context/Redux sau khi có Auth thực tế
  const navigate = useNavigate();
  
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    loadJobs();
  }, [companyId]);

  const loadJobs = async () => {
    try {
      setLoading(true);
      const result = await employerService.getMyJobs(companyId, 0, 10);
      // Giả định backend trả về format: { code: 200, data: { content: [...] } }
      setJobs(result.data?.content || []);
    } catch (error) {
console.error('Lỗi khi tải danh sách tin:', error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  // Tính năng Ẩn danh (Blind Testing)
  const handleCopyBlindTestLink = (jobId) => {
    // Tạo URL qua sub-domain trung lập để loại bỏ thiên kiến thương hiệu
    const blindUrl = `https://appa.ungdungnghiencuu.com/apply/blind-test/${jobId}`;
    navigator.clipboard.writeText(blindUrl);
    
    setToastMessage('Đã sao chép Link Ứng tuyển Ẩn danh!');
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleStatusChange = async (jobId, newStatus) => {
    // TODO: Tích hợp API chuyển trạng thái (Close/Renew)
    setToastMessage(`Đã chuyển trạng thái tin #${jobId} sang ${newStatus}`);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const renderStatusBadge = (status) => {
    switch (status) {
      case 'ACTIVE': return <Badge variant="success">Đang hiển thị</Badge>;
      case 'PENDING': return <Badge variant="warning">Chờ duyệt</Badge>;
      case 'CLOSED': return <Badge variant="danger">Đã đóng</Badge>;
      default: return <Badge variant="primary">{status}</Badge>;
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 min-h-screen relative">
      {/* Thông báo Toast Mini */}
      {toastMessage && (
        <div className="absolute top-4 right-4 bg-gray-800 text-white px-4 py-2 rounded shadow-lg text-sm transition-opacity animate-fade-in-down z-50">
          {toastMessage}
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Quản lý Tin tuyển dụng</h2>
          <p className="text-sm text-gray-500 mt-1">Theo dõi hiệu suất và vòng đời các vị trí đang mở.</p>
        </div>
        <Button onClick={() => navigate('/employer/jobs/create')} className="whitespace-nowrap">
          + Đăng tin mới
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-lg border border-dashed border-gray-200">
          <p className="text-gray-500 mb-4">Bạn chưa đăng tin tuyển dụng nào.</p>
          <Button onClick={() => navigate('/employer/jobs/create')}>Tạo tin đầu tiên</Button>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="p-4 font-semibold text-gray-700 w-1/3">Vị trí tuyển dụng</th>
                <th className="p-4 font-semibold text-gray-700">Trạng thái</th>
                <th className="p-4 font-semibold text-gray-700">Ngày hết hạn</th>
                <th className="p-4 font-semibold text-gray-700 text-center">Hồ sơ chờ</th>
                <th className="p-4 font-semibold text-gray-700 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {jobs.map((job) => (
                <tr key={job.id} className="hover:bg-blue-50/50 transition-colors group">
                  <td className="p-4">
                    <div className="font-bold text-gray-800 text-base">{job.title}</div>
                    <div className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                      <span>{job.location}</span>
                      <span>•</span>
                      <span>{job.workType}</span>
                    </div>
                  </td>
                  <td className="p-4 align-middle">
                    {renderStatusBadge(job.status)}
                  </td>
                  <td className="p-4 text-gray-600">
                    {new Date(job.expiresAt).toLocaleDateString('vi-VN')}
                  </td>
                  <td className="p-4 text-center">
                    {/* Mock số lượng ứng viên chờ duyệt - Cần backend bổ sung field này vào DTO sau */}
                    <Link 
                      to={`/employer/applications?jobId=${job.id}`} 
                      className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold hover:bg-blue-200 transition-colors"
                      title="Xem danh sách ứng viên"
                    >
                      {Math.floor(Math.random() * 10) + 1}
                    </Link>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end items-center gap-3">
                      <button 
                        onClick={() => handleCopyBlindTestLink(job.id)}
                        className="text-gray-500 hover:text-indigo-600 text-xs font-medium bg-gray-100 hover:bg-indigo-50 px-2 py-1 rounded transition-colors"
                        title="Copy Link Blind Test (Ẩn danh thương hiệu)"
                      >
                        🔗 Blind Link
                      </button>
                      
                      <Link 
                        to={`/employer/jobs/edit/${job.id}`} 
                        className="text-gray-500 hover:text-blue-600 text-xs font-medium transition-colors"
                      >
                        Sửa
                      </Link>
                      
                      {job.status === 'ACTIVE' ? (
                        <button 
                          onClick={() => handleStatusChange(job.id, 'CLOSED')}
                          className="text-gray-500 hover:text-red-600 text-xs font-medium transition-colors"
                        >
                          Đóng tin
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleStatusChange(job.id, 'ACTIVE')}
                          className="text-gray-500 hover:text-green-600 text-xs font-medium transition-colors"
                        >
                          Gia hạn
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
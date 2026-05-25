import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import employerService from '../../../features/employer/employerService';
import authService from '../../../features/auth/authService'; // Đảm bảo đã import authService
import Button from '../../../components/common/Button';
import Badge from '../../../components/common/Badge';

export default function JobManagementPage() {
  const navigate = useNavigate();
  
  // 1. Lấy userId từ tài khoản đang đăng nhập (ví dụ lúc này là số 4)
  const currentUser = authService.getCurrentUser();
  const userId = currentUser?.userId || currentUser?.id; 
  
  // Tạo thêm một State để lưu Company ID thực tế (ví dụ lúc này là số 1)
  const [companyId, setCompanyId] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState('');

  // LUỒNG 1: Sử dụng userId (4) để đi tìm companyId (1) từ Backend
  useEffect(() => {
    if (!userId) {
      setLoading(false);
      navigate('/auth/login');
      return;
    }
    
    const fetchCompanyId = async () => {
      try {
        setLoading(true);
        // Gọi API công khai: GET /api/v1/employers/4/profile
        const profileResult = await employerService.getCompanyProfile(userId);
        
        // Bóc tách lấy ID thật của doanh nghiệp (sẽ lấy ra số 1)
        const realCompanyId = profileResult.data?.id; 

        if (realCompanyId) {
          setCompanyId(realCompanyId); // Cập nhật vào state
        } else {
          console.warn("Tài khoản này chưa được khởi tạo hồ sơ doanh nghiệp!");
          setLoading(false);
        }
      } catch (error) {
        console.error('Lỗi khi lấy thông tin doanh nghiệp:', error);
        setLoading(false);
      }
    };

    fetchCompanyId();
  }, [userId, navigate]);

  // LUỒNG 2: Khi đã có companyId thật (số 1), tiến hành load danh sách Tin tuyển dụng
  useEffect(() => {
    if (!companyId) return;
    loadJobs();
  }, [companyId]);

  const loadJobs = async () => {
    try {
      setLoading(true);
      // Gọi API: GET /api/v1/jobs/employers/1?page=0&size=10
      const result = await employerService.getMyJobs(companyId, 0, 10);
      setJobs(result.data?.content || []);
    } catch (error) {
      console.error('Lỗi khi tải danh sách tin:', error.response?.data || error.message);
      setToastMessage('Không thể tải danh sách tin tuyển dụng từ hệ thống.');
      setTimeout(() => setToastMessage(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  // Tính năng Sao chép Link Ứng tuyển Ẩn danh
  const handleCopyBlindTestLink = (jobId) => {
    const blindUrl = `https://appa.ungdungnghiencuu.com/apply/blind-test/${jobId}`;
    navigator.clipboard.writeText(blindUrl);
    setToastMessage('Đã sao chép Link Ứng tuyển Ẩn danh!');
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Tính năng Cập nhật trạng thái tin tuyển dụng
  const handleStatusChange = async (jobId, newStatus) => {
    if (!companyId) return;
    try {
      await employerService.updateApplicationStatus(companyId, jobId, newStatus);
      setToastMessage(`Đã chuyển trạng thái tin #${jobId} sang ${newStatus}`);
      loadJobs(); // Tải lại danh sách sau khi cập nhật thành công
    } catch (error) {
      console.error('Lỗi khi đổi trạng thái:', error);
      setToastMessage('Có lỗi xảy ra khi cập nhật trạng thái.');
    }
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
      {toastMessage && (
        <div className="absolute top-4 right-4 bg-gray-800 text-white px-4 py-2 rounded shadow-lg text-sm transition-opacity z-50">
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
                    {job.expiresAt ? new Date(job.expiresAt).toLocaleDateString('vi-VN') : 'Không giới hạn'}
                  </td>
                  <td className="p-4 text-center">
                    <Link 
                      to={`/employer/applications?jobId=${job.id}`} 
                      className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold hover:bg-blue-200 transition-colors"
                    >
                      {job.applicationCount || 0} 
                    </Link>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end items-center gap-3">
                      <button 
                        onClick={() => handleCopyBlindTestLink(job.id)}
                        className="text-gray-500 hover:text-indigo-600 text-xs font-medium bg-gray-100 hover:bg-indigo-50 px-2 py-1 rounded transition-colors"
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
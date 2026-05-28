import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import employerService from '../../../features/employer/employerService';
import authService from '../../../features/auth/authService';
import Button from '../../../components/common/Button';
import Badge from '../../../components/common/Badge';

export default function JobManagementPage() {
  const navigate = useNavigate();
  
  const currentUser = authService.getCurrentUser();
  const userId = currentUser?.userId || currentUser?.id; 
  
  const [companyId, setCompanyId] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState('');

  // LUỒNG 1: Lấy thông tin profile doanh nghiệp dựa trên userId tài khoản đang login
  useEffect(() => {
    if (!userId) {
      setLoading(false);
      navigate('/auth/login');
      return;
    }
    
    const fetchCompanyId = async () => {
      try {
        setLoading(true);
        const profileResult = await employerService.getCompanyProfile(userId);
        const realCompanyId = profileResult.data?.id; 

        if (realCompanyId) {
          setCompanyId(realCompanyId);
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

  // LUỒNG 2: Khi đã lấy được companyId thực tế, tiến hành nạp danh sách tin tuyển dụng
  useEffect(() => {
    if (!companyId) return;
    loadJobs();
  }, [companyId]);

  const loadJobs = async () => {
    try {
      setLoading(true);
      const result = await employerService.getMyJobs(companyId, 0, 10);
      setJobs(result.data?.content || []);
    } catch (error) {
      console.error('Lỗi khi tải danh sách tin:', error.response?.data || error.message);
      showToast('Không thể tải danh sách tin tuyển dụng từ hệ thống.');
    } finally {
      setLoading(false);
    }
  };

  // Hàm hiển thị thông báo Toast nhanh
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Tính năng cập nhật trạng thái tin tuyển dụng (Đóng bài đăng)
  const handleStatusChange = async (jobId, newStatus) => {
    if (!companyId) return;
    try {
      await employerService.updateApplicationStatus(companyId, jobId, newStatus);
      showToast('Đã dừng hiển thị tin tuyển dụng thành công.');
      loadJobs(); 
    } catch (error) {
      console.error('Lỗi khi đổi trạng thái:', error);
      showToast('Có lỗi xảy ra khi cập nhật trạng thái.');
    }
  };

  const renderStatusBadge = (status) => {
    switch (status) {
      case 'ACTIVE': return <Badge variant="success">Đang hiển thị</Badge>;
      case 'PENDING': return <Badge variant="warning">Chờ duyệt</Badge>;
      case 'CLOSED': return <Badge variant="danger">Đã đóng</Badge>;
      default: return <Badge variant="primary">{status}</Badge>;
    }
  };

  const formatWorkType = (type) => {
    switch (type) {
      case 'FULL_TIME': return 'Toàn thời gian';
      case 'PART_TIME': return 'Bán thời gian';
      case 'INTERNSHIP': return 'Thực tập sinh';
      case 'REMOTE': return 'Làm việc từ xa';
      default: return type;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/30 py-8 px-4 sm:px-6 lg:px-8 relative">
      
      {/* Toast Notification Giao diện mới sạch sẽ */}
      {toastMessage && (
        <div className="fixed top-5 right-5 bg-slate-900/95 backdrop-blur-sm text-white px-5 py-3 rounded-xl shadow-xl shadow-slate-900/20 text-sm font-medium z-50 transition-all border border-slate-800 animate-fade-in flex items-center gap-2">
          <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {toastMessage}
        </div>
      )}

      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl shadow-gray-200/40 border border-gray-100 max-w-6xl mx-auto transition-all">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">Quản lý Tin tuyển dụng</h2>
            <p className="text-sm text-gray-500 mt-1">Theo dõi trạng thái hiển thị và quản lý hồ sơ ứng tuyển của các vị trí.</p>
          </div>
          <Button 
            onClick={() => navigate('/employer/jobs/create')} 
            className="whitespace-nowrap inline-flex items-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-indigo-100 transition-all text-sm"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Đăng tin mới
          </Button>
        </div>

        {loading ? (
          /* Khung xương Skeleton Table đẹp đẽ thay cho Spinner quay tròn */
          <div className="overflow-x-auto rounded-xl border border-gray-100 shadow-sm animate-pulse">
            <table className="w-full text-left border-collapse text-sm">
              <thead className="bg-gray-50/70">
                <tr>
                  <th className="p-4 bg-gray-100/60 w-2/5 h-12"></th>
                  <th className="p-4 bg-gray-100/60 h-12 w-24"></th>
                  <th className="p-4 bg-gray-100/60 h-12 w-32"></th>
                  <th className="p-4 bg-gray-100/60 h-12 w-24 text-center"></th>
                  <th className="p-4 bg-gray-100/60 h-12 w-36"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[1, 2, 3].map((n) => (
                  <tr key={n}>
                    <td className="p-5 space-y-2.5">
                      <div className="h-4 bg-gray-100 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-100 rounded w-1/2"></div>
                    </td>
                    <td className="p-5"><div className="h-6 bg-gray-100 rounded-full w-20"></div></td>
                    <td className="p-5"><div className="h-4 bg-gray-100 rounded w-24"></div></td>
                    <td className="p-5"><div className="h-8 w-8 bg-gray-100 rounded-full mx-auto"></div></td>
                    <td className="p-5"><div className="h-4 bg-gray-100 rounded w-16 ml-auto"></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : jobs.length === 0 ? (
          /* Trạng thái trống trống trải */
          <div className="text-center py-20 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <p className="text-gray-500 font-medium mb-4">Doanh nghiệp của bạn chưa đăng tin tuyển dụng nào.</p>
            <Button onClick={() => navigate('/employer/jobs/create')} className="px-5 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors">
              Tạo bài đăng đầu tiên
            </Button>
          </div>
        ) : (
          /* Danh sách bảng tin chính thức */
          <div className="overflow-x-auto rounded-xl border border-gray-100 shadow-sm bg-white">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-gray-50/70 border-b border-gray-100">
                  <th className="p-4 font-bold text-gray-700 w-2/5">Vị trí tuyển dụng</th>
                  <th className="p-4 font-bold text-gray-700 w-28">Trạng thái</th>
                  <th className="p-4 font-bold text-gray-700 w-32">Hạn nộp hồ sơ</th>
                  <th className="p-4 font-bold text-gray-700 text-center w-28">Hồ sơ đã nhận</th>
                  <th className="p-4 font-bold text-gray-700 text-right w-36">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {jobs.map((job) => (
                  <tr key={job.id} className="hover:bg-slate-50/60 transition-colors group">
                    <td className="p-4 lg:p-5">
                      <div className="font-semibold text-gray-900 text-base group-hover:text-indigo-600 transition-colors">{job.title}</div>
                      <div className="text-xs text-gray-400 mt-1.5 flex items-center gap-2 font-medium">
                        <span className="flex items-center gap-1">
                          <svg className="w-3.5 h-3.5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          </svg>
                          {job.location}
                        </span>
                        <span className="text-gray-300">•</span>
                        <span>{formatWorkType(job.workType)}</span>
                      </div>
                    </td>
                    <td className="p-4 align-middle">
                      {renderStatusBadge(job.status)}
                    </td>
                    <td className="p-4 text-gray-500 font-medium">
                      {job.expiresAt ? new Date(job.expiresAt).toLocaleDateString('vi-VN') : 'Không giới hạn'}
                    </td>
                    <td className="p-4 text-center">
                      <Link 
                        to={`/employer/applications?jobId=${job.id}`} 
                        className="inline-flex items-center justify-center min-w-[32px] h-8 px-2 rounded-full bg-indigo-50 text-indigo-600 font-bold hover:bg-indigo-100 hover:text-indigo-700 transition-colors text-xs border border-indigo-100/50"
                      >
                        {job.applicationCount || 0}
                      </Link>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end items-center gap-4">
                        <Link 
                          to={`/employer/jobs/edit/${job.id}`} 
                          className="text-gray-600 hover:text-indigo-600 font-semibold text-xs transition-colors"
                        >
                          Chỉnh sửa
                        </Link>
                        
                        {/* Chỉ hiện nút Đóng tin nếu trạng thái là ACTIVE */}
                        {job.status === 'ACTIVE' && (
                          <button 
                            onClick={() => handleStatusChange(job.id, 'CLOSED')}
                            className="text-gray-400 hover:text-red-600 font-semibold text-xs transition-colors"
                          >
                            Đóng tin
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
    </div>
  );
}
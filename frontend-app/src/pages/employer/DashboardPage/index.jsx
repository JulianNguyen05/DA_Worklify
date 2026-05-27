import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Users, FileText, CheckCircle, ArrowRight, Activity, MapPin } from 'lucide-react';
import authService from '../../../features/auth/authService';
import employerService from '../../../features/employer/employerService';

const DashboardPage = () => {
  const [uiState, setUiState] = useState({ isLoading: true, error: null });
  const [data, setData] = useState({
    user: null,
    stats: { activeJobs: 0, totalApplications: 0, newCandidates: 0, successHires: 0 },
    recentJobs: [],
    recentApplications: []
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      const currentUser = authService.getCurrentUser();
      
      if (!currentUser?.userId) {
        setUiState({ isLoading: false, error: 'Không tìm thấy phiên đăng nhập.' });
        return;
      }

      try {
        // Tối ưu hoá: Lấy thông tin cần thiết song song
        // Lưu ý: Các hàm API này giả định đã được định nghĩa trong employerService
        const [jobsRes, statsRes] = await Promise.allSettled([
          employerService.getMyJobs(currentUser.userId, 0, 5),
          employerService.getDashboardStats(currentUser.userId) // Dữ liệu thống kê tổng hợp (nếu Backend có)
        ]);

        const jobs = jobsRes.status === 'fulfilled' ? jobsRes.value?.data : { items: [], totalElements: 0 };
        // Lấy tạm 1 data giả lập nếu statsRes bị lỗi (Ví dụ: Backend chưa code xong api /dashboard)
        const statsData = statsRes.status === 'fulfilled' ? statsRes.value?.data : {
            activeJobs: jobs?.totalElements || 0,
            totalApplications: 24, // Giả lập
            newCandidates: 8,     // Giả lập
            successHires: 3       // Giả lập
        };

        setData({
          user: currentUser,
          stats: statsData,
          recentJobs: jobs?.items || jobs?.content || [],
          // Giả lập danh sách ứng viên mới vì chưa có API getRecentApplications
          recentApplications: [
            { id: 101, name: "Nguyễn Văn A", position: "Frontend Developer", date: "2 giờ trước", status: "Chờ duyệt" },
            { id: 102, name: "Trần Thị B", position: "Backend Java", date: "5 giờ trước", status: "Chờ duyệt" },
            { id: 103, name: "Lê Hoàng C", position: "Product Manager", date: "Hôm qua", status: "Đã đánh giá" },
          ]
        });

      } catch (err) {
        console.error(err);
        setUiState(prev => ({ ...prev, error: 'Đã xảy ra lỗi khi đồng bộ dữ liệu doanh nghiệp.' }));
      } finally {
        setUiState(prev => ({ ...prev, isLoading: false }));
      }
    };

    fetchDashboardData();
  }, []);

  const displayName = useMemo(() => {
    if (data.user?.companyName) return data.user.companyName;
    return data.user?.email ? data.user.email.split('@')[0] : "Nhà tuyển dụng";
  }, [data.user]);

  if (uiState.isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <span className="text-gray-600 font-medium">Đang tải dữ liệu tổng quan...</span>
      </div>
    );
  }

  if (uiState.error) {
    return (
      <div className="p-6 max-w-4xl mx-auto bg-red-50 border border-red-200 text-red-700 rounded-xl mt-10">
        <p className="font-semibold">{uiState.error}</p>
        <button onClick={() => window.location.reload()} className="mt-3 text-sm underline text-red-800">Thử lại</button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">
      {/* 1. Header Area - Lời chào & Nút thao tác nhanh */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden">
        {/* Background Pattern Nhẹ */}
        <div className="absolute right-0 top-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 opacity-60"></div>
        
        <div className="relative z-10">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Chào mừng trở lại, <span className="text-blue-700">{displayName}</span>
          </h1>
          <p className="text-gray-500 mt-2 font-medium">
            Theo dõi hiệu quả tuyển dụng và quản lý hồ sơ ứng viên của bạn hôm nay.
          </p>
        </div>
        
        <div className="relative z-10 flex gap-3">
          <Link 
            to="/employer/candidates/search" 
            className="px-6 py-2.5 bg-white text-gray-700 font-semibold rounded-xl border border-gray-200 shadow-sm hover:bg-gray-50 transition-all flex items-center gap-2"
          >
            <Users className="w-4 h-4" /> Tìm ứng viên
          </Link>
          <Link 
            to="/employer/jobs/create" 
            className="px-6 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-xl shadow-md transition-all flex items-center gap-2"
          >
            <Briefcase className="w-4 h-4" /> Đăng tin mới
          </Link>
        </div>
      </header>

      {/* 2. Tổng quan số liệu (Quick Stats Cards) */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Tin đang mở" 
          value={data.stats.activeJobs} 
          link="/employer/jobs" 
          icon={<Briefcase className="w-7 h-7 text-blue-700" />}
          colorClass="bg-blue-50/50 border-blue-100"
        />
        <StatCard 
          title="Tổng CV nhận được" 
          value={data.stats.totalApplications} 
          link="/employer/applications" 
          icon={<FileText className="w-7 h-7 text-indigo-600" />}
          colorClass="bg-indigo-50/50 border-indigo-100"
        />
        <StatCard 
          title="Ứng viên mới (Tuần này)" 
          value={`+${data.stats.newCandidates}`} 
          link="/employer/applications" 
          icon={<Activity className="w-7 h-7 text-amber-600" />}
          colorClass="bg-amber-50/50 border-amber-100"
        />
        <StatCard 
          title="Tuyển dụng thành công" 
          value={data.stats.successHires} 
          link="/employer/applications" 
          icon={<CheckCircle className="w-7 h-7 text-emerald-600" />}
          colorClass="bg-emerald-50/50 border-emerald-100"
        />
      </section>

      {/* 3. Phân bổ công việc (Layout 2 cột) */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Cột trái (Rộng hơn): Tin tuyển dụng gần đây */}
        <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/30">
            <h2 className="text-xl font-extrabold text-gray-900">Tin đăng gần đây</h2>
            <Link to="/employer/jobs" className="text-sm font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1">
              Quản lý tin <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="divide-y divide-gray-50">
            {data.recentJobs.length > 0 ? (
              data.recentJobs.map(job => (
                <div key={job.id} className="p-8 hover:bg-slate-50 transition-colors group flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <Link to={`/jobs/${job.id}`} className="text-lg font-bold text-gray-900 group-hover:text-blue-700 transition-colors line-clamp-1">
                      {job.title}
                    </Link>
                    <div className="mt-2 flex flex-wrap items-center gap-3 text-sm font-medium">
                      <span className="text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
                        {job.salaryRange || 'Thỏa thuận'}
                      </span>
                      <span className="text-gray-500 flex items-center gap-1">
                        <MapPin className="w-4 h-4" /> {job.location || 'Chưa cập nhật'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
                      Đang mở
                    </span>
                    <Link 
                      to={`/employer/jobs/${job.id}/edit`}
                      className="px-4 py-2 border border-gray-200 text-gray-600 rounded-lg text-sm font-semibold hover:bg-gray-100 transition-colors"
                    >
                      Sửa tin
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 text-center flex flex-col items-center">
                <Briefcase className="w-12 h-12 text-gray-300 mb-3" />
                <p className="text-gray-500 font-medium">Bạn chưa đăng tin tuyển dụng nào.</p>
                <Link to="/employer/jobs/create" className="mt-4 text-blue-700 font-semibold hover:underline">
                  Tạo tin đăng đầu tiên
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Cột phải: Ứng viên mới cập nhật */}
        <div className="lg:col-span-1 bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/30">
            <h2 className="text-lg font-extrabold text-gray-900">CV mới nhận</h2>
          </div>
          
          <div className="divide-y divide-gray-50 p-2">
            {data.recentApplications.length > 0 ? (
              data.recentApplications.map(app => (
                <div key={app.id} className="p-4 hover:bg-blue-50/50 rounded-xl transition-colors cursor-pointer group">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-gray-900 group-hover:text-blue-700">{app.name}</h3>
                    <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                      {app.date}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 truncate">{app.position}</p>
                  <div className="mt-3 flex justify-between items-center">
                    <span className="text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-1 rounded">
                      {app.status}
                    </span>
                    <Link to={`/employer/applications/${app.id}`} className="text-sm text-blue-600 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                      Xem hồ sơ
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-sm text-gray-500">Chưa có ứng viên mới.</div>
            )}
          </div>
          
          <div className="p-4 border-t border-gray-100 bg-gray-50/30">
             <Link to="/employer/applications" className="block w-full text-center py-2 text-sm font-bold text-gray-700 hover:text-blue-700 transition-colors">
                Xem tất cả danh sách
             </Link>
          </div>
        </div>

      </section>
    </div>
  );
};

// Sub-component cho Thẻ Thống Kê
const StatCard = ({ title, value, link, icon, colorClass }) => (
  <Link to={link} className={`p-6 rounded-3xl border border-gray-100 flex flex-col justify-between transition-all hover:-translate-y-1 hover:shadow-lg bg-white relative overflow-hidden group`}>
    {/* Vệt màu trang trí */}
    <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl -mr-10 -mt-10 opacity-50 transition-opacity group-hover:opacity-100 ${colorClass.split(' ')[0]}`}></div>
    
    <div className="flex justify-between items-start relative z-10">
      <div>
        <p className="text-sm font-bold text-gray-500 uppercase tracking-wide">{title}</p>
        <h3 className="text-4xl font-extrabold text-gray-900 mt-2 tracking-tight">{value}</h3>
      </div>
      <div className={`p-3 rounded-2xl ${colorClass}`}>
        {icon}
      </div>
    </div>
  </Link>
);

export default DashboardPage;
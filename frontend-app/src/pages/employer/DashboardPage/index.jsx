import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase, Users, FileText, CheckCircle, ArrowRight,
  MapPin, Clock, TrendingUp, Eye, Calendar, ChevronRight,
  Plus, Search, AlertCircle, Building2, Inbox
} from 'lucide-react';
import authService from '../../../features/auth/authService';
import employerService from '../../../features/employer/employerService';
import candidateService from '../../../features/candidate/candidateService';

// ─────────────────────────────────────────────
// STATUS BADGE COMPONENTS
// ─────────────────────────────────────────────
const JOB_STATUS_MAP = {
  ACTIVE:   { label: 'Đang mở',   bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  PENDING:  { label: 'Chờ duyệt', bg: 'bg-amber-50 text-amber-700 border-amber-200' },
  CLOSED:   { label: 'Đã đóng',   bg: 'bg-gray-100 text-gray-600 border-gray-200' },
  REJECTED: { label: 'Từ chối',   bg: 'bg-red-50 text-red-600 border-red-200' },
};

const APP_STATUS_MAP = {
  PENDING:              { label: 'Chờ xử lý',  bg: 'bg-amber-50 text-amber-700 border-amber-200',     dot: 'bg-amber-400' },
  REVIEWED:             { label: 'Đã xem',      bg: 'bg-blue-50 text-blue-700 border-blue-200',       dot: 'bg-blue-400' },
  INTERVIEW_SCHEDULED:  { label: 'Phỏng vấn',  bg: 'bg-purple-50 text-purple-700 border-purple-200', dot: 'bg-purple-500' },
  ACCEPTED:             { label: 'Đã tuyển',   bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
  REJECTED:             { label: 'Từ chối',    bg: 'bg-gray-100 text-gray-500 border-gray-200',       dot: 'bg-gray-400' },
};

const JobStatusBadge = ({ status }) => {
  const cfg = JOB_STATUS_MAP[status] ?? JOB_STATUS_MAP.PENDING;
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${cfg.bg}`}>
      {cfg.label}
    </span>
  );
};

const AppStatusBadge = ({ status }) => {
  const cfg = APP_STATUS_MAP[status] ?? APP_STATUS_MAP.PENDING;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-semibold border ${cfg.bg}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
};

// ─────────────────────────────────────────────
// STAT CARD COMPONENT
// ─────────────────────────────────────────────
const StatCard = ({ title, value, subtitle, link, icon, accentClass, isLoading }) => (
  <Link
    to={link}
    className="group relative p-6 rounded-2xl border border-gray-100 bg-white overflow-hidden hover:shadow-lg hover:border-gray-200 transition-all duration-200"
  >
    <div className={`absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity ${accentClass}`} />
    <div className="flex items-start justify-between mb-4">
      {/* FIX: Đổi nền thành màu đặc, bo góc tròn và icon màu trắng */}
      <div className={`p-3 rounded-xl ${accentClass} shadow-sm flex items-center justify-center w-max text-white`}>
        {icon}
      </div>
      <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors mt-1" />
    </div>
    {isLoading ? (
      <div className="h-8 w-16 bg-gray-100 rounded animate-pulse mb-1" />
    ) : (
      <p className="text-3xl font-extrabold text-gray-900 tracking-tight">{value ?? 0}</p>
    )}
    <p className="text-sm font-semibold text-gray-500 mt-1">{title}</p>
    {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
  </Link>
);

// ─────────────────────────────────────────────
// MAIN DASHBOARD PAGE
// ─────────────────────────────────────────────
export default function EmployerDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);
  const [user, setUser]     = useState(null);

  const [stats, setStats]   = useState({
    activeJobs: 0,
    totalApplications: 0,
    pendingApplications: 0,
    acceptedApplications: 0,
  });
  const [recentJobs, setRecentJobs]           = useState([]);
  const [recentApplications, setRecentApplications] = useState([]);

  useEffect(() => {
    const run = async () => {
      const currentUser = authService.getCurrentUser();
      if (!currentUser?.userId) {
        setError('Không tìm thấy phiên đăng nhập.');
        setLoading(false);
        return;
      }
      setUser(currentUser);

      try {
        // 🌟 BƯỚC SỬA ĐỔI CHÍNH: Lấy đúng companyId thực tế từ userId trước
        const profileResult = await employerService.getCompanyProfile(currentUser.userId);
        const companyId = profileResult.data?.id;

        if (!companyId) {
          console.warn("Tài khoản này chưa lập hồ sơ doanh nghiệp!");
          setLoading(false);
          return;
        }

        // Gọi API song song bằng việc truyền COMPANY_ID (Thay vì truyền userId cũ)
        const [jobsRes, appsRes] = await Promise.allSettled([
          employerService.getMyJobs(companyId, 0, 5),
          employerService.getApplicationsByEmployer?.(companyId, 0, 5)
            ?? candidateService.getApplicationsByEmployer?.(companyId, 0, 5),
        ]);

        // Xử lý dữ liệu Tin tuyển dụng từ Backend
        const jobsData = jobsRes.status === 'fulfilled' ? (jobsRes.value?.data ?? jobsRes.value) : null;
        const jobItems   = jobsData?.items ?? jobsData?.content ?? [];
        
        // Thống kê đếm số tin đang hiển thị công khai công ty sở hữu
        const activeJobs = jobItems.filter(j => j.status === 'ACTIVE').length;

        // Xử lý dữ liệu đơn ứng tuyển
        const appsData = appsRes.status === 'fulfilled' ? (appsRes.value?.data ?? appsRes.value) : null;
        const appItems    = appsData?.items ?? appsData?.content ?? [];
        const totalApps   = appsData?.totalElements ?? appItems.length;
        const pendingApps = appItems.filter(a => a.status === 'PENDING').length;
        const acceptedApps= appItems.filter(a => a.status === 'ACCEPTED').length;

        setStats({
          activeJobs,
          totalApplications: totalApps,
          pendingApplications: pendingApps,
          acceptedApplications: acceptedApps,
        });
        setRecentJobs(jobItems.slice(0, 5));
        setRecentApplications(appItems.slice(0, 6));
      } catch (err) {
        console.error('[EmployerDashboard Error]', err);
        setError('Không thể tải dữ liệu tổng quan. Vui lòng thử lại.');
      } finally {
        setLoading(false);
      }
    };

    run();
  }, []);

  const displayName = useMemo(() => {
    if (user?.companyName) return user.companyName;
    if (user?.fullName)    return user.fullName;
    return user?.email?.split('@')[0] ?? 'Nhà tuyển dụng';
  }, [user]);

  const handleReload = useCallback(() => window.location.reload(), []);

  const formatWorkType = (type) => {
    switch (type) {
      case 'FULL_TIME': return 'Toàn thời gian';
      case 'PART_TIME': return 'Bán thời gian';
      case 'INTERNSHIP': return 'Thực tập sinh';
      case 'REMOTE': return 'Làm việc từ xa';
      default: return type;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
        <p className="text-sm text-gray-500 font-medium animate-pulse">Đang tải dữ liệu tổng quan...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-lg mx-auto mt-16 p-6 bg-red-50 border border-red-200 rounded-2xl text-center">
        <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
        <p className="font-semibold text-red-700 mb-4">{error}</p>
        <button onClick={handleReload} className="px-5 py-2 bg-white border border-red-200 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors">
          Tải lại trang
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* HEADER */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-2xl px-8 py-7 shadow-lg shadow-blue-200 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-72 h-72 rounded-full bg-blue-500/30 -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute right-16 bottom-0 w-40 h-40 rounded-full bg-blue-800/20 translate-y-1/2 pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1">
            <Building2 className="w-5 h-5 text-blue-200" />
            <span className="text-blue-200 text-sm font-medium">Bảng điều khiển nhà tuyển dụng</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Chào mừng, <span className="text-yellow-300">{displayName}</span>
          </h1>
          <p className="text-blue-100 text-sm mt-1.5 font-medium">Quản lý tin tuyển dụng và hồ sơ ứng viên của bạn tại đây.</p>
        </div>

        <div className="relative z-10 flex flex-wrap gap-3">
          <Link to="/employer/candidates/search" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-sm font-semibold border border-white/25 transition-all backdrop-blur-sm">
            <Search className="w-4 h-4" /> Tìm ứng viên
          </Link>
          <Link to="/employer/jobs/create" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-blue-700 text-sm font-bold shadow-sm hover:bg-blue-50 transition-all">
            <Plus className="w-4 h-4" /> Đăng tin mới
          </Link>
        </div>
      </header>

      {/* STAT CARDS */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard 
          title="Tin đang hoạt động" subtitle="Tổng số bài viết công khai" value={stats.activeJobs} link="/employer/jobs" 
          accentClass="bg-blue-500" 
          icon={<Briefcase className="w-6 h-6 text-white" />} 
        />
        <StatCard 
          title="Tổng đơn ứng tuyển" subtitle="Bảng hồ sơ ứng viên" value={stats.totalApplications} link="/employer/applications" 
          accentClass="bg-indigo-500" 
          icon={<FileText className="w-6 h-6 text-white" />} 
        />
        <StatCard 
          title="Đơn chờ xử lý" subtitle="Yêu cầu cần duyệt" value={stats.pendingApplications} link="/employer/applications?status=PENDING" 
          accentClass="bg-orange-500" 
          icon={<Inbox className="w-6 h-6 text-white" />} 
        />
        <StatCard 
          title="Tuyển thành công" subtitle="Ứng viên đã tiếp nhận" value={stats.acceptedApplications} link="/employer/applications?status=ACCEPTED" 
          accentClass="bg-emerald-500" 
          icon={<CheckCircle className="w-6 h-6 text-white" />} 
        />
      </section>

      {/* DETAILED TABLES */}
      <section className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
        {/* LEFT COLUMN: TIN TUYỂN DỤNG GẦN ĐÂY */}
        <div className="lg:col-span-3 bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/40">
            <div className="flex items-center gap-2">
              <Briefcase className="w-4.5 h-4.5 text-gray-500" strokeWidth={2} />
              <h2 className="text-sm font-bold text-gray-800">Tin tuyển dụng gần đây</h2>
            </div>
            <Link to="/employer/jobs" className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors">
              Xem tất cả <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="hidden sm:grid grid-cols-12 px-6 py-2.5 bg-gray-50/60 border-b border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-wider">
            <span className="col-span-5">Vị trí</span>
            <span className="col-span-3">Mức lương</span>
            <span className="col-span-2">Địa điểm</span>
            <span className="col-span-2 text-right">Trạng thái</span>
          </div>

          <div className="divide-y divide-gray-50">
            {recentJobs.length === 0 ? (
              <div className="py-14 text-center">
                <Briefcase className="w-9 h-9 text-gray-200 mx-auto mb-3" />
                <p className="text-sm text-gray-400 font-medium">Chưa có tin tuyển dụng nào được tìm thấy.</p>
              </div>
            ) : (
              recentJobs.map(job => (
                <div key={job.id} className="px-6 py-4 hover:bg-gray-50/60 transition-colors grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                  <div className="sm:col-span-5 min-w-0">
                    <Link to={`/employer/jobs/edit/${job.id}`} className="font-semibold text-gray-900 hover:text-blue-600 transition-colors text-sm line-clamp-1">
                      {job.title}
                    </Link>
                    {/* Sửa từ job.work_type sang job.workType giống cấu trúc API */}
                    {job.workType && (
                      <span className="text-xs text-gray-400 mt-0.5 block">{formatWorkType(job.workType)}</span>
                    )}
                    {/* Sửa từ job.expires_at sang job.expiresAt */}
                    {job.expiresAt && (
                      <span className="inline-flex items-center gap-1 text-xs text-gray-400 mt-1">
                        <Calendar className="w-3 h-3" />
                        Hết hạn: {new Date(job.expiresAt).toLocaleDateString('vi-VN')}
                      </span>
                    )}
                  </div>

                  <div className="sm:col-span-3">
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-1 rounded-md">
                      <TrendingUp className="w-3 h-3" />
                      {job.salaryRange || job.salary_range || 'Thỏa thuận'}
                    </span>
                  </div>

                  <div className="sm:col-span-2">
                    <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                      <MapPin className="w-3 h-3 text-gray-400 flex-shrink-0" />
                      <span className="truncate">{job.location || '—'}</span>
                    </span>
                  </div>

                  <div className="sm:col-span-2 sm:text-right">
                    <JobStatusBadge status={job.status} />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: ĐƠN ỨNG TUYỂN MỚI */}
        <div className="lg:col-span-2 bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/40">
            <div className="flex items-center gap-2">
              <Users className="w-4.5 h-4.5 text-gray-500" strokeWidth={2} />
              <h2 className="text-sm font-bold text-gray-800">Đơn ứng tuyển mới</h2>
            </div>
            <Link to="/employer/applications" className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors">
              Tất cả <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-gray-50">
            {recentApplications.length === 0 ? (
              <div className="py-14 text-center">
                <Inbox className="w-9 h-9 text-gray-200 mx-auto mb-3" />
                <p className="text-sm text-gray-400 font-medium">Chưa có đơn ứng tuyển nào.</p>
              </div>
            ) : (
              recentApplications.map(app => (
                <div key={app.id} className="px-5 py-3.5 hover:bg-blue-50/30 transition-colors group">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="text-sm font-bold text-gray-900 group-hover:text-blue-700 transition-colors truncate">
                      {app.fullName || app.full_name || 'Ứng viên'}
                    </p>
                    <span className="flex items-center gap-1 text-xs text-gray-400 whitespace-nowrap flex-shrink-0">
                      <Clock className="w-3 h-3" />
                      {app.appliedAt ? new Date(app.appliedAt).toLocaleDateString('vi-VN') : app.applied_at ? new Date(app.applied_at).toLocaleDateString('vi-VN') : '—'}
                    </span>
                  </div>

                  <p className="text-xs text-gray-500 truncate mb-2">
                    {app.jobTitle || app.job_title || '—'}
                  </p>

                  <div className="flex items-center justify-between">
                    <AppStatusBadge status={app.status} />
                    <Link to={`/employer/applications/${app.id}`} className="text-xs text-blue-500 font-semibold opacity-0 group-hover:opacity-100 transition-opacity inline-flex items-center gap-1">
                      <Eye className="w-3 h-3" /> Xem
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* QUICK ACTIONS */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <QuickAction to="/employer/jobs/create" icon={<Plus className="w-5 h-5" />} title="Đăng tin mới" desc="Tạo bài đăng tuyển dụng" colorClass="text-blue-600 bg-blue-50 group-hover:bg-blue-100" />
        <QuickAction to="/employer/candidates/search" icon={<Search className="w-5 h-5" />} title="Tìm kiếm ứng viên" desc="Duyệt hồ sơ ứng viên" colorClass="text-indigo-600 bg-indigo-50 group-hover:bg-indigo-100" />
        <QuickAction to="/employer/profile" icon={<Building2 className="w-5 h-5" />} title="Hồ sơ công ty" desc="Cập nhật thông tin doanh nghiệp" colorClass="text-emerald-600 bg-emerald-50 group-hover:bg-emerald-100" />
      </section>
    </div>
  );
}

const QuickAction = ({ to, icon, title, desc, colorClass }) => (
  <Link to={to} className="group flex items-center gap-4 p-4 bg-white border border-gray-100 rounded-xl hover:shadow-md hover:border-gray-200 transition-all duration-200">
    <div className={`p-3 rounded-xl transition-colors ${colorClass}`}>{icon}</div>
    <div className="min-w-0">
      <p className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{title}</p>
      <p className="text-xs text-gray-400 truncate">{desc}</p>
    </div>
    <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 ml-auto flex-shrink-0 transition-colors" />
  </Link>
);
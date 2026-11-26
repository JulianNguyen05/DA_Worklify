import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase, Users, FileText, CheckCircle, ArrowRight, MapPin, Clock,
  Calendar, Plus, Search, AlertCircle, Building2, Inbox, ChevronRight,
} from 'lucide-react';
import authService from '../../../features/auth/authService';
import employerService from '../../../features/employer/employerService';
import PageHeader from '../../../components/common/PageHeader';
import StatCard from '../../../components/common/StatCard';
import Card, { CardHeader } from '../../../components/common/Card';
import EmptyState from '../../../components/common/EmptyState';
import Avatar from '../../../components/common/Avatar';
import { PageLoader } from '../../../components/common/Spinner';
import Button, { buttonClasses } from '../../../components/common/Button';
import { JobStatusBadge, AppStatusBadge } from '../../../components/shared/StatusBadges';

const formatWorkType = (type) => {
  switch (type) {
    case 'FULL_TIME': return 'Toàn thời gian';
    case 'PART_TIME': return 'Bán thời gian';
    case 'INTERNSHIP': return 'Thực tập sinh';
    case 'REMOTE': return 'Làm việc từ xa';
    default: return type;
  }
};

export default function EmployerDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  const [stats, setStats] = useState({
    activeJobs: 0,
    totalApplications: 0,
    pendingApplications: 0,
    acceptedApplications: 0,
  });
  const [recentJobs, setRecentJobs] = useState([]);
  const [recentApplications, setRecentApplications] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      const currentUser = authService.getCurrentUser();
      if (!currentUser?.userId) {
        setError('Không tìm thấy phiên đăng nhập.');
        setLoading(false);
        return;
      }
      setUser(currentUser);

      try {
        // 1. Lấy thông tin công ty
        const profileResult = await employerService.getCompanyProfile(currentUser.userId);
        const companyId = profileResult.data?.id;

        if (!companyId) {
          setLoading(false);
          return;
        }

        // 2. Lấy danh sách việc làm của công ty
        const jobsRes = await employerService.getMyJobs(companyId, 0, 50);
        const jobItems = jobsRes.data?.content || jobsRes.data || [];
        const activeJobsCount = jobItems.filter(j => j.status === 'ACTIVE').length;

        // 3. Lấy hồ sơ ứng tuyển bằng cách quét qua danh sách việc làm
        const appPromises = jobItems.map(job => employerService.getApplicationsForJob(job.id, 0, 20));
        const appResponses = await Promise.allSettled(appPromises);

        let allApps = [];
        appResponses.forEach(res => {
          if (res.status === 'fulfilled') {
            const apps = res.value.data?.content || res.value.data || [];
            allApps = [...allApps, ...apps];
          }
        });

        // 4. Sắp xếp hồ sơ mới nhất lên đầu
        allApps.sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt));

        // 5. Tính toán các chỉ số
        setStats({
          activeJobs: activeJobsCount,
          totalApplications: allApps.length,
          pendingApplications: allApps.filter(a => a.status === 'PENDING').length,
          acceptedApplications: allApps.filter(a => a.status === 'ACCEPTED').length,
        });

        setRecentJobs(jobItems.slice(0, 5));
        setRecentApplications(allApps.slice(0, 6));
      } catch (err) {
        console.error('[EmployerDashboard Error]', err);
        setError('Không thể tải dữ liệu tổng quan. Vui lòng thử lại.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const displayName = useMemo(() => {
    if (user?.companyName) return user.companyName;
    if (user?.fullName) return user.fullName;
    return user?.email?.split('@')[0] ?? 'Nhà tuyển dụng';
  }, [user]);

  const handleReload = useCallback(() => window.location.reload(), []);

  if (loading) return <PageLoader label="Đang tổng hợp dữ liệu ứng tuyển..." />;

  if (error) {
    return (
      <Card className="mx-auto mt-10 max-w-lg">
        <EmptyState
          tone="danger"
          icon={AlertCircle}
          title="Không tải được dữ liệu"
          description={error}
          action={<Button variant="outline" onClick={handleReload}>Tải lại trang</Button>}
        />
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Bảng điều khiển"
        title={`Chào mừng, ${displayName}`}
        description="Theo dõi tin tuyển dụng và hồ sơ ứng viên của doanh nghiệp."
        actions={
          <>
            <Link to="/employer/candidates/search" className={buttonClasses({ variant: 'outline' })}>
              <Search className="h-4 w-4" /> Tìm ứng viên
            </Link>
            <Link to="/employer/jobs/create" className={buttonClasses()}>
              <Plus className="h-4 w-4" /> Đăng tin mới
            </Link>
          </>
        }
      />

      <section className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <StatCard label="Tin đang hoạt động" value={stats.activeJobs} hint="Tin đang hiển thị công khai" to="/employer/jobs" icon={Briefcase} tone="brand" />
        <StatCard label="Tổng đơn ứng tuyển" value={stats.totalApplications} hint="Trên tất cả tin đăng" to="/employer/applications" icon={FileText} tone="sky" />
        <StatCard label="Đơn chờ xử lý" value={stats.pendingApplications} hint="Cần được xem xét" to="/employer/applications" icon={Inbox} tone="amber" />
        <StatCard label="Tuyển thành công" value={stats.acceptedApplications} hint="Ứng viên đã tiếp nhận" to="/employer/applications" icon={CheckCircle} tone="emerald" />
      </section>

      <section className="grid grid-cols-1 items-start gap-6 lg:grid-cols-5">
        {/* Tin tuyển dụng gần đây */}
        <Card className="overflow-hidden lg:col-span-3">
          <CardHeader
            title="Tin tuyển dụng gần đây"
            icon={Briefcase}
            action={
              <Link to="/employer/jobs" className="inline-flex items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-700">
                Xem tất cả <ArrowRight className="h-4 w-4" />
              </Link>
            }
          />
          {recentJobs.length === 0 ? (
            <EmptyState
              icon={Briefcase}
              title="Chưa có tin tuyển dụng"
              description="Đăng tin đầu tiên để bắt đầu nhận hồ sơ."
              action={<Link to="/employer/jobs/create" className={buttonClasses({ size: 'sm' })}><Plus className="h-4 w-4" /> Đăng tin</Link>}
            />
          ) : (
            <ul className="divide-y divide-slate-100">
              {recentJobs.map(job => (
                <li key={job.id}>
                  <Link
                    to={`/employer/jobs/edit/${job.id}`}
                    className="flex flex-col gap-2 px-5 py-4 transition-colors hover:bg-slate-50/80 sm:flex-row sm:items-center sm:gap-4"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-1 text-sm font-semibold text-slate-900">{job.title}</p>
                      <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                        {job.workType && <span>{formatWorkType(job.workType)}</span>}
                        <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" />{job.location || '—'}</span>
                        {job.expiresAt && (
                          <span className="inline-flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Hết hạn {new Date(job.expiresAt).toLocaleDateString('vi-VN')}
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-emerald-700 sm:w-32 sm:text-right">
                      {job.salaryRange || job.salary_range || 'Thỏa thuận'}
                    </span>
                    <div className="sm:w-24 sm:text-right">
                      <JobStatusBadge status={job.status} />
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>

        {/* Đơn ứng tuyển mới */}
        <Card className="overflow-hidden lg:col-span-2">
          <CardHeader
            title="Đơn ứng tuyển mới"
            icon={Users}
            action={
              <Link to="/employer/applications" className="inline-flex items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-700">
                Tất cả <ArrowRight className="h-4 w-4" />
              </Link>
            }
          />
          {recentApplications.length === 0 ? (
            <EmptyState icon={Inbox} title="Chưa có đơn ứng tuyển" description="Hồ sơ mới sẽ xuất hiện tại đây." />
          ) : (
            <ul className="divide-y divide-slate-100">
              {recentApplications.map(app => (
                <li key={app.id}>
                  <Link
                    to={`/employer/applications/${app.id}`}
                    className="group flex items-center gap-3 px-5 py-3.5 transition-colors hover:bg-slate-50/80"
                  >
                    <Avatar name={app.candidateName || '?'} size="md" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate text-sm font-semibold text-slate-900 group-hover:text-brand-700">
                          {app.candidateName || `Ứng viên #${app.id}`}
                        </p>
                        <span className="inline-flex shrink-0 items-center gap-1 text-xs text-slate-400">
                          <Clock className="h-3 w-3" />
                          {app.appliedAt ? new Date(app.appliedAt).toLocaleDateString('vi-VN') : '—'}
                        </span>
                      </div>
                      <div className="mt-1 flex items-center justify-between gap-2">
                        <p className="truncate text-xs text-slate-500">{app.jobTitle || '—'}</p>
                        <AppStatusBadge status={app.status} />
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <QuickAction to="/employer/jobs/create" icon={Plus} title="Đăng tin mới" desc="Tạo bài đăng tuyển dụng" />
        <QuickAction to="/employer/candidates/search" icon={Search} title="Tìm kiếm ứng viên" desc="Duyệt hồ sơ ứng viên" />
        <QuickAction to="/employer/profile" icon={Building2} title="Hồ sơ công ty" desc="Cập nhật thông tin doanh nghiệp" />
      </section>
    </div>
  );
}

const QuickAction = ({ to, icon: Icon, title, desc }) => (
  <Link to={to} className="card card-hover group flex items-center gap-4 p-4">
    <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-600 transition-colors group-hover:bg-brand-50 group-hover:text-brand-600">
      <Icon className="h-5 w-5" />
    </span>
    <div className="min-w-0">
      <p className="text-sm font-semibold text-slate-900">{title}</p>
      <p className="truncate text-xs text-slate-500">{desc}</p>
    </div>
    <ChevronRight className="ml-auto h-4 w-4 shrink-0 text-slate-300 group-hover:text-slate-500" />
  </Link>
);

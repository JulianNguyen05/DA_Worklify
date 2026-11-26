import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import candidateService from '../../../features/candidate/candidateService';
import authService from '../../../features/auth/authService';
import Pagination from '../../../components/common/Pagination';
import PageHeader from '../../../components/common/PageHeader';
import Card from '../../../components/common/Card';
import Avatar from '../../../components/common/Avatar';
import EmptyState from '../../../components/common/EmptyState';
import Tabs from '../../../components/common/Tabs';
import Button, { buttonClasses } from '../../../components/common/Button';
import { Skeleton } from '../../../components/common/Spinner';
import { AppStatusBadge } from '../../../components/shared/StatusBadges';
import {
  Briefcase, Building2, Calendar, FileText, Search, Clock, CheckCircle2,
  XCircle, Eye, Users, ArrowUpRight, Inbox, AlertCircle,
} from 'lucide-react';

// ─── Constants ────────────────────────────────────────────────────────────────

const STATUS_CONFIG = {
  PENDING: { label: 'Chờ phản hồi', icon: Clock, tone: 'text-amber-600 bg-amber-50' },
  REVIEWED: { label: 'Đã xem', icon: Eye, tone: 'text-sky-600 bg-sky-50' },
  INTERVIEW_SCHEDULED: { label: 'Phỏng vấn', icon: Users, tone: 'text-violet-600 bg-violet-50' },
  ACCEPTED: { label: 'Trúng tuyển', icon: CheckCircle2, tone: 'text-emerald-600 bg-emerald-50' },
  REJECTED: { label: 'Từ chối', icon: XCircle, tone: 'text-rose-600 bg-rose-50' },
};

// ─── Sub-components ────────────────────────────────────────────────────────────

const StatsBar = ({ applications }) => {
  const counts = Object.keys(STATUS_CONFIG).reduce((acc, key) => {
    acc[key] = applications.filter(a => a.status === key).length;
    return acc;
  }, {});

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {Object.entries(STATUS_CONFIG).map(([key, cfg]) => {
        const Icon = cfg.icon;
        return (
          <div key={key} className="card flex items-center gap-3 p-4">
            <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${cfg.tone}`}>
              <Icon className="h-[18px] w-[18px]" />
            </span>
            <div className="min-w-0">
              <p className="font-display text-xl font-bold leading-none text-slate-900 tabular-nums">{counts[key] || 0}</p>
              <p className="mt-1 truncate text-xs text-slate-500">{cfg.label}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const ApplicationCard = ({ app }) => {
  const formattedDate = app.appliedAt
    ? new Date(app.appliedAt).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
    : '—';

  return (
    <Link to={`/jobs/${app.jobId}`} className="card card-hover group flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:gap-4 sm:p-5">
      <div className="flex min-w-0 flex-1 items-start gap-4 sm:items-center">
        <Avatar src={app.companyLogo} name={app.companyName} size="lg" square className="rounded-xl" />
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-[15px] font-semibold text-slate-900 group-hover:text-brand-700">
            {app.jobTitle || 'Vị trí không xác định'}
          </h3>
          <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[13px] text-slate-500">
            <span className="inline-flex items-center gap-1.5 font-medium text-slate-700">
              <Building2 className="h-3.5 w-3.5 text-slate-400" />
              {app.companyName || 'Công ty'}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-slate-400" />
              {formattedDate}
            </span>
            {app.cvFileName && (
              <span className="inline-flex max-w-[220px] items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                <FileText className="h-3 w-3 shrink-0" />
                <span className="truncate">{app.cvFileName}</span>
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex shrink-0 items-center justify-between gap-3 border-t border-slate-100 pt-3 sm:border-0 sm:pt-0">
        <AppStatusBadge status={app.status} label={STATUS_CONFIG[app.status]?.label} />
        <ArrowUpRight className="h-4 w-4 text-slate-300 transition-colors group-hover:text-brand-600" />
      </div>
    </Link>
  );
};

// ─── Main Page ─────────────────────────────────────────────────────────────────

const MyApplicationsPage = () => {
  const user = authService.getCurrentUser();
  const userId = user?.id || user?.userId;

  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0); // 0-based, khớp với backend
  const [totalPages, setTotalPages] = useState(0);
  const PAGE_SIZE = 8;

  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [filteredData, setFilteredData] = useState([]);

  const fetchApplications = useCallback(async () => {
    if (!userId) { setIsLoading(false); return; }
    setIsLoading(true);
    setError(null);
    try {
      const res = await candidateService.getMyApplications(userId, currentPage, PAGE_SIZE);
      const data = res.data?.content || [];
      setApplications(data);
      setTotalPages(res.data?.totalPages || 0);
    } catch (err) {
      setError('Không thể tải dữ liệu. Vui lòng thử lại.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [userId, currentPage]);

  useEffect(() => { fetchApplications(); }, [fetchApplications]);

  useEffect(() => {
    let result = applications;
    if (statusFilter !== 'ALL') result = result.filter(a => a.status === statusFilter);
    if (searchText.trim()) {
      const term = searchText.toLowerCase();
      result = result.filter(a =>
        a.jobTitle?.toLowerCase().includes(term) ||
        a.companyName?.toLowerCase().includes(term)
      );
    }
    setFilteredData(result);
  }, [searchText, statusFilter, applications]);

  if (!userId && !isLoading) {
    return (
      <div className="page-container py-10">
        <Card>
          <EmptyState
            icon={Briefcase}
            title="Bạn chưa đăng nhập"
            description="Vui lòng đăng nhập để theo dõi hành trình ứng tuyển."
            action={<Link to="/auth/login" className={buttonClasses()}>Đăng nhập</Link>}
          />
        </Card>
      </div>
    );
  }

  const isFiltered = statusFilter !== 'ALL' || searchText.trim() !== '';
  const tabItems = [
    { value: 'ALL', label: 'Tất cả' },
    ...Object.entries(STATUS_CONFIG).map(([key, val]) => ({ value: key, label: val.label })),
  ];

  return (
    <div className="page-container py-8">
    <div className="mx-auto max-w-5xl space-y-5">
      <PageHeader
        eyebrow="Ứng tuyển"
        title="Lịch sử ứng tuyển"
        description="Theo dõi tiến trình và trạng thái các đơn ứng tuyển của bạn."
        actions={!isLoading && <span className="text-sm text-slate-500">{filteredData.length} kết quả</span>}
      />

      {!isLoading && applications.length > 0 && <StatsBar applications={applications} />}

      <Card className="flex flex-col gap-3 p-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="overflow-x-auto">
          <Tabs variant="pills" items={tabItems} value={statusFilter} onChange={setStatusFilter} className="flex-nowrap" />
        </div>
        <div className="relative lg:w-64">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm công ty, vị trí..."
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            className="field-input h-9 pl-9"
          />
        </div>
      </Card>

      {error && (
        <div className="flex items-center justify-between gap-3 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          <span className="flex items-center gap-2"><AlertCircle className="h-4 w-4" /> {error}</span>
          <Button size="xs" variant="danger-outline" onClick={fetchApplications}>Thử lại</Button>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {isLoading
          ? [1, 2, 3, 4].map(i => (
              <div key={i} className="card flex items-center gap-4 p-5">
                <Skeleton className="h-12 w-12 rounded-xl" />
                <div className="flex-1 space-y-2"><Skeleton className="h-4 w-2/5" /><Skeleton className="h-3 w-1/4" /></div>
                <Skeleton className="h-6 w-24 rounded-full" />
              </div>
            ))
          : filteredData.length > 0
            ? filteredData.map(app => <ApplicationCard key={app.id} app={app} />)
            : (
              <div className="card border-dashed">
                <EmptyState
                  icon={Inbox}
                  title={isFiltered ? 'Không tìm thấy kết quả' : 'Chưa có đơn ứng tuyển'}
                  description={isFiltered
                    ? 'Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm để xem thêm kết quả.'
                    : 'Hãy khám phá các cơ hội việc làm và nộp đơn ứng tuyển ngay hôm nay!'}
                  action={!isFiltered && <Link to="/jobs" className={buttonClasses()}>Tìm việc làm</Link>}
                />
              </div>
            )}
      </div>

      {!isLoading && totalPages > 1 && (
        // Pagination dùng trang bắt đầu từ 1, state ở đây bắt đầu từ 0
        <Pagination
          currentPage={currentPage + 1}
          totalPages={totalPages}
          onPageChange={(p) => setCurrentPage(p - 1)}
        />
      )}
    </div>
    </div>
  );
};

export default MyApplicationsPage;

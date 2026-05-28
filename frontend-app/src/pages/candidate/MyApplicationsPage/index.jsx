import React, { useState, useEffect, useCallback } from 'react';
import candidateService from '../../../features/candidate/candidateService';
import authService from '../../../features/auth/authService';
import Pagination from '../../../components/common/Pagination';
import {
  Briefcase, Building2, Calendar, FileText,
  ChevronRight, Search, Clock, CheckCircle2,
  XCircle, Eye, Users, Filter, SlidersHorizontal,
  ArrowUpRight, Inbox
} from 'lucide-react';

// ─── Constants ────────────────────────────────────────────────────────────────

const STATUS_CONFIG = {
  PENDING: {
    label: 'Chờ phản hồi',
    color: 'amber',
    icon: Clock,
    bg: '#FEF3C7',
    text: '#92400E',
    dot: '#F59E0B',
  },
  REVIEWED: {
    label: 'Đã xem',
    color: 'blue',
    icon: Eye,
    bg: '#DBEAFE',
    text: '#1E40AF',
    dot: '#3B82F6',
  },
  INTERVIEW_SCHEDULED: {
    label: 'Phỏng vấn',
    color: 'purple',
    icon: Users,
    bg: '#EDE9FE',
    text: '#5B21B6',
    dot: '#7C3AED',
  },
  ACCEPTED: {
    label: 'Trúng tuyển',
    color: 'green',
    icon: CheckCircle2,
    bg: '#D1FAE5',
    text: '#065F46',
    dot: '#10B981',
  },
  REJECTED: {
    label: 'Từ chối',
    color: 'red',
    icon: XCircle,
    bg: '#FEE2E2',
    text: '#991B1B',
    dot: '#EF4444',
  },
};

const STATUS_TABS = [
  { key: 'ALL', label: 'Tất cả' },
  ...Object.entries(STATUS_CONFIG).map(([key, val]) => ({ key, label: val.label })),
];

// ─── Sub-components ────────────────────────────────────────────────────────────

const StatusBadge = ({ status }) => {
  const cfg = STATUS_CONFIG[status];
  if (!cfg) return null;
  const Icon = cfg.icon;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600,
      background: cfg.bg, color: cfg.text, whiteSpace: 'nowrap',
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: cfg.dot, flexShrink: 0 }} />
      {cfg.label}
    </span>
  );
};

const CompanyAvatar = ({ logo, name, size = 52 }) => {
  const [imgError, setImgError] = useState(false);
  const initials = name ? name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase() : '?';

  if (logo && !imgError) {
    return (
      <div style={{
        width: size, height: size, borderRadius: 12, overflow: 'hidden',
        border: '1px solid #E5E7EB', flexShrink: 0, background: '#F9FAFB',
      }}>
        <img
          src={logo} alt={name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={() => setImgError(true)}
        />
      </div>
    );
  }

  const colors = ['#EDE9FE', '#DBEAFE', '#D1FAE5', '#FEF3C7', '#FCE7F3'];
  const textColors = ['#5B21B6', '#1E40AF', '#065F46', '#92400E', '#9D174D'];
  const idx = name ? name.charCodeAt(0) % colors.length : 0;

  return (
    <div style={{
      width: size, height: size, borderRadius: 12, flexShrink: 0,
      background: colors[idx], color: textColors[idx],
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 15, fontWeight: 700, letterSpacing: 1,
      border: `1px solid ${colors[idx]}`,
    }}>
      {initials}
    </div>
  );
};

const SkeletonCard = () => (
  <div style={{
    background: '#fff', borderRadius: 16, border: '1px solid #F3F4F6',
    padding: '20px 24px', display: 'flex', gap: 16, alignItems: 'center',
  }}>
    <div style={{ width: 52, height: 52, borderRadius: 12, background: '#F3F4F6', flexShrink: 0 }} />
    <div style={{ flex: 1 }}>
      <div style={{ height: 16, borderRadius: 8, background: '#F3F4F6', width: '40%', marginBottom: 10 }} />
      <div style={{ height: 13, borderRadius: 8, background: '#F3F4F6', width: '25%' }} />
    </div>
    <div style={{ height: 26, borderRadius: 20, background: '#F3F4F6', width: 90 }} />
  </div>
);

const EmptyState = ({ isFiltered }) => (
  <div style={{
    background: '#fff', borderRadius: 16, border: '1px dashed #E5E7EB',
    padding: '64px 24px', display: 'flex', flexDirection: 'column',
    alignItems: 'center', gap: 12, textAlign: 'center',
  }}>
    <div style={{
      width: 64, height: 64, borderRadius: 16, background: '#F9FAFB',
      border: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <Inbox size={28} color="#9CA3AF" />
    </div>
    <p style={{ margin: 0, fontWeight: 600, fontSize: 15, color: '#111827' }}>
      {isFiltered ? 'Không tìm thấy kết quả' : 'Chưa có đơn ứng tuyển'}
    </p>
    <p style={{ margin: 0, fontSize: 13, color: '#6B7280', maxWidth: 320, lineHeight: 1.6 }}>
      {isFiltered
        ? 'Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm để xem thêm kết quả.'
        : 'Hãy khám phá các cơ hội việc làm và nộp đơn ứng tuyển ngay hôm nay!'}
    </p>
  </div>
);

const StatsBar = ({ applications }) => {
  const counts = Object.keys(STATUS_CONFIG).reduce((acc, key) => {
    acc[key] = applications.filter(a => a.status === key).length;
    return acc;
  }, {});

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10 }}>
      {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
        <div key={key} style={{
          background: '#fff', borderRadius: 12, border: '1px solid #F3F4F6',
          padding: '12px 14px',
        }}>
          <p style={{ margin: '0 0 4px', fontSize: 11, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
            {cfg.label}
          </p>
          <p style={{ margin: 0, fontSize: 22, fontWeight: 700, color: cfg.text }}>
            {counts[key] || 0}
          </p>
        </div>
      ))}
    </div>
  );
};

// ─── ApplicationCard ───────────────────────────────────────────────────────────

const ApplicationCard = ({ app }) => {
  const [hovered, setHovered] = useState(false);

  const formattedDate = app.appliedAt
    ? new Date(app.appliedAt).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
    : '—';

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: '#fff',
        borderRadius: 16,
        border: `1px solid ${hovered ? '#D1D5DB' : '#F3F4F6'}`,
        padding: '18px 24px',
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        transition: 'border-color 0.15s, box-shadow 0.15s',
        boxShadow: hovered ? '0 4px 16px rgba(0,0,0,0.06)' : 'none',
        cursor: 'default',
      }}
    >
      <CompanyAvatar logo={app.companyLogo} name={app.companyName} />

      <div style={{ flex: 1, minWidth: 0 }}>
        <h3 style={{
          margin: '0 0 6px', fontSize: 15, fontWeight: 700, color: '#111827',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>
          {app.jobTitle || 'Vị trí không xác định'}
        </h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 16px', alignItems: 'center' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, color: '#374151', fontWeight: 500 }}>
            <Building2 size={13} color="#9CA3AF" />
            {app.companyName || 'Công ty'}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, color: '#6B7280' }}>
            <Calendar size={13} color="#9CA3AF" />
            {formattedDate}
          </span>
          {app.cvFileName && (
            <span style={{
              display: 'flex', alignItems: 'center', gap: 4, fontSize: 12,
              color: '#3B82F6', background: '#EFF6FF', padding: '2px 8px',
              borderRadius: 6, fontWeight: 500,
            }}>
              <FileText size={11} />
              {app.cvFileName}
            </span>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
        <StatusBadge status={app.status} />
        <button
          onClick={() => window.location.href = `/jobs/${app.jobId}`}
          style={{
            display: 'flex', alignItems: 'center', gap: 4,
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: 13, fontWeight: 500,
            color: hovered ? '#2563EB' : '#9CA3AF',
            transition: 'color 0.15s', padding: '4px 0',
          }}
          title="Xem chi tiết công việc"
        >
          <ArrowUpRight size={15} />
        </button>
      </div>
    </div>
  );
};

// ─── Main Page ─────────────────────────────────────────────────────────────────

const MyApplicationsPage = () => {
  const user = authService.getCurrentUser();
  const userId = user?.id || user?.userId;

  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const PAGE_SIZE = 8;

  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [filteredData, setFilteredData] = useState([]);

  // ── Fetch ──
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

  // ── Filter ──
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

  // ── Guard ──
  if (!userId && !isLoading) {
    return (
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', background: '#fff', borderRadius: 20,
        border: '1px solid #F3F4F6', minHeight: 360, gap: 12, padding: 32,
      }}>
        <Briefcase size={40} color="#D1D5DB" />
        <p style={{ margin: 0, fontWeight: 600, fontSize: 16, color: '#111827' }}>Bạn chưa đăng nhập</p>
        <p style={{ margin: 0, fontSize: 14, color: '#6B7280' }}>Vui lòng đăng nhập để theo dõi hành trình ứng tuyển.</p>
      </div>
    );
  }

  const isFiltered = statusFilter !== 'ALL' || searchText.trim() !== '';

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* ── Header ── */}
      <div>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 4 }}>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#111827' }}>
            Lịch sử ứng tuyển
          </h1>
          {!isLoading && (
            <span style={{ fontSize: 13, color: '#6B7280' }}>
              {filteredData.length} kết quả
            </span>
          )}
        </div>
        <p style={{ margin: 0, fontSize: 14, color: '#6B7280' }}>
          Theo dõi tiến trình và trạng thái các đơn ứng tuyển của bạn
        </p>
      </div>

      {/* ── Stats Bar ── */}
      {!isLoading && applications.length > 0 && <StatsBar applications={applications} />}

      {/* ── Filters ── */}
      <div style={{
        background: '#fff', borderRadius: 16, border: '1px solid #F3F4F6',
        padding: '16px 20px', display: 'flex', flexWrap: 'wrap',
        gap: 12, alignItems: 'center', justifyContent: 'space-between',
      }}>
        {/* Status Tabs */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {STATUS_TABS.map(tab => {
            const active = statusFilter === tab.key;
            const cfg = STATUS_CONFIG[tab.key];
            return (
              <button
                key={tab.key}
                onClick={() => setStatusFilter(tab.key)}
                style={{
                  padding: '6px 14px', borderRadius: 8, fontSize: 13,
                  fontWeight: active ? 600 : 500, cursor: 'pointer', transition: 'all 0.15s',
                  border: active ? `1.5px solid ${cfg?.dot || '#2563EB'}` : '1.5px solid transparent',
                  background: active ? (cfg?.bg || '#EFF6FF') : '#F9FAFB',
                  color: active ? (cfg?.text || '#1D4ED8') : '#4B5563',
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div style={{ position: 'relative', width: 260 }}>
          <Search size={14} color="#9CA3AF" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Tìm công ty, vị trí..."
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            style={{
              width: '100%', boxSizing: 'border-box',
              paddingLeft: 34, paddingRight: 12, paddingTop: 8, paddingBottom: 8,
              border: '1.5px solid #E5E7EB', borderRadius: 10, fontSize: 13,
              outline: 'none', color: '#111827', background: '#F9FAFB',
              transition: 'border-color 0.15s',
            }}
            onFocus={e => e.target.style.borderColor = '#3B82F6'}
            onBlur={e => e.target.style.borderColor = '#E5E7EB'}
          />
        </div>
      </div>

      {/* ── Error ── */}
      {error && (
        <div style={{
          background: '#FEF2F2', border: '1px solid #FECACA',
          borderRadius: 12, padding: '12px 16px', color: '#B91C1C', fontSize: 14,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <span>{error}</span>
          <button
            onClick={fetchApplications}
            style={{
              background: '#FEE2E2', border: 'none', cursor: 'pointer',
              color: '#B91C1C', fontSize: 12, fontWeight: 600,
              padding: '4px 10px', borderRadius: 6,
            }}
          >
            Thử lại
          </button>
        </div>
      )}

      {/* ── List ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {isLoading
          ? [1, 2, 3, 4].map(i => <SkeletonCard key={i} />)
          : filteredData.length > 0
            ? filteredData.map(app => <ApplicationCard key={app.id} app={app} />)
            : <EmptyState isFiltered={isFiltered} />
        }
      </div>

      {/* ── Pagination ── */}
      {!isLoading && totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 8 }}>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
};

export default MyApplicationsPage;

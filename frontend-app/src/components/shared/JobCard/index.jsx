import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Wallet, Clock, ChevronRight } from 'lucide-react';
import Avatar from '../../common/Avatar';

const WORK_TYPE_LABEL = {
  FULL_TIME: 'Toàn thời gian',
  PART_TIME: 'Bán thời gian',
  INTERNSHIP: 'Thực tập',
  REMOTE: 'Từ xa',
};

export default function JobCard({ job }) {
  // Đồng bộ key JSON (camelCase / snake_case)
  const actualCompanyName = job.companyName || job.company_name;
  const actualCompanyId = job.companyId || job.company_id;
  const actualLogoUrl = job.logoUrl || job.logo_url;
  const actualSalaryRange = job.salaryRange || job.salary_range;
  const actualCreatedAt = job.createdAt || job.created_at;

  const displayName = actualCompanyName || `Công ty ID: ${actualCompanyId}`;

  let displayLogo = null;
  if (actualLogoUrl) {
    displayLogo = actualLogoUrl.startsWith('http')
      ? actualLogoUrl
      : `http://localhost:8080${actualLogoUrl.startsWith('/') ? '' : '/'}${actualLogoUrl}`;
  }

  return (
    <Link
      to={`/jobs/${job.id}`}
      className="card card-hover group flex items-start gap-4 p-4 sm:items-center sm:p-5"
    >
      <Avatar src={displayLogo} name={displayName} size="lg" square className="rounded-xl" />

      <div className="min-w-0 flex-1">
        <h3 className="line-clamp-1 text-base font-semibold text-slate-900 transition-colors group-hover:text-brand-700">
          {job.title}
        </h3>
        <p className="mt-0.5 truncate text-sm text-slate-500">{displayName}</p>

        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px] text-slate-500">
          <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-700">
            <Wallet className="h-3.5 w-3.5" />
            {actualSalaryRange || 'Thỏa thuận'}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-slate-400" />
            {job.location || 'Chưa cập nhật'}
          </span>
          {job.workType && WORK_TYPE_LABEL[job.workType] && (
            <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
              {WORK_TYPE_LABEL[job.workType]}
            </span>
          )}
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-slate-400" />
            {actualCreatedAt ? new Date(actualCreatedAt).toLocaleDateString('vi-VN') : 'Mới nhất'}
          </span>
        </div>
      </div>

      <ChevronRight className="hidden h-5 w-5 shrink-0 text-slate-300 transition-colors group-hover:text-brand-600 sm:block" />
    </Link>
  );
}

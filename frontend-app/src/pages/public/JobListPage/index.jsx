import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, MapPin, SearchX, Wallet } from 'lucide-react';
import jobService from '../../../features/job/jobService';
import Button from '../../../components/common/Button';
import Select from '../../../components/common/Select';
import { Skeleton } from '../../../components/common/Spinner';
import EmptyState from '../../../components/common/EmptyState';
import JobCard from '../../../components/shared/JobCard';
import Pagination from '../../../components/common/Pagination';

const WORK_TYPE_OPTIONS = [
  { value: '', label: 'Mọi hình thức' },
  { value: 'FULL_TIME', label: 'Toàn thời gian' },
  { value: 'PART_TIME', label: 'Bán thời gian' },
  { value: 'INTERNSHIP', label: 'Thực tập' },
  { value: 'REMOTE', label: 'Làm từ xa' },
];

// Khoảng lương (triệu VNĐ/tháng) → salaryMin/salaryMax gửi backend
const SALARY_OPTIONS = [
  { value: '', label: 'Mọi mức lương' },
  { value: '0-10', label: 'Dưới 10 triệu' },
  { value: '10-15', label: '10 - 15 triệu' },
  { value: '15-25', label: '15 - 25 triệu' },
  { value: '25-35', label: '25 - 35 triệu' },
  { value: '35-', label: 'Trên 35 triệu' },
];

const salaryToParams = (range) => {
  if (!range) return {};
  const [min, max] = range.split('-');
  return { salaryMin: min || undefined, salaryMax: max || undefined };
};

const FILTER_KEYS = ['keyword', 'location', 'workType', 'salary'];

export default function JobListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const current = Object.fromEntries(FILTER_KEYS.map((k) => [k, searchParams.get(k) || '']));
  const pageParam = parseInt(searchParams.get('page')) || 1;

  const [filterForm, setFilterForm] = useState({ keyword: current.keyword, location: current.location });
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pageData, setPageData] = useState({ totalElements: 0, totalPages: 0, currentPage: 1 });

  // Cập nhật URL (nguồn sự thật của bộ lọc); đổi bộ lọc thì về trang 1
  const updateParams = (patch, page = 1) => {
    const next = { ...current, ...patch };
    const params = {};
    FILTER_KEYS.forEach((k) => { if (next[k]) params[k] = next[k]; });
    params.page = String(page);
    setSearchParams(params);
  };

  useEffect(() => {
    setFilterForm({ keyword: current.keyword, location: current.location });
    const fetchJobs = async () => {
      setIsLoading(true);
      try {
        const res = await jobService.searchJobs(
          {
            keyword: current.keyword,
            location: current.location,
            workType: current.workType,
            ...salaryToParams(current.salary),
          },
          pageParam - 1, // backend đếm trang từ 0
          10,
        );
        const data = res?.data || {};
        setJobs(data.content || []);
        setPageData({
          totalElements: data.totalElements || 0,
          totalPages: data.totalPages || 0,
          currentPage: pageParam,
        });
      } catch (error) {
        console.error('Lỗi lấy danh sách việc làm:', error);
        setJobs([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    updateParams({ keyword: filterForm.keyword.trim(), location: filterForm.location.trim() });
  };

  const handlePageChange = (newPage) => updateParams({}, newPage);

  const hasFilter = FILTER_KEYS.some((k) => current[k]);

  return (
    <div>
      {/* ================= THANH TÌM KIẾM ================= */}
      <section className="border-b border-slate-200 bg-white">
        <div className="page-container py-8 sm:py-10">
          <p className="eyebrow">Việc làm</p>
          <h1 className="mt-1 font-display text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Tìm công việc phù hợp với bạn
          </h1>
          <p className="mt-1.5 text-sm text-slate-500">
            Khám phá cơ hội việc làm từ các doanh nghiệp đã được xác minh.
          </p>

          <form
            onSubmit={handleFilterSubmit}
            className="card mt-6 flex flex-col gap-2 p-2 md:flex-row md:items-center"
          >
            <label className="flex flex-1 items-center gap-2.5 rounded-lg px-3 py-2 focus-within:bg-slate-50">
              <Search className="h-[18px] w-[18px] shrink-0 text-slate-400" />
              <input
                type="text"
                className="w-full bg-transparent text-[15px] text-slate-900 placeholder-slate-400 focus:outline-none"
                placeholder="Tên công việc, kỹ năng, công ty..."
                value={filterForm.keyword}
                onChange={(e) => setFilterForm({ ...filterForm, keyword: e.target.value })}
              />
            </label>
            <div className="hidden h-6 w-px bg-slate-200 md:block" />
            <label className="flex flex-1 items-center gap-2.5 rounded-lg px-3 py-2 focus-within:bg-slate-50">
              <MapPin className="h-[18px] w-[18px] shrink-0 text-slate-400" />
              <input
                type="text"
                className="w-full bg-transparent text-[15px] text-slate-900 placeholder-slate-400 focus:outline-none"
                placeholder="Tỉnh/Thành phố..."
                value={filterForm.location}
                onChange={(e) => setFilterForm({ ...filterForm, location: e.target.value })}
              />
            </label>
            <Button type="submit" size="lg" className="w-full md:w-auto">
              <Search className="h-4 w-4" /> Tìm việc
            </Button>
          </form>
        </div>
      </section>

      {/* ================= DANH SÁCH ================= */}
      <div className="page-container py-8">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-600">
            {isLoading ? 'Đang tìm kiếm...' : (
              <>Tìm thấy <b className="font-semibold text-slate-900">{pageData.totalElements}</b> việc làm phù hợp</>
            )}
          </p>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <Select
              aria-label="Hình thức làm việc"
              name="workType"
              options={WORK_TYPE_OPTIONS}
              value={current.workType}
              onChange={(e) => updateParams({ workType: e.target.value })}
              wrapperClassName="sm:w-44"
            />
            <div className="flex items-center gap-2 sm:w-48">
              <Wallet className="hidden h-4 w-4 shrink-0 text-slate-400 sm:block" />
              <Select
                aria-label="Mức lương"
                name="salary"
                options={SALARY_OPTIONS}
                value={current.salary}
                onChange={(e) => updateParams({ salary: e.target.value })}
              />
            </div>
            {hasFilter && (
              <Button variant="ghost" size="sm" onClick={() => setSearchParams({})}>
                Xóa lọc
              </Button>
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col gap-3">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="card flex items-center gap-4 p-5">
                <Skeleton className="h-12 w-12 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-3 w-1/3" />
                  <Skeleton className="h-3 w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <div className="card border-dashed">
            <EmptyState
              icon={SearchX}
              title="Chưa tìm thấy công việc phù hợp"
              description="Thử thay đổi từ khóa, xóa bớt bộ lọc hoặc kiểm tra lỗi chính tả để xem thêm cơ hội khác."
              action={
                <Button
                  variant="outline"
                  onClick={() => setSearchParams({})}
                >
                  Xóa tất cả bộ lọc
                </Button>
              }
            />
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {jobs.map(job => <JobCard key={job.id} job={job} />)}
          </div>
        )}

        {!isLoading && pageData.totalPages > 1 && (
          <Pagination
            currentPage={pageData.currentPage}
            totalPages={pageData.totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
}

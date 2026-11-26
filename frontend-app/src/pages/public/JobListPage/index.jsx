import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, MapPin, SearchX } from 'lucide-react';
import jobService from '../../../features/job/jobService';
import Button from '../../../components/common/Button';
import Tabs from '../../../components/common/Tabs';
import { Skeleton } from '../../../components/common/Spinner';
import EmptyState from '../../../components/common/EmptyState';
import JobCard from '../../../components/shared/JobCard';
import Pagination from '../../../components/common/Pagination'; 

export default function JobListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const keywordParam = searchParams.get('keyword') || '';
  const locationParam = searchParams.get('location') || '';
  const pageParam = parseInt(searchParams.get('page')) || 1;

  // States
  const [filterForm, setFilterForm] = useState({ 
    keyword: keywordParam, 
    location: locationParam 
  });
  const [activeWorkType, setActiveWorkType] = useState('ALL');
  
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pageData, setPageData] = useState({
    totalElements: 0,
    totalPages: 0,
    currentPage: 1
  });

  const fetchJobs = async (kw, loc, page) => {
    setIsLoading(true);
    try {
      // Backend Spring Boot đếm từ 0, nên page - 1 là chính xác
      const res = await jobService.searchJobs(kw, loc, page - 1, 10);
      
      if (res && res.data) {
        const content = res.data.content || res.data.items || [];
        
        // Lọc Frontend
        const filteredContent = activeWorkType === 'ALL' 
          ? content 
          : content.filter(job => job.workType === activeWorkType);

        setJobs(filteredContent);
        setPageData({
          totalElements: res.data.totalElements || 0,
          totalPages: res.data.totalPages || 0,
          currentPage: page // Truyền chuẩn page (1-based index) vào State
        });
      }
    } catch (error) {
      console.error("Lỗi lấy danh sách việc làm:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs(keywordParam, locationParam, pageParam, activeWorkType);
  }, [keywordParam, locationParam, pageParam, activeWorkType]);

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    const params = {};
    if (filterForm.keyword) params.keyword = filterForm.keyword;
    if (filterForm.location) params.location = filterForm.location;
    params.page = "1"; // Reset về trang 1
    setSearchParams(params);
  };

  const handlePageChange = (newPage) => {
    const params = {};
    if (keywordParam) params.keyword = keywordParam;
    if (locationParam) params.location = locationParam;
    params.page = newPage.toString();
    setSearchParams(params);
  };

  const WORK_TYPE_TABS = [
    { value: 'ALL', label: 'Tất cả' },
    { value: 'FULL_TIME', label: 'Toàn thời gian' },
    { value: 'PART_TIME', label: 'Bán thời gian' },
  ];

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
          <Tabs
            variant="pills"
            items={WORK_TYPE_TABS}
            value={activeWorkType}
            onChange={(type) => {
              setActiveWorkType(type);
              handlePageChange(1); // Tự động đưa về trang 1
            }}
          />
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
                  onClick={() => {
                    setFilterForm({ keyword: '', location: '' });
                    setActiveWorkType('ALL');
                    setSearchParams({});
                  }}
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

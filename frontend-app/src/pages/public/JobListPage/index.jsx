import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, MapPin, Briefcase, Filter, Loader2, Frown } from 'lucide-react';
import jobService from '../../../features/job/jobService';
import Button from '../../../components/common/Button';
import Input from '../../../components/common/Input';
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

  return (
    <div className="bg-slate-50 min-h-screen font-sans">
      
      {/* ================= HERO BANNER ================= */}
      <div className="bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 py-16 lg:py-24 px-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10 pointer-events-none">
          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-white blur-3xl"></div>
          <div className="absolute bottom-0 right-10 w-80 h-80 rounded-full bg-blue-300 blur-3xl"></div>
        </div>

        <div className="max-w-6xl mx-auto relative z-10 text-center space-y-6">
          <h1 className="text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Tìm Kiếm Công Việc Ước Mơ Của Bạn
          </h1>
          <p className="text-lg text-blue-100 max-w-2xl mx-auto font-light">
            Khám phá hàng ngàn cơ hội việc làm từ các công ty hàng đầu. Kết nối đam mê với sự nghiệp ngay hôm nay.
          </p>

          {/* MAIN SEARCH FORM */}
          <form 
            onSubmit={handleFilterSubmit} 
            className="mt-10 bg-white p-2 rounded-2xl shadow-2xl max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-2"
          >
            <div className="flex-1 flex items-center w-full px-4 py-2 border-b md:border-b-0 md:border-r border-gray-100">
              <Search className="text-gray-400 w-5 h-5 mr-3 shrink-0" />
              <input 
                type="text"
                className="w-full focus:outline-none text-gray-700 placeholder-gray-400 bg-transparent text-lg"
                placeholder="Tên công việc, kỹ năng, công ty..."
                value={filterForm.keyword}
                onChange={(e) => setFilterForm({ ...filterForm, keyword: e.target.value })}
              />
            </div>
            
            <div className="flex-1 flex items-center w-full px-4 py-2">
              <MapPin className="text-gray-400 w-5 h-5 mr-3 shrink-0" />
              <input 
                type="text"
                className="w-full focus:outline-none text-gray-700 placeholder-gray-400 bg-transparent text-lg"
                placeholder="Tỉnh/Thành phố..."
                value={filterForm.location}
                onChange={(e) => setFilterForm({ ...filterForm, location: e.target.value })}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full md:w-auto h-14 px-8 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-lg transition-all"
            >
              Tìm Việc
            </Button>
          </form>
        </div>
      </div>

      {/* ================= MAIN CONTENT ================= */}
      <div className="max-w-6xl mx-auto px-4 py-12 flex flex-col lg:flex-row gap-8">
        
        {/* SIDEBAR FILTERS */}
        <aside className="w-full lg:w-1/4 shrink-0">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
            <div className="flex items-center gap-2 mb-6 border-b border-gray-50 pb-4">
              <Filter className="w-5 h-5 text-gray-700" />
              <h2 className="text-lg font-bold text-gray-800">Bộ Lọc Mở Rộng</h2>
            </div>

            {/* Lọc theo Hình thức làm việc */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-gray-400" /> Hình thức làm việc
              </h3>
              <div className="space-y-2">
                {['ALL', 'FULL_TIME', 'PART_TIME'].map((type) => (
                  <label key={type} className="flex items-center gap-3 cursor-pointer group">
                    <input 
                      type="radio" 
                      name="workType" 
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      checked={activeWorkType === type}
                      onChange={() => {
                        setActiveWorkType(type);
                        handlePageChange(1); // Tự động đưa về trang 1
                      }}
                    />
                    <span className="text-gray-600 group-hover:text-blue-600 transition-colors">
                      {type === 'ALL' ? 'Tất cả hình thức' : type === 'FULL_TIME' ? 'Toàn thời gian' : 'Bán thời gian'}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* JOB LIST AREA */}
        <main className="w-full lg:w-3/4 flex flex-col min-h-[500px]">
          
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">
              {isLoading ? 'Đang tìm kiếm...' : `Tìm thấy ${pageData.totalElements} việc làm phù hợp`}
            </h2>
          </div>

          {/* Rendering Logic */}
          {isLoading ? (
            <div className="flex-1 flex flex-col items-center justify-center text-blue-600 py-20">
              <Loader2 className="w-12 h-12 animate-spin mb-4" />
              <p className="text-gray-500 font-medium">Đang tải danh sách công việc...</p>
            </div>
          ) : jobs.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center bg-white rounded-2xl border border-gray-100 border-dashed py-20 px-4 text-center shadow-sm">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <Frown className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Chưa tìm thấy công việc phù hợp</h3>
              <p className="text-gray-500 max-w-md">
                Thử thay đổi từ khóa, xóa bớt các bộ lọc hoặc kiểm tra lỗi chính tả để xem thêm các cơ hội khác nhé.
              </p>
              <Button 
                onClick={() => {
                  setFilterForm({ keyword: '', location: '' });
                  setActiveWorkType('ALL');
                  setSearchParams({});
                }} 
                className="mt-6 bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-100"
              >
                Xóa tất cả bộ lọc
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-4 flex-1">
              {jobs.map(job => (
                <div key={job.id} className="transition-all hover:-translate-y-1 hover:shadow-lg rounded-2xl">
                  <JobCard job={job} />
                </div>
              ))}
            </div>
          )}

          {/* COMPONENT PHÂN TRANG NÂNG CẤP */}
          {!isLoading && pageData.totalPages > 1 && (
            <Pagination 
              currentPage={pageData.currentPage} 
              totalPages={pageData.totalPages} 
              onPageChange={handlePageChange} 
            />
          )}

        </main>
      </div>
    </div>
  );
}
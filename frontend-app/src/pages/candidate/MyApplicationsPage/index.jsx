import React, { useState, useEffect } from 'react';
import candidateService from '../../../features/candidate/candidateService';
import authService from '../../../features/auth/authService';
import SearchBar from '../../../components/common/SearchBar';
import Pagination from '../../../components/common/Pagination';
import ApplicationStatusBadge from '../../../components/shared/ApplicationStatusBadge';
// Giả sử bạn có thư viện icon, nếu không có thể thay bằng thẻ <i> hoặc text
import { Briefcase, Building2, Calendar, FileText, ChevronRight, Search } from 'lucide-react'; 

const MyApplicationsPage = () => {
  const user = authService.getCurrentUser();
  const userId = user?.id || user?.userId;
  
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize] = useState(5);

  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL"); // ALL, PENDING, REVIEWED, INTERVIEW_SCHEDULED...
  const [filteredData, setFilteredData] = useState([]);

  // Danh sách trạng thái chuẩn theo Database của bạn
  const STATUS_TABS = [
    { key: 'ALL', label: 'Tất cả' },
    { key: 'PENDING', label: 'Chờ phản hồi' },
    { key: 'REVIEWED', label: 'Đã xem' },
    { key: 'INTERVIEW_SCHEDULED', label: 'Phỏng vấn' },
    { key: 'ACCEPTED', label: 'Trúng tuyển' },
    { key: 'REJECTED', label: 'Từ chối' }
  ];

  useEffect(() => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    const fetchApplications = async () => {
      setIsLoading(true);
      try {
        const res = await candidateService.getMyApplications(userId, currentPage, pageSize);
        const data = res.data?.content || [];
        setApplications(data);
        setFilteredData(data);
        setTotalPages(res.data?.totalPages || 0);
      } catch (error) {
        console.error("Lỗi khi tải danh sách đơn ứng tuyển:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchApplications();
  }, [userId, currentPage, pageSize]);

  // Xử lý bộ lọc (Filter) và Tìm kiếm (Search) đồng thời
  useEffect(() => {
    let result = applications;

    if (statusFilter !== "ALL") {
      result = result.filter(app => app.status === statusFilter);
    }

    if (searchText.trim()) {
      const lowerTerm = searchText.toLowerCase();
      result = result.filter(app => 
        app.jobTitle?.toLowerCase().includes(lowerTerm) || 
        app.companyName?.toLowerCase().includes(lowerTerm)
      );
    }

    setFilteredData(result);
  }, [searchText, statusFilter, applications]);

  if (!userId && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center bg-white p-8 rounded-2xl shadow-sm border border-gray-100 min-h-[400px]">
        <Briefcase className="w-16 h-16 text-gray-300 mb-4" />
        <h3 className="text-lg font-semibold text-gray-800">Bạn chưa đăng nhập</h3>
        <p className="text-gray-500 text-sm mt-2">Vui lòng đăng nhập để theo dõi hành trình ứng tuyển của bạn.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header Section */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800">Lịch sử ứng tuyển</h2>
        <p className="text-gray-500 text-sm mt-1 mb-6">Theo dõi và quản lý các cơ hội nghề nghiệp bạn đã tham gia</p>
        
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          {/* Tabs Trạng thái */}
          <div className="flex w-full md:w-auto overflow-x-auto pb-2 scrollbar-hide gap-2">
            {STATUS_TABS.map(tab => (
              <button
                key={tab.key}
                onClick={() => setStatusFilter(tab.key)}
                className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  statusFilter === tab.key 
                    ? 'bg-blue-50 text-blue-600 border border-blue-200' 
                    : 'bg-gray-50 text-gray-600 border border-transparent hover:bg-gray-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Thanh tìm kiếm */}
          <div className="w-full md:w-72 relative">
            <input
              type="text"
              placeholder="Tìm công ty, vị trí..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
          </div>
        </div>
      </div>

      {/* Danh sách Card ứng tuyển */}
      <div className="space-y-4">
        {isLoading ? (
          // Skeleton Loading
          [1, 2, 3].map(i => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm animate-pulse flex gap-4">
              <div className="w-16 h-16 bg-gray-200 rounded-xl"></div>
              <div className="flex-1 space-y-3">
                <div className="h-5 bg-gray-200 rounded w-1/3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              </div>
            </div>
          ))
        ) : filteredData.length > 0 ? (
          filteredData.map((app) => (
            <div key={app.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200 group">
              <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center">
                
                {/* Logo Công ty (Có fallback nếu null) */}
                <div className="w-16 h-16 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0 overflow-hidden">
                  {app.companyLogo ? (
                    <img src={app.companyLogo} alt={app.companyName} className="w-full h-full object-cover" />
                  ) : (
                    <Building2 className="w-8 h-8 text-gray-400" />
                  )}
                </div>

                {/* Thông tin chính */}
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                    {app.jobTitle}
                  </h3>
                  <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-600">
                    <span className="flex items-center gap-1.5 font-medium">
                      <Building2 className="w-4 h-4 text-gray-400" />
                      {app.companyName}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      Đã nộp: {new Date(app.appliedAt).toLocaleDateString('vi-VN')}
                    </span>
                    {app.cvFileName && (
                      <span className="flex items-center gap-1.5 text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                        <FileText className="w-3.5 h-3.5" />
                        {app.cvFileName}
                      </span>
                    )}
                  </div>
                </div>

                {/* Trạng thái & Hành động */}
                <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-4 mt-4 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                  <ApplicationStatusBadge status={app.status} />
                  
                  {/* Nút xem chi tiết công việc */}
                  <button 
                    onClick={() => window.location.href = `/jobs/${app.jobId}`}
                    className="flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors"
                  >
                    Xem chi tiết <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

              </div>
            </div>
          ))
        ) : (
          /* Empty State */
          <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-100 text-center flex flex-col items-center">
            <img src="/empty-folder.png" alt="Empty" className="w-32 h-32 mb-4 opacity-50" onError={(e) => e.target.style.display = 'none'} />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Chưa có dữ liệu</h3>
            <p className="text-gray-500 text-sm max-w-sm">
              {statusFilter === "ALL" 
                ? "Bạn chưa nộp đơn ứng tuyển cho công việc nào. Hãy khám phá các cơ hội nghề nghiệp ngay!"
                : "Không tìm thấy hồ sơ ứng tuyển nào khớp với bộ lọc hiện tại."}
            </p>
          </div>
        )}
      </div>

      {/* Phân trang */}
      {!isLoading && totalPages > 0 && (
        <div className="mt-8 flex justify-center">
          <Pagination 
            currentPage={currentPage} 
            totalPages={totalPages} 
            onPageChange={(newPage) => setCurrentPage(newPage)} 
          />
        </div>
      )}
    </div>
  );
};

export default MyApplicationsPage;
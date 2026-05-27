import React, { useState, useEffect } from 'react';
import candidateService from '../../../features/candidate/candidateService';
import authService from '../../../features/auth/authService'; // 1. BỔ SUNG: Import authService (Hãy điều chỉnh lại đường dẫn cho đúng với dự án của bạn)
import Table from '../../../components/common/Table'; 
import SearchBar from '../../../components/common/SearchBar';
import Pagination from '../../../components/common/Pagination';
import ApplicationStatusBadge from '../../../components/shared/ApplicationStatusBadge';

const MyApplicationsPage = () => {
  // 2. CẬP NHẬT: Lấy thông tin user động từ localStorage thay vì hardcode số 1
  const user = authService.getCurrentUser();
  const userId = user?.id || user?.userId; // Lấy trường định danh (id hoặc userId tùy theo cấu trúc Backend trả về lúc login)
  
  // States quản lý dữ liệu và phân trang
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize] = useState(5); // Số lượng bản ghi trên một trang

  // States quản lý tìm kiếm
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  // Gọi API tải danh sách từ Backend
  useEffect(() => {
    // 3. BỔ SUNG: Phòng vệ nếu chưa đăng nhập hoặc chưa load xong thông tin user để tránh gọi API lỗi
    if (!userId) {
      setIsLoading(false);
      return;
    }

    const fetchApplications = async () => {
      setIsLoading(true);
      try {
        const res = await candidateService.getMyApplications(userId, currentPage, pageSize);
        // Map theo cấu trúc PageResponse chuẩn của Spring Boot
        setApplications(res.data.content || []);
        setFilteredData(res.data.content || []);
        setTotalPages(res.data.totalPages || 0);
      } catch (error) {
        console.error("Lỗi khi tải danh sách đơn ứng tuyển:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchApplications();
  }, [userId, currentPage, pageSize]);

  // Xử lý tìm kiếm Local Client-side
  const handleSearch = (term) => {
    if (!term.trim()) {
      setFilteredData(applications);
    } else {
      const lowerTerm = term.toLowerCase();
      const filtered = applications.filter(app => 
        app.jobTitle?.toLowerCase().includes(lowerTerm) || 
        app.companyName?.toLowerCase().includes(lowerTerm)
      );
      setFilteredData(filtered);
    }
  };

  // Định nghĩa các cột cho Component Table dùng chung
  const columns = [
    {
      header: 'Vị trí công việc',
      render: (row) => (
        <span className="font-semibold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer transition-colors">
          {row.jobTitle}
        </span>
      )
    },
    {
      header: 'Công ty',
      accessor: 'companyName',
    },
    {
      header: 'Ngày nộp',
      render: (row) => new Date(row.appliedAt).toLocaleDateString('vi-VN')
    },
    {
      header: 'Trạng thái ứng tuyển',
      className: 'text-center',
      render: (row) => (
        <div className="text-center">
          <ApplicationStatusBadge status={row.status} />
        </div>
      )
    }
  ];

  // Giao diện xử lý nếu người dùng chưa đăng nhập
  if (!userId && !isLoading) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center py-12">
        <p className="text-gray-500 text-sm">Vui lòng đăng nhập để xem lịch sử ứng tuyển của bạn.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      {/* Tiêu đề & Thanh tìm kiếm */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Lịch sử ứng tuyển</h2>
          <p className="text-xs text-gray-500 mt-1">Theo dõi trạng thái các hồ sơ vị trí bạn đã nộp</p>
        </div>
        <SearchBar 
          value={searchText} 
          onChange={(val) => {
            setSearchText(val);
            handleSearch(val); 
          }} 
          onSearch={handleSearch} 
          placeholder="Tìm vị trí hoặc công ty..."
        />
      </div>

      {/* Component Table dùng chung */}
      <Table 
        columns={columns} 
        data={filteredData} 
        isLoading={isLoading} 
        emptyMessage="Bạn chưa nộp đơn ứng tuyển cho công việc nào hoặc không tìm thấy kết quả phù hợp."
      />

      {/* Component Phân trang */}
      {!isLoading && totalPages > 0 && (
        <Pagination 
          currentPage={currentPage} 
          totalPages={totalPages} 
          onPageChange={(newPage) => setCurrentPage(newPage)} 
        />
      )}
    </div>
  );
};

export default MyApplicationsPage;
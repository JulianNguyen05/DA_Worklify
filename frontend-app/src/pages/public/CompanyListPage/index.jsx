import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Building2, MapPin, Loader2 } from 'lucide-react';
import Input from '../../../components/common/Input';
import employerService from '../../../features/employer/employerService';
import authService from '../../../features/auth/authService'; // BỔ SUNG: Import authService

export default function CompanyListPage() {
  const [keyword, setKeyword] = useState('');
  const [companies, setCompanies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCompanies = async () => {
      setIsLoading(true);
      try {
        // Lấy thông tin người dùng đang đăng nhập
        const currentUser = authService.getCurrentUser();
        const currentUserId = currentUser ? currentUser.userId : null;

        // Bổ sung currentUserId vào hàm
        const res = await employerService.getAllCompanies(0, 50, currentUserId);
        
        const data = res.data?.items || res.data?.content || res.data || [];
        setCompanies(data);
      } catch (error) {
        console.error("Lỗi tải danh sách công ty", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCompanies();
  }, []);

  // Xử lý sự kiện Like
  const handleLike = async (e, companyId) => {
    e.preventDefault(); // Ngăn không cho thẻ Link chuyển trang khi bấm nút Like
    
    // 1. Lấy thông tin user đang đăng nhập
    const currentUser = authService.getCurrentUser();
    
    // 2. Kiểm tra nếu chưa đăng nhập thì báo lỗi
    if (!currentUser || !currentUser.userId) {
      alert("Bạn cần đăng nhập để có thể thả tim doanh nghiệp!");
      return; 
    }

    // 3. Cập nhật UI ngay lập tức (Optimistic UI) để tạo cảm giác mượt mà
    setCompanies(prev => prev.map(c => {
      if (c.id === companyId) {
        // Giả sử nếu user đã like rồi thì bấm lần nữa là unlike (tùy logic BE của bạn)
        const isCurrentlyLiked = c.isLiked;
        return { 
          ...c, 
          likeCount: isCurrentlyLiked ? Math.max(0, (c.likeCount || 0) - 1) : (c.likeCount || 0) + 1,
          isLiked: !isCurrentlyLiked 
        };
      }
      return c;
    }));

    try {
      // 4. ĐÃ SỬA: Gọi API thực tế lên Backend, truyền thêm tham số currentUser.userId
      await employerService.likeCompany(companyId, currentUser.userId);
    } catch (error) {
      console.error("Lỗi khi like công ty:", error);
      // Nếu API lỗi, bạn có thể rollback state ở đây
    }
  };

  // Lọc local theo từ khóa
  const filteredCompanies = companies.filter(c => 
    c.companyName?.toLowerCase().includes(keyword.toLowerCase())
  );

  return (
    <div className="bg-slate-50 min-h-screen pb-16">
      <div className="max-w-6xl mx-auto py-12 px-4 space-y-10">
        
        {/* Header Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Khám Phá Các Doanh Nghiệp Hàng Đầu</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">Tìm hiểu văn hóa công ty, môi trường làm việc và các cơ hội nghề nghiệp hấp dẫn nhất.</p>
          
          <div className="max-w-xl mx-auto mt-8 relative">
            <Input 
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Tìm kiếm tên công ty..." 
              className="py-3 px-5 shadow-sm rounded-xl text-lg"
            />
          </div>
        </div>

        {/* Danh sách Công ty */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4 text-blue-600">
             <Loader2 className="w-10 h-10 animate-spin" />
             <p className="font-medium text-gray-500">Đang tải danh sách doanh nghiệp...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCompanies.map(company => (
              <Link 
                key={company.id} 
                to={`/companies/${company.id}`} 
                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all group flex flex-col h-full relative overflow-hidden"
              >
                {/* Nút Like góc phải trên */}
                <button 
                  onClick={(e) => handleLike(e, company.id)}
                  className="absolute top-6 right-6 flex items-center gap-1.5 bg-gray-50 hover:bg-rose-50 px-2.5 py-1.5 rounded-full border border-gray-100 transition-colors z-10"
                >
                  <Heart 
                    className={`w-4 h-4 ${company.isLiked ? 'fill-rose-500 text-rose-500' : 'text-gray-400 group-hover:text-rose-500'}`} 
                  />
                  <span className={`text-xs font-bold ${company.isLiked ? 'text-rose-600' : 'text-gray-500'}`}>
                    {company.likeCount || 0}
                  </span>
                </button>

                <div className="flex-grow">
                  {/* Logo */}
                  <div className="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100 mb-5 overflow-hidden">
                    {company.logoUrl ? (
                       <img 
                          src={`http://localhost:8080${company.logoUrl}`} 
                          alt={company.companyName} 
                          className="w-full h-full object-cover bg-white" 
                          onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/150?text=Logo'; }}
                        />
                    ) : (
                      <span className="text-3xl font-extrabold text-blue-600">
                        {company.companyName?.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  
                  {/* Tên công ty */}
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-700 transition-colors line-clamp-1">
                    {company.companyName}
                  </h3>
                  
                  {/* Ngành nghề & Địa điểm */}
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                    <span className="flex items-center gap-1"><Building2 className="w-4 h-4" /> Đa lĩnh vực</span>
                    <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> Toàn quốc</span>
                  </div>
                </div>
                
                {/* Số việc làm đang tuyển */}
                <div className="pt-4 border-t border-gray-100 mt-auto">
                  {company.activeJobsCount && company.activeJobsCount > 0 ? (
                    <div className="text-sm font-bold text-blue-600 flex justify-between items-center">
                      <span>{company.activeJobsCount} việc làm đang tuyển</span>
                      <span>&rarr;</span>
                    </div>
                  ) : (
                    <div className="text-sm font-medium text-gray-400">Chưa có tin tuyển dụng</div>
                  )}
                </div>
              </Link>
            ))}

            {filteredCompanies.length === 0 && (
              <div className="col-span-full py-16 text-center text-gray-500">
                Không tìm thấy doanh nghiệp nào phù hợp với từ khóa "{keyword}".
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
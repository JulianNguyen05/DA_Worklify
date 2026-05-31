import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, MapPin, Briefcase, Award, Filter, 
  FileText, User, Mail, Phone, Loader2, Sparkles 
} from 'lucide-react';
import employerService from '../../../features/employer/employerService';
import Toast from '../../../components/common/Toast';

export default function CandidateSearchPage() {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');
  const [candidates, setCandidates] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ type: null, message: '' });

  // Nạp ngẫu nhiên một vài ứng viên khi vừa vào trang (Tùy chọn)
  useEffect(() => {
    handleSearch(new Event('submit'), true);
  }, []);

  const handleSearch = async (e, isInitialLoad = false) => {
    if (e) e.preventDefault();
    
    // Bỏ qua nếu tìm kiếm trống và không phải load lần đầu
    if (!isInitialLoad && !keyword.trim()) {
      setStatusMsg({ type: 'warning', message: 'Vui lòng nhập từ khóa tìm kiếm.' });
      return;
    }

    setIsLoading(true);
    setHasSearched(!isInitialLoad);
    
    try {
      // Gọi API thật từ Backend
      const response = await employerService.searchCandidates(keyword, 0, 20);
      const data = response.data?.content || response.data || [];
      setCandidates(data);
    } catch (error) {
      console.error(error);
      // Nếu BE chưa có API, nó sẽ báo lỗi 404. Bạn có thể tạm thời bẫy lỗi ở đây.
      setStatusMsg({ type: 'error', message: 'Lỗi tải dữ liệu hoặc API Backend chưa sẵn sàng!' });
      setCandidates([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Hàm tạo avatar chữ cái đầu
  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      {statusMsg.message && (
        <Toast type={statusMsg.type} message={statusMsg.message} onClose={() => setStatusMsg({ type: null, message: '' })} />
      )}

      {/* HEADER & THANH TÌM KIẾM */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-700 rounded-3xl p-8 sm:p-12 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl">
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-4 flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-yellow-300" />
            Tìm kiếm nhân tài
          </h1>
          <p className="text-indigo-100 text-lg mb-8">
            Khám phá kho dữ liệu hàng ngàn ứng viên chất lượng cao, phù hợp với mọi vị trí mà doanh nghiệp bạn đang tìm kiếm.
          </p>

          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Nhập kỹ năng, chức danh, ngôn ngữ lập trình..."
                className="block w-full pl-11 pr-4 py-4 rounded-xl border-0 text-gray-900 placeholder-gray-400 focus:ring-4 focus:ring-yellow-300 transition-shadow text-lg shadow-sm"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-bold px-8 py-4 rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-70 whitespace-nowrap"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Tìm ứng viên'}
            </button>
          </form>
        </div>
      </div>

      {/* BỘ LỌC NHANH (UI DEMO) */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2">
        <div className="flex items-center gap-2 text-gray-500 font-medium px-2">
          <Filter className="w-4 h-4" /> Lọc nhanh:
        </div>
        {['Java', 'ReactJS', 'Node.js', 'Spring Boot', 'Python', 'Thực tập sinh'].map(skill => (
          <button 
            key={skill}
            onClick={() => { setKeyword(skill); handleSearch(null, false); }}
            className="px-4 py-1.5 bg-white border border-gray-200 text-gray-600 rounded-full text-sm font-medium hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-colors whitespace-nowrap"
          >
            {skill}
          </button>
        ))}
      </div>

      {/* KẾT QUẢ TÌM KIẾM */}
      <div>
        <div className="flex justify-between items-end mb-6 px-2">
          <h2 className="text-xl font-bold text-gray-800">
            {hasSearched ? `Kết quả tìm kiếm cho "${keyword}"` : 'Ứng viên nổi bật'}
            <span className="ml-2 text-sm font-medium text-gray-500 bg-gray-100 px-2.5 py-0.5 rounded-full">
              {candidates.length}
            </span>
          </h2>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 animate-pulse flex gap-4">
                <div className="w-16 h-16 bg-gray-200 rounded-full shrink-0" />
                <div className="flex-1 space-y-3">
                  <div className="h-5 bg-gray-200 rounded w-1/3" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                  <div className="h-4 bg-gray-200 rounded w-3/4 mt-4" />
                </div>
              </div>
            ))}
          </div>
        ) : candidates.length === 0 ? (
          <div className="bg-white rounded-3xl border border-gray-100 border-dashed p-16 text-center">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Không tìm thấy ứng viên</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Không có ứng viên nào khớp với từ khóa "{keyword}". Hãy thử tìm kiếm với các từ khóa ngắn gọn hoặc phổ biến hơn.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {candidates.map((candidate) => (
              <div key={candidate.id} className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-xl hover:border-indigo-100 transition-all group flex flex-col justify-between">
                
                <div className="flex gap-5 items-start mb-4">
                  {/* Avatar */}
                  <div className="w-16 h-16 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 font-extrabold text-xl shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    {getInitials(candidate.fullName || candidate.name)}
                  </div>
                  
                  {/* Thông tin chính */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="text-lg font-bold text-gray-900 truncate group-hover:text-indigo-600 transition-colors">
                        {candidate.fullName || candidate.name || 'Ứng viên ẩn danh'}
                      </h3>
                      {candidate.experience && (
                        <span className="bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-md text-xs font-bold whitespace-nowrap">
                          {candidate.experience} KN
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-medium text-gray-500 mt-1 truncate">
                      {candidate.title || candidate.summary || 'Chưa cập nhật chức danh'}
                    </p>
                    
                    <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                      {(candidate.address || candidate.location) && (
                        <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {candidate.address || candidate.location}</span>
                      )}
                      {(candidate.gender) && (
                        <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" /> {candidate.gender === 'MALE' ? 'Nam' : 'Nữ'}</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Kỹ năng (nếu Backend có trả về mảng skills) */}
                <div className="mb-6">
                  <div className="flex flex-wrap gap-2">
                    {(candidate.skills || ['Giao tiếp', 'Làm việc nhóm', 'Thích nghi nhanh']).slice(0, 4).map((skill, idx) => (
                      <span key={idx} className="px-2.5 py-1 bg-gray-50 text-gray-600 border border-gray-100 rounded-md text-xs font-medium">
                        {skill}
                      </span>
                    ))}
                    {candidate.skills?.length > 4 && <span className="px-2 py-1 text-gray-400 text-xs font-medium">+{candidate.skills.length - 4}</span>}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 pt-4 border-t border-gray-50 mt-auto">
                  <button 
                    onClick={() => setStatusMsg({ type: 'warning', message: 'Tính năng xem hồ sơ đang được hoàn thiện!' })}
                    className="flex-1 bg-white text-indigo-600 border-2 border-indigo-100 hover:bg-indigo-50 font-bold py-2.5 rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
                  >
                    <User className="w-4 h-4" /> Xem hồ sơ
                  </button>
                  {candidate.cvId && (
                     <button 
                       onClick={() => window.open(`http://localhost:8080/api/v1/files/cv/${candidate.cvId}`, '_blank')}
                       className="flex-1 bg-indigo-600 text-white border-2 border-indigo-600 hover:bg-indigo-700 font-bold py-2.5 rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
                     >
                       <FileText className="w-4 h-4" /> Tải CV
                     </button>
                  )}
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
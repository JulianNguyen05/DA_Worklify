import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import authService from '../../../features/auth/authService';
import candidateService from '../../../features/candidate/candidateService';
import jobService from '../../../features/job/jobService';

const DashboardPage = () => {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({ cvCount: 0, appCount: 0 });
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      // Lấy thông tin user hiện tại từ local storage
      const currentUser = authService.getCurrentUser();
      
      if (currentUser && currentUser.userId) {
        setUser(currentUser);
        const userId = currentUser.userId;

        try {
          // Gọi API song song để tối ưu thời gian tải trang
          const [cvRes, appsRes, jobsRes] = await Promise.all([
            candidateService.getCvs(userId).catch(() => ({ data: [] })),
            candidateService.getMyApplications(userId).catch(() => ({ data: { content: [], totalElements: 0 } })),
            // Tạm thời gọi API searchJobs lấy 3 việc làm mới nhất làm gợi ý. 
            // Về sau có thể đổi thành endpoint gọi API AI Recommendation riêng.
            jobService.searchJobs('', '', 0, 3).catch(() => ({ data: { content: [] } })) 
          ]);

          setStats({
            cvCount: cvRes.data?.length || 0,
            appCount: appsRes.data?.totalElements || appsRes.data?.content?.length || 0
          });

          setRecommendedJobs(jobsRes.data?.content || []);
        } catch (error) {
          console.error("Lỗi khi tải dữ liệu bảng điều khiển:", error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return <div className="text-center py-10 text-gray-500">Đang tải dữ liệu tổng quan...</div>;
  }

  // Nếu trong currentUser có lưu email thì trích xuất phần tên trước @ để chào (nếu ko có fullName)
  const displayName = user?.email ? user.email.split('@')[0] : "Ứng viên";

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-10">
      <h1 className="text-2xl font-bold text-gray-800">
        Chào mừng trở lại, <span className="text-blue-600">{displayName}</span>!
      </h1>
      
      {/* KHU VỰC THỐNG KÊ (QUICK STATS) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Thẻ 1: Hồ sơ cá nhân */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Hồ sơ cá nhân</h3>
            <p className="text-sm text-gray-500 mt-2">Cập nhật thông tin kỹ năng, kinh nghiệm chuyên môn.</p>
          </div>
          <Link to="/candidate/profile" className="mt-4 inline-block text-blue-600 hover:underline text-sm font-medium">
            Cập nhật ngay &rarr;
          </Link>
        </div>

        {/* Thẻ 2: Quản lý CV */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Quản lý CV</h3>
            <p className="text-sm text-gray-500 mt-2">Bạn đang có <strong className="text-gray-800">{stats.cvCount}</strong> CV lưu trên hệ thống.</p>
          </div>
          <Link to="/candidate/cv-builder" className="mt-4 inline-block text-blue-600 hover:underline text-sm font-medium">
            Quản lý CV &rarr;
          </Link>
        </div>

        {/* Thẻ 3: Việc làm đã ứng tuyển */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Lịch sử ứng tuyển</h3>
            <p className="text-sm text-gray-500 mt-2">Bạn đã nộp đơn vào <strong className="text-blue-600">{stats.appCount}</strong> công việc.</p>
          </div>
          <Link to="/candidate/applications" className="mt-4 inline-block text-blue-600 hover:underline text-sm font-medium">
            Theo dõi trạng thái &rarr;
          </Link>
        </div>

        {/* Thẻ 4: Cài đặt tài khoản (Mới bổ sung theo BFD) */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Cài đặt tài khoản</h3>
            <p className="text-sm text-gray-500 mt-2">Quản lý bảo mật MFA, đổi mật khẩu và thông báo.</p>
          </div>
          <Link to="/candidate/settings" className="mt-4 inline-block text-blue-600 hover:underline text-sm font-medium">
            Tùy chỉnh &rarr;
          </Link>
        </div>

      </div>

      {/* KHU VỰC GỢI Ý VIỆC LÀM THÔNG MINH */}
      <div className="bg-white p-6 md:p-8 rounded-lg shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <svg className="w-6 h-6 text-yellow-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" /></svg>
            Gợi ý việc làm phù hợp (AI Match)
          </h2>
          <Link to="/jobs" className="text-sm font-medium text-blue-600 hover:underline">
            Xem tất cả
          </Link>
        </div>

        {recommendedJobs.length === 0 ? (
          <div className="text-center py-6 bg-gray-50 rounded-md border border-dashed border-gray-200">
            <p className="text-sm text-gray-500">Hãy cập nhật <Link to="/candidate/profile" className="text-blue-600 hover:underline">Hồ sơ cá nhân</Link> để hệ thống AI có thể gợi ý việc làm tốt nhất cho bạn.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {recommendedJobs.map(job => (
              <Link key={job.id} to={`/jobs/${job.id}`} className="block p-4 border border-gray-100 rounded-md hover:border-blue-300 hover:shadow-sm transition-all group">
                <h3 className="font-bold text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-2">{job.title}</h3>
                <p className="text-sm text-gray-500 mt-1 mb-3 line-clamp-1">{job.companyName || "SmartMatch Partner"}</p>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-green-600 font-medium bg-green-50 px-2 py-1 rounded">{job.salaryRange || "Thỏa thuận"}</span>
                  <span className="text-gray-500">{job.location}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default DashboardPage;
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// import jobService from '../../../features/job/jobService';
import Button from '../../../components/common/Button';

export default function JobDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        // await jobService.getJobDetail(id);
        await new Promise(resolve => setTimeout(resolve, 500));
        setJob({
          id,
          title: 'Senior ReactJS Developer',
          company: 'Công ty Cổ phần TechVN',
          location: 'Hà Nội',
          salary: '20 - 30 Triệu',
          postedAt: '2026-05-20',
          description: 'Chúng tôi đang tìm kiếm một Senior ReactJS Developer tham gia vào dự án lõi...\n- Phát triển các tính năng frontend mới.\n- Tối ưu hóa UI/UX.',
          requirements: '- Có ít nhất 3 năm kinh nghiệm làm việc với ReactJS.\n- Thành thạo HTML, CSS, JavaScript.\n- Có kinh nghiệm với Redux, Context API.',
        });
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  const handleApply = () => {
    // Trong thực tế, bạn sẽ kiểm tra xem người dùng đã login bằng role Candidate chưa.
    // Nếu chưa -> chuyển hướng login. Nếu rồi -> mở Modal chọn CV để nộp.
    const isCandidateLoggedIn = false; // Mock
    if (!isCandidateLoggedIn) {
      alert('Vui lòng đăng nhập với tài khoản Ứng viên để nộp hồ sơ!');
      navigate('/auth/login');
    } else {
      // Logic gọi API ứng tuyển
    }
  };

  if (isLoading) return <div className="text-center py-20 text-gray-500">Đang tải thông tin...</div>;
  if (!job) return <div className="text-center py-20 text-gray-500">Không tìm thấy công việc này!</div>;

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 space-y-6">
      {/* Header */}
      <div className="bg-white p-6 md:p-8 rounded-lg shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">{job.title}</h1>
          <p className="text-lg text-blue-600 font-medium mt-2">{job.company}</p>
          <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-600">
            <span>📍 {job.location}</span>
            <span className="font-semibold text-green-600">💰 {job.salary}</span>
            <span>🕒 Đăng ngày: {new Date(job.postedAt).toLocaleDateString()}</span>
          </div>
        </div>
        <Button onClick={handleApply} className="w-full md:w-auto px-8 py-3 text-lg">Ứng tuyển ngay</Button>
      </div>

      {/* Content */}
      <div className="bg-white p-6 md:p-8 rounded-lg shadow-sm border border-gray-100 space-y-8">
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Mô tả công việc</h2>
          <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">{job.description}</div>
        </div>

        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Yêu cầu ứng viên</h2>
          <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">{job.requirements}</div>
        </div>
      </div>
    </div>
  );
}
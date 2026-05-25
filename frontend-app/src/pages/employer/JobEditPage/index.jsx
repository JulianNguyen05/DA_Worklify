import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import employerService from '../../../features/employer/employerService';
import authService from '../../../features/auth/authService';
import Input from '../../../components/common/Input';
import Button from '../../../components/common/Button';
import Toast from '../../../components/common/Toast';

export default function JobEditPage() {
  const { id } = useParams(); // 1. Lấy jobId từ thanh địa chỉ URL (Ví dụ: /employer/jobs/edit/12)
  const navigate = useNavigate();
  const [companyId, setCompanyId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    salaryRange: '',
    workType: 'FULL_TIME',
    expiresAt: '',
    description: '',
    requirements: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true); // Trạng thái đợi tải dữ liệu cũ
  const [statusMsg, setStatusMsg] = useState({ type: null, message: '' });

  // Khởi chạy khi component Mount: Lấy thông tin doanh nghiệp & Lấy dữ liệu cũ của Job
  useEffect(() => {
    const initEditPage = async () => {
      const user = authService.getCurrentUser();
      if (!user || !user.userId) {
        navigate('/auth/login');
        return;
      }

      try {
        // Lấy profile để kiểm tra quyền doanh nghiệp giống trang tạo
        const profile = await employerService.getCompanyProfile(user.userId);
        if (profile.data && profile.data.id) {
          setCompanyId(profile.data.id);
          
          // Tiến hành lấy dữ liệu chi tiết của Tin tuyển dụng cũ từ Backend
          await loadJobDetail();
        } else {
          handleMissingProfile();
        }
      } catch (error) {
        console.error('Lỗi khi tải thông tin hệ thống:', error);
        handleMissingProfile();
      } finally {
        setIsFetching(false);
      }
    };

    const loadJobDetail = async () => {
      try {
        const response = await employerService.getJobDetail(id);
        if (response.data) {
          const jobData = response.data;
          
          // ⚠️ QUAN TRỌNG: Định dạng LocalDateTime từ DB cần được cắt ngắn thành 16 ký tự (YYYY-MM-DDThh:mm)
          // để hiển thị khớp và chính xác trên thẻ ô nhập <input type="datetime-local">
          if (jobData.expiresAt) {
            jobData.expiresAt = jobData.expiresAt.substring(0, 16);
          }

          setFormData({
            title: jobData.title || '',
            location: jobData.location || '',
            salaryRange: jobData.salaryRange || '',
            workType: jobData.workType || 'FULL_TIME',
            expiresAt: jobData.expiresAt || '',
            description: jobData.description || '',
            requirements: jobData.requirements || ''
          });
        } else {
          setStatusMsg({ type: 'error', message: 'Không tìm thấy dữ liệu tin tuyển dụng này.' });
        }
      } catch (error) {
        console.error('Lỗi khi tải thông tin tin tuyển dụng:', error);
        setStatusMsg({ type: 'error', message: 'Lỗi máy chủ không thể tải chi tiết tin tuyển dụng.' });
      }
    };

    initEditPage();
  }, [id, navigate]);

  const handleMissingProfile = () => {
    setStatusMsg({ type: 'error', message: 'Không tìm thấy Hồ sơ Doanh nghiệp của bạn!' });
    setTimeout(() => navigate('/employer/profile'), 3000);
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.expiresAt) {
      setStatusMsg({ type: 'error', message: 'Vui lòng chọn Hạn nộp hồ sơ!' });
      return;
    }

    setIsLoading(true);
    setStatusMsg({ type: null, message: '' });
    
    try {
      const submitData = { ...formData };
      
      if (submitData.expiresAt && submitData.expiresAt.length === 16) {
        submitData.expiresAt = submitData.expiresAt + ':00';
      }

      // Đã bổ sung thêm companyId vào đầu hàm gọi API theo đúng chuẩn mới
      await employerService.updateJobPosting(companyId, id, submitData);
      
      setStatusMsg({ type: 'success', message: 'Cập nhật tin tuyển dụng thành công!' });
      setTimeout(() => navigate('/employer/jobs'), 2000);
      
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Có lỗi xảy ra khi lưu thông tin. Vui lòng thử lại.';
      setStatusMsg({ type: 'error', message: errorMsg });
    } finally {
      setIsLoading(false);
    }
  };

  // Trạng thái Loading ban đầu khi chờ kéo dữ liệu từ DB về đổ vào Form
  if (isFetching) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-center text-gray-500 py-20 max-w-4xl mx-auto">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        Đang tải dữ liệu tin tuyển dụng từ hệ thống...
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Chỉnh sửa tin tuyển dụng</h2>
          <p className="text-sm text-gray-500 mt-1">Thay đổi nội dung mô tả vị trí hoặc cập nhật từ khóa chấm điểm AI.</p>
        </div>
        <button onClick={() => navigate('/employer/jobs')} className="text-sm text-blue-600 hover:underline">
          &larr; Quay lại danh sách
        </button>
      </div>
      
      {statusMsg.type && <div className="mb-6"><Toast type={statusMsg.type} message={statusMsg.message} /></div>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <Input 
          label="Tiêu đề công việc" name="title" value={formData.title} 
          onChange={handleChange} required placeholder="VD: Senior ReactJS Developer" 
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input 
            label="Địa điểm làm việc" name="location" value={formData.location} 
            onChange={handleChange} required placeholder="VD: Tòa nhà AB, Quận 1, TP.HCM" 
          />
          <Input 
            label="Mức lương (Tùy chọn)" name="salaryRange" value={formData.salaryRange} 
            onChange={handleChange} placeholder="VD: 15,000,000 - 25,000,000 VND" 
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Hình thức làm việc</label>
            <select 
              name="workType" value={formData.workType} onChange={handleChange} required
              className="border border-gray-300 rounded-md px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-white"
            >
              <option value="FULL_TIME">Toàn thời gian (Full-time)</option>
              <option value="PART_TIME">Bán thời gian (Part-time)</option>
              <option value="INTERNSHIP">Thực tập sinh (Internship)</option>
              <option value="REMOTE">Làm việc từ xa (Remote)</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Hạn nộp hồ sơ <span className="text-red-500">*</span></label>
            <input 
              type="datetime-local" name="expiresAt" value={formData.expiresAt} onChange={handleChange} required
              className="border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Mô tả công việc (Job Description) <span className="text-red-500">*</span></label>
          <textarea
            name="description" value={formData.description} onChange={handleChange} required rows="6"
            className="border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            placeholder="Mô tả chi tiết các công việc, nhiệm vụ hàng ngày ứng viên cần thực hiện..."
          ></textarea>
        </div>

        <div className="flex flex-col gap-1 bg-blue-50 p-4 rounded-md border border-blue-100">
          <label className="text-sm font-bold text-blue-800 flex items-center gap-2">
            <span>⚡</span> Yêu cầu ứng viên (Tiêu chí chấm điểm AI Scanner) <span className="text-red-500">*</span>
          </label>
          <p className="text-xs text-blue-600 mb-2">Liệt kê rõ ràng các kỹ năng hệ thống AI đối chiếu dữ liệu CV chính xác hơn.</p>
          <textarea
            name="requirements" value={formData.requirements} onChange={handleChange} required rows="5"
            className="border border-blue-200 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            placeholder="- Tốt nghiệp chuyên ngành CNTT&#10;- Có kinh nghiệm 2 năm với ReactJS&#10;- Am hiểu về RESTful API..."
          ></textarea>
        </div>

        <div className="flex justify-end pt-4 border-t border-gray-100 gap-3">
          <button 
            type="button" 
            onClick={() => navigate('/employer/jobs')}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            disabled={isLoading}
          >
            Hủy bỏ
          </button>
          <Button type="submit" isLoading={isLoading}>Lưu thay đổi</Button>
        </div>
      </form>
    </div>
  );
}
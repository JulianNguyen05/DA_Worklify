import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import employerService from '../../../features/employer/employerService';
import authService from '../../../features/auth/authService';
import Input from '../../../components/common/Input';
import Button from '../../../components/common/Button';
import Toast from '../../../components/common/Toast';

export default function JobCreatePage() {
  const navigate = useNavigate();
  const [companyId, setCompanyId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    salaryRange: '',
    workType: 'FULL_TIME', // Giá trị mặc định
    expiresAt: '',
    description: '',
    requirements: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ type: null, message: '' });

  // Lấy Company ID khi component mount
  useEffect(() => {
    const fetchCompanyData = async () => {
      const user = authService.getCurrentUser();
      if (user && user.userId) {
        try {
          const profile = await employerService.getCompanyProfile(user.userId);
          if (profile.data && profile.data.id) {
            setCompanyId(profile.data.id);
          } else {
            handleMissingProfile();
          }
        } catch (error) {
          handleMissingProfile();
        }
      } else {
        navigate('/auth/login');
      }
    };
    fetchCompanyData();
  }, [navigate]);

  const handleMissingProfile = () => {
    setStatusMsg({ type: 'error', message: 'Bạn cần tạo Hồ sơ Doanh nghiệp trước khi đăng tin!' });
    setTimeout(() => navigate('/employer/profile'), 3000);
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Kiểm tra dữ liệu bắt buộc trước khi gửi
    if (!formData.expiresAt) {
        setStatusMsg({ type: 'error', message: 'Vui lòng chọn Hạn nộp hồ sơ!' });
        return;
    }
    if (!companyId) {
        setStatusMsg({ type: 'error', message: 'Thông tin doanh nghiệp chưa hợp lệ.' });
        return;
    }

    setIsLoading(true);
    setStatusMsg({ type: null, message: '' });
    
    try {
      // 1. Chuẩn hóa dữ liệu gửi đi
      const submitData = { ...formData };
      
      // Xử lý định dạng thời gian: datetime-local thường trả về chuỗi 16 ký tự (YYYY-MM-DDThh:mm)
      // Java LocalDateTime yêu cầu YYYY-MM-DDThh:mm:ss
      if (submitData.expiresAt && submitData.expiresAt.length === 16) {
        submitData.expiresAt = submitData.expiresAt + ':00';
      }

      // 2. Gọi service (Đảm bảo service đã sửa URL không chứa /api/v1/ dư thừa)
      await employerService.createJobPosting(companyId, submitData);
      
      // 3. Thông báo thành công
      setStatusMsg({ type: 'success', message: 'Đăng tin thành công! Tin đang chờ Admin kiểm duyệt.' });
      
      // 4. Điều hướng
      setTimeout(() => navigate('/employer/jobs'), 2000);
      
    } catch (err) {
      // 5. Hiển thị thông báo lỗi chi tiết từ backend nếu có
      const errorMsg = err.response?.data?.message || 'Lỗi khi đăng tin. Vui lòng kiểm tra lại các trường thông tin.';
      setStatusMsg({ type: 'error', message: errorMsg });
    } finally {
      // Luôn kết thúc trạng thái loading dù thành công hay lỗi
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Đăng tin tuyển dụng mới</h2>
          <p className="text-sm text-gray-500 mt-1">Hệ thống sẽ tự động chuyển tin vào hàng đợi kiểm duyệt.</p>
        </div>
        <button onClick={() => navigate('/employer/jobs')} className="text-sm text-blue-600 hover:underline">
          &larr; Quay lại danh sách
        </button>
      </div>
      
      {statusMsg.type && <div className="mb-6"><Toast type={statusMsg.type} message={statusMsg.message} /></div>}

      {companyId ? (
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
            <p className="text-xs text-blue-600 mb-2">Liệt kê rõ ràng các kỹ năng (VD: ReactJS, Java, Spring Boot) để hệ thống AI đối chiếu và chấm điểm chính xác nhất.</p>
            <textarea
              name="requirements" value={formData.requirements} onChange={handleChange} required rows="5"
              className="border border-blue-200 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              placeholder="- Tốt nghiệp chuyên ngành CNTT&#10;- Có kinh nghiệm 2 năm với ReactJS&#10;- Am hiểu về RESTful API..."
            ></textarea>
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-100">
            <Button type="submit" isLoading={isLoading}>Gửi Yêu Cầu Kiểm Duyệt</Button>
          </div>
        </form>
      ) : (
        <div className="py-10 text-center text-gray-500">
          Đang tải dữ liệu doanh nghiệp...
        </div>
      )}
    </div>
  );
}
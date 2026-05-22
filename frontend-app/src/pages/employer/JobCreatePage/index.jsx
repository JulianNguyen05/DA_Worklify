import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import employerService from '../../../features/employer/employerService';
import Input from '../../../components/common/Input';
import Button from '../../../components/common/Button';
import Toast from '../../../components/common/Toast';

export default function JobCreatePage() {
  const companyId = 10; // Mock Company ID
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    salaryRange: '',
    description: '',
    requirements: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ type: null, message: '' });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatusMsg({ type: null, message: '' });
    
    try {
      await employerService.createJobPosting(companyId, formData);
      setStatusMsg({ type: 'success', message: 'Đăng tin thành công! Tin đang chờ Admin kiểm duyệt.' });
      setTimeout(() => navigate('/employer/jobs'), 2000);
    } catch (err) {
      setStatusMsg({ type: 'error', message: 'Lỗi khi đăng tin. Vui lòng kiểm tra lại dữ liệu.' });
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 max-w-3xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Đăng tin tuyển dụng mới</h2>
        <button onClick={() => navigate('/employer/jobs')} className="text-sm text-gray-500 hover:underline">
          Quay lại danh sách
        </button>
      </div>
      
      {statusMsg.type && <div className="mb-4"><Toast type={statusMsg.type} message={statusMsg.message} /></div>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <Input label="Tiêu đề công việc" name="title" value={formData.title} onChange={handleChange} required placeholder="VD: Senior ReactJS Developer" />
        
        <div className="grid grid-cols-2 gap-4">
          <Input label="Địa điểm làm việc" name="location" value={formData.location} onChange={handleChange} required placeholder="VD: Hà Nội, TP.HCM" />
          <Input label="Mức lương (Tùy chọn)" name="salaryRange" value={formData.salaryRange} onChange={handleChange} placeholder="VD: 15 - 25 Triệu" />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Mô tả công việc <span className="text-red-500">*</span></label>
          <textarea
            name="description" value={formData.description} onChange={handleChange} required rows="5"
            className="border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          ></textarea>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Yêu cầu ứng viên (Tiêu chí sàng lọc) <span className="text-red-500">*</span></label>
          <textarea
            name="requirements" value={formData.requirements} onChange={handleChange} required rows="5"
            className="border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            placeholder="Kỹ năng, kinh nghiệm cần thiết để AI có thể đối chiếu chính xác..."
          ></textarea>
        </div>

        <div className="flex justify-end mt-4">
          <Button type="submit" isLoading={isLoading}>Đăng & Lưu tin</Button>
        </div>
      </form>
    </div>
  );
}
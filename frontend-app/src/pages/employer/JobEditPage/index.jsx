import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Input from '../../../components/common/Input';
import Button from '../../../components/common/Button';
import Toast from '../../../components/common/Toast';

export default function JobEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ title: '', location: '', salaryRange: '', description: '', requirements: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ type: null, message: '' });

  useEffect(() => {
    // Giả lập lấy dữ liệu chi tiết tin tuyển dụng từ API
    // const fetchJob = async () => { const res = await jobService.getJobById(id); setFormData(res.data); }
    setFormData({
      title: 'Senior React Developer',
      location: 'Hà Nội',
      salaryRange: '20 - 30 Triệu',
      description: 'Phát triển ứng dụng Web SPA...',
      requirements: '3 năm kinh nghiệm ReactJS, hiểu biết về Redux...'
    });
  }, [id]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Giả lập API update
    setTimeout(() => {
      setStatusMsg({ type: 'success', message: 'Cập nhật tin thành công!' });
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 max-w-3xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Chỉnh sửa tin #{id}</h2>
        <button onClick={() => navigate('/employer/jobs')} className="text-sm text-gray-500 hover:underline">Hủy & Quay lại</button>
      </div>
      {statusMsg.type && <div className="mb-4"><Toast type={statusMsg.type} message={statusMsg.message} /></div>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <Input label="Tiêu đề công việc" name="title" value={formData.title} onChange={handleChange} required />
        <div className="grid grid-cols-2 gap-4">
          <Input label="Địa điểm" name="location" value={formData.location} onChange={handleChange} required />
          <Input label="Mức lương" name="salaryRange" value={formData.salaryRange} onChange={handleChange} />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Mô tả công việc</label>
          <textarea name="description" value={formData.description} onChange={handleChange} required rows="4" className="border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-500"></textarea>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Yêu cầu ứng viên</label>
          <textarea name="requirements" value={formData.requirements} onChange={handleChange} required rows="4" className="border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-500"></textarea>
        </div>
        <div className="flex justify-end mt-4">
          <Button type="submit" isLoading={isLoading}>Cập nhật tin</Button>
        </div>
      </form>
    </div>
  );
}
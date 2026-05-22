import React, { useState, useEffect } from 'react';
import Input from '../../../components/common/Input';
import Button from '../../../components/common/Button';
import Toast from '../../../components/common/Toast';
import candidateService from '../../../features/candidate/candidateService';

const ProfilePage = () => {
  const userId = 1; // Mock ID - Thay bằng ID thật từ Global State
  const [formData, setFormData] = useState({
    title: '',
    yearsOfExperience: 0,
    skills: ''
  });
  const [status, setStatus] = useState({ type: null, message: '' });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await candidateService.getProfile(userId);
        if (res.data) setFormData(res.data);
      } catch (error) {
        console.error("Chưa có profile hoặc lỗi tải dữ liệu");
      }
    };
    fetchProfile();
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus({ type: null, message: '' });

    try {
      await candidateService.createOrUpdateProfile(userId, formData);
      setStatus({ type: 'success', message: 'Cập nhật hồ sơ năng lực thành công!' });
    } catch (err) {
      setStatus({ type: 'error', message: 'Có lỗi xảy ra khi cập nhật hồ sơ.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 max-w-2xl">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Hồ sơ năng lực</h2>
      
      {status.type && <div className="mb-4"><Toast type={status.type} message={status.message} /></div>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <Input 
          label="Chức danh hiện tại (VD: Software Engineer)" 
          name="title" 
          value={formData.title} 
          onChange={handleChange} 
          required 
        />
        <Input 
          label="Số năm kinh nghiệm" 
          type="number" 
          name="yearsOfExperience" 
          value={formData.yearsOfExperience} 
          onChange={handleChange} 
          min="0"
        />
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Kỹ năng chuyên môn (Cách nhau bởi dấu phẩy)</label>
          <textarea
            name="skills"
            value={formData.skills}
            onChange={handleChange}
            rows="3"
            className="border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            placeholder="VD: Java, ReactJS, Spring Boot..."
          ></textarea>
        </div>

        <div className="flex justify-end mt-4">
          <Button type="submit" isLoading={isLoading}>Lưu Hồ Sơ</Button>
        </div>
      </form>
    </div>
  );
};

export default ProfilePage;
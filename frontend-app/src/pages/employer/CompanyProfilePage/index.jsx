import React, { useState, useEffect } from 'react';
import employerService from '../../../features/employer/employerService';
import Input from '../../../components/common/Input';
import Button from '../../../components/common/Button';
import Toast from '../../../components/common/Toast';

export default function CompanyProfilePage() {
  const userId = 2; // Mock ID người dùng hiện tại
  const [formData, setFormData] = useState({ name: '', taxCode: '', address: '', website: '', description: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ type: null, message: '' });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await employerService.getCompanyProfile(userId);
        if (res.data) setFormData(res.data);
      } catch (error) {
        console.log("Chưa có hồ sơ doanh nghiệp");
      }
    };
    fetchProfile();
  }, [userId]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatusMsg({ type: null, message: '' });
    try {
      await employerService.createProfile(userId, formData);
      setStatusMsg({ type: 'success', message: 'Cập nhật hồ sơ doanh nghiệp thành công. Đang chờ Admin duyệt!' });
    } catch (err) {
      setStatusMsg({ type: 'error', message: 'Lỗi khi cập nhật hồ sơ.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 max-w-3xl">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Hồ sơ Doanh nghiệp</h2>
      {statusMsg.type && <div className="mb-4"><Toast type={statusMsg.type} message={statusMsg.message} /></div>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="grid grid-cols-2 gap-4">
          <Input label="Tên công ty" name="name" value={formData.name} onChange={handleChange} required />
          <Input label="Mã số thuế" name="taxCode" value={formData.taxCode} onChange={handleChange} required />
        </div>
        <Input label="Trang web" type="url" name="website" value={formData.website} onChange={handleChange} placeholder="https://..." />
        <Input label="Địa chỉ trụ sở" name="address" value={formData.address} onChange={handleChange} required />
        
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Giới thiệu văn hóa công ty</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="5"
            className="border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          ></textarea>
        </div>
        <div className="flex justify-end mt-4">
          <Button type="submit" isLoading={isLoading}>Lưu Hồ Sơ</Button>
        </div>
      </form>
    </div>
  );
}
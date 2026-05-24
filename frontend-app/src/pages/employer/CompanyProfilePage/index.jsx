import React, { useState, useEffect } from 'react';
import employerService from '../../../features/employer/employerService';
import authService from '../../../features/auth/authService';
import Input from '../../../components/common/Input';
import Button from '../../../components/common/Button';
import Toast from '../../../components/common/Toast';

export default function CompanyProfilePage() {
  const [userId, setUserId] = useState(null);
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [formData, setFormData] = useState({ companyName: '', website: '', description: '' });
  
  // Trạng thái cho File Logo
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ type: null, message: '' });

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser?.userId) {
      setUserId(currentUser.userId);
      fetchProfile(currentUser.userId);
    }
  }, []);

  const fetchProfile = async (id) => {
    try {
      const res = await employerService.getCompanyProfile(id);
      if (res.data) {
        setFormData({
          companyName: res.data.companyName || '',
          website: res.data.website || '',
          description: res.data.description || ''
        });
        if (res.data.logoUrl) {
          // Thêm tiền tố API server nếu cần (vd: http://localhost:8080)
          setLogoPreview(`http://localhost:8080${res.data.logoUrl}`);
        }
        setIsUpdateMode(true); // Đã có profile -> Chuyển sang chế độ Cập nhật
      }
    } catch (error) {
      console.log("Chưa có hồ sơ, ở chế độ Tạo mới");
      setIsUpdateMode(false);
    }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // Bắt sự kiện chọn file logo
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file)); // Hiển thị ảnh xem trước
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatusMsg({ type: null, message: '' });
    
    try {
      // 1. Lưu thông tin Text (Tạo mới hoặc Cập nhật)
      if (isUpdateMode) {
        await employerService.updateProfile(userId, formData);
      } else {
        await employerService.createProfile(userId, formData);
        setIsUpdateMode(true); // Tạo xong thì chuyển sang mode update
      }

      // 2. Nếu người dùng có chọn file Logo mới, thì gọi API upload logo
      if (logoFile) {
        await employerService.uploadLogo(userId, logoFile);
      }

      setStatusMsg({ type: 'success', message: 'Cập nhật hồ sơ doanh nghiệp thành công. Đang chờ kiểm duyệt!' });
    } catch (err) {
      setStatusMsg({ type: 'error', message: err.response?.data?.message || 'Lỗi khi cập nhật hồ sơ.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 max-w-3xl">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Hồ sơ Doanh nghiệp</h2>
      
      {statusMsg.type && <div className="mb-4"><Toast type={statusMsg.type} message={statusMsg.message} /></div>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        
        {/* KHU VỰC UPLOAD LOGO */}
        <div className="flex items-center gap-6 p-4 bg-gray-50 border rounded-md">
          <div className="w-24 h-24 bg-white border border-gray-300 rounded-md overflow-hidden flex items-center justify-center flex-shrink-0">
            {logoPreview ? (
              <img src={logoPreview} alt="Company Logo" className="w-full h-full object-contain" />
            ) : (
              <span className="text-xs text-gray-400">Chưa có Logo</span>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Logo Doanh Nghiệp (Tùy chọn)</label>
            <input 
              type="file" 
              accept="image/png, image/jpeg, image/jpg" 
              onChange={handleFileChange}
              className="text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
            />
            <p className="text-xs text-gray-500 mt-2">Định dạng hỗ trợ: JPG, PNG. Tối đa 5MB.</p>
          </div>
        </div>

        {/* KHU VỰC TEXT */}
        <Input 
            label="Tên công ty (Bắt buộc)" 
            name="companyName" 
            value={formData.companyName} 
            onChange={handleChange} 
            required 
        />
        
        <Input 
            label="Trang web chính thức" 
            type="url" 
            name="website" 
            value={formData.website} 
            onChange={handleChange} 
            placeholder="https://..." 
        />
        
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Giới thiệu văn hóa công ty</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="6"
            placeholder="Mô tả quy mô, ngành nghề, văn hóa công ty..."
            className="border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          ></textarea>
        </div>

        <div className="flex justify-end pt-4 border-t border-gray-100">
          <Button type="submit" isLoading={isLoading}>
            {isUpdateMode ? 'Lưu Thay Đổi' : 'Tạo Hồ Sơ Mới'}
          </Button>
        </div>

      </form>
    </div>
  );
}
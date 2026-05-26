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
  
  // Thêm state để lưu trạng thái kiểm duyệt
  const [verificationStatus, setVerificationStatus] = useState(null);

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
        
        // Cập nhật trạng thái kiểm duyệt từ API
        setVerificationStatus(res.data.verificationStatus);

        if (res.data.logoUrl) {
          setLogoPreview(`http://localhost:8080${res.data.logoUrl}`);
        }
        setIsUpdateMode(true); 
      }
    } catch (error) {
      console.log("Chưa có hồ sơ, ở chế độ Tạo mới");
      setIsUpdateMode(false);
    }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file)); 
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatusMsg({ type: null, message: '' });
    
    try {
      if (isUpdateMode) {
        await employerService.updateProfile(userId, formData);
      } else {
        await employerService.createProfile(userId, formData);
        setIsUpdateMode(true); 
      }

      if (logoFile) {
        await employerService.uploadLogo(userId, logoFile);
      }

      setStatusMsg({ type: 'success', message: 'Cập nhật hồ sơ thành công. Đang chờ Admin kiểm duyệt!' });
      
      // Load lại profile để lấy trạng thái PENDING mới nhất từ Database
      await fetchProfile(userId);
      
    } catch (err) {
      setStatusMsg({ type: 'error', message: err.response?.data?.message || 'Lỗi khi cập nhật hồ sơ.' });
    } finally {
      setIsLoading(false);
    }
  };

  // Hàm render giao diện cho trạng thái
  const renderStatusBadge = () => {
    if (!verificationStatus) return null;
    
    switch (verificationStatus) {
      case 'APPROVED':
        return <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">Đã duyệt (Hoạt động)</span>;
      case 'REJECTED':
        return <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-semibold">Bị từ chối / Cần chỉnh sửa</span>;
      case 'PENDING':
      default:
        return <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-semibold">Đang chờ kiểm duyệt</span>;
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 max-w-3xl">
      {/* Cập nhật khu vực Tiêu đề để hiển thị Badge trạng thái */}
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h2 className="text-xl font-bold text-gray-800">Hồ sơ Doanh nghiệp</h2>
        {isUpdateMode && renderStatusBadge()}
      </div>
      
      {statusMsg.type && <div className="mb-4"><Toast type={statusMsg.type} message={statusMsg.message} /></div>}

      {verificationStatus === 'REJECTED' && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm">
          <strong>Lưu ý:</strong> Hồ sơ của bạn đã bị từ chối. Vui lòng cập nhật lại thông tin chính xác và bấm "Lưu Thay Đổi" để gửi yêu cầu duyệt lại.
        </div>
      )}

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
            {isUpdateMode ? 'Lưu Thay Đổi (Gửi duyệt lại)' : 'Tạo Hồ Sơ Mới'}
          </Button>
        </div>

      </form>
    </div>
  );
}
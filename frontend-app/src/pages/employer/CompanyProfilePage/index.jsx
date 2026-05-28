import React, { useState, useEffect } from 'react';
import { Building2, Globe, FileText, Camera, CheckCircle, AlertCircle, Clock, Edit2, X } from 'lucide-react';
import employerService from '../../../features/employer/employerService';
import authService from '../../../features/auth/authService';
import Input from '../../../components/common/Input';
import Button from '../../../components/common/Button';
import Toast from '../../../components/common/Toast';

export default function CompanyProfilePage() {
  const [userId, setUserId] = useState(null);
  
  // Trạng thái Form & Dữ liệu
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ companyName: '', website: '', description: '' });
  const [originalData, setOriginalData] = useState({ companyName: '', website: '', description: '' });
  const [verificationStatus, setVerificationStatus] = useState(null);

  // Xử lý Logo
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [originalLogo, setOriginalLogo] = useState(null);

  // Trạng thái UI
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
        const fetchedData = {
          companyName: res.data.companyName || '',
          website: res.data.website || '',
          description: res.data.description || ''
        };
        
        setFormData(fetchedData);
        setOriginalData(fetchedData);
        setVerificationStatus(res.data.verificationStatus);

        if (res.data.logoUrl) {
          const fullLogoUrl = `http://localhost:8080${res.data.logoUrl}`;
          setLogoPreview(fullLogoUrl);
          setOriginalLogo(fullLogoUrl);
        }
        
        setIsUpdateMode(true); 
        setIsEditing(false);
      }
    } catch (error) {
      setIsUpdateMode(false);
      setIsEditing(true); // Bắt buộc nhập nếu chưa có hồ sơ
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

  const handleCancelEdit = () => {
    setFormData(originalData);
    setLogoPreview(originalLogo);
    setLogoFile(null);
    setIsEditing(false);
    setStatusMsg({ type: null, message: '' });
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
      }

      if (logoFile) {
        await employerService.uploadLogo(userId, logoFile);
      }

      setStatusMsg({ type: 'success', message: 'Hồ sơ đã được lưu! Đang chờ Quản trị viên kiểm duyệt.' });
      await fetchProfile(userId);
      setLogoFile(null);
      
    } catch (err) {
      setStatusMsg({ type: 'error', message: err.response?.data?.message || 'Có lỗi xảy ra khi cập nhật hồ sơ.' });
    } finally {
      setIsLoading(false);
    }
  };

  // UI Components helpers
  const StatusBanner = () => {
    if (!verificationStatus) return null;
    
    const statusConfig = {
      APPROVED: { icon: <CheckCircle className="w-5 h-5 text-green-600" />, bg: 'bg-green-50 border-green-200', text: 'text-green-700', label: 'Hồ sơ đã được phê duyệt và đang hoạt động.' },
      REJECTED: { icon: <AlertCircle className="w-5 h-5 text-red-600" />, bg: 'bg-red-50 border-red-200', text: 'text-red-700', label: 'Hồ sơ bị từ chối. Vui lòng cập nhật lại thông tin cho chính xác.' },
      PENDING: { icon: <Clock className="w-5 h-5 text-yellow-600" />, bg: 'bg-yellow-50 border-yellow-200', text: 'text-yellow-700', label: 'Hồ sơ đang chờ Quản trị viên kiểm duyệt.' }
    };
    const config = statusConfig[verificationStatus] || statusConfig.PENDING;

    return (
      <div className={`flex items-center gap-3 p-4 mb-6 rounded-lg border ${config.bg} ${config.text}`}>
        {config.icon}
        <span className="text-sm font-medium">{config.label}</span>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto pb-10">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Hồ Sơ Doanh Nghiệp</h1>
          <p className="text-gray-500 text-sm mt-1">Quản lý thông tin và hình ảnh thương hiệu tuyển dụng của bạn.</p>
        </div>
        
        {isUpdateMode && !isEditing && (
          <Button onClick={() => setIsEditing(true)} className="flex items-center gap-2 shadow-sm">
            <Edit2 className="w-4 h-4" />
            Chỉnh sửa thông tin
          </Button>
        )}
      </div>

      {statusMsg.type && (
        <div className="mb-6">
          <Toast type={statusMsg.type} message={statusMsg.message} />
        </div>
      )}

      {isUpdateMode && !isEditing && <StatusBanner />}

      {/* Main Content Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        
        {/* --- CHẾ ĐỘ XEM (VIEW MODE) --- */}
        {!isEditing ? (
          <div className="p-8">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              {/* Logo Display */}
              <div className="w-32 h-32 flex-shrink-0 rounded-xl border border-gray-100 bg-gray-50 flex items-center justify-center p-2 shadow-sm">
                {logoPreview ? (
                  <img src={logoPreview} alt="Logo" className="w-full h-full object-contain rounded-lg" />
                ) : (
                  <Building2 className="w-12 h-12 text-gray-300" />
                )}
              </div>

              {/* Info Display */}
              <div className="flex-1 space-y-6 w-full">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {originalData.companyName || 'Chưa cập nhật tên công ty'}
                  </h2>
                  
                  {originalData.website && (
                    <a href={originalData.website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors text-sm font-medium">
                      <Globe className="w-4 h-4" />
                      {originalData.website}
                    </a>
                  )}
                </div>

                <div className="border-t border-gray-100 pt-6">
                  <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-800 mb-3">
                    <FileText className="w-5 h-5 text-gray-500" />
                    Giới thiệu công ty
                  </h3>
                  <div className="prose prose-sm max-w-none text-gray-600 whitespace-pre-wrap leading-relaxed">
                    {originalData.description ? originalData.description : <span className="italic text-gray-400">Chưa có thông tin mô tả. Hãy cập nhật để ứng viên hiểu thêm về bạn.</span>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (

        /* --- CHẾ ĐỘ SỬA (EDIT MODE) --- */
        <div className="p-8 bg-gray-50/50">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Cập nhật Logo */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Logo Doanh Nghiệp</label>
              <div className="flex items-center gap-6">
                <div className="relative w-28 h-28 rounded-xl border-2 border-dashed border-gray-300 bg-white flex items-center justify-center overflow-hidden group hover:border-blue-500 transition-colors">
                  {logoPreview ? (
                    <img src={logoPreview} alt="Preview" className="w-full h-full object-contain p-2" />
                  ) : (
                    <div className="text-center">
                      <Camera className="w-8 h-8 text-gray-400 mx-auto mb-1" />
                      <span className="text-[10px] text-gray-500 font-medium">Tải ảnh lên</span>
                    </div>
                  )}
                  {/* Lớp overlay khi hover vào ảnh để chọn file */}
                  <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <Camera className="w-6 h-6 text-white" />
                    <input type="file" accept="image/png, image/jpeg, image/jpg" onChange={handleFileChange} className="hidden" />
                  </label>
                </div>
                <div className="text-sm text-gray-500">
                  <p>Định dạng: JPG, PNG, JPEG.</p>
                  <p>Kích thước khuyên dùng: Hình vuông 400x400px.</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input 
                  label="Tên công ty (Bắt buộc)" 
                  name="companyName" 
                  value={formData.companyName} 
                  onChange={handleChange} 
                  required 
                  placeholder="VD: Công ty TNHH Worklify"
                  icon={<Building2 className="w-4 h-4 text-gray-400" />}
              />
              <Input 
                  label="Trang web chính thức" 
                  type="url" 
                  name="website" 
                  value={formData.website} 
                  onChange={handleChange} 
                  placeholder="https://..." 
                  icon={<Globe className="w-4 h-4 text-gray-400" />}
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Giới thiệu tổng quan</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="6"
                placeholder="Mô tả quy mô, lĩnh vực hoạt động, chế độ phúc lợi và văn hóa công ty..."
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all resize-y"
              ></textarea>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
              {isUpdateMode && (
                <Button type="button" variant="outline" onClick={handleCancelEdit} disabled={isLoading} className="flex items-center gap-2">
                  <X className="w-4 h-4" />
                  Hủy bỏ
                </Button>
              )}
              <Button type="submit" isLoading={isLoading} className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                {isUpdateMode ? 'Lưu thay đổi & Gửi duyệt' : 'Hoàn tất & Tạo hồ sơ'}
              </Button>
            </div>
          </form>
        </div>
        )}
      </div>
    </div>
  );
}
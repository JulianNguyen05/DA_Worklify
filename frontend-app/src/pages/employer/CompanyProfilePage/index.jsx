import React, { useState, useEffect } from 'react';
import employerService from '../../../features/employer/employerService';
import authService from '../../../features/auth/authService';
import Input from '../../../components/common/Input';
import Button from '../../../components/common/Button';
import Toast from '../../../components/common/Toast';

export default function CompanyProfilePage() {
  const [userId, setUserId] = useState(null);
  
  // State phân biệt hồ sơ đã tồn tại hay chưa
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  
  // State điều khiển chế độ Xem (View) hay Sửa (Edit)
  const [isEditing, setIsEditing] = useState(false);

  // State lưu dữ liệu form và dữ liệu gốc để so sánh
  const [formData, setFormData] = useState({ companyName: '', website: '', description: '' });
  const [originalData, setOriginalData] = useState({ companyName: '', website: '', description: '' });
  
  const [verificationStatus, setVerificationStatus] = useState(null);

  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [originalLogo, setOriginalLogo] = useState(null);

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
        setOriginalData(fetchedData); // Lưu lại bản gốc để đối chiếu
        setVerificationStatus(res.data.verificationStatus);

        if (res.data.logoUrl) {
          const fullLogoUrl = `http://localhost:8080${res.data.logoUrl}`;
          setLogoPreview(fullLogoUrl);
          setOriginalLogo(fullLogoUrl);
        }
        
        setIsUpdateMode(true); 
        setIsEditing(false); // Có data rồi thì mặc định là chế độ Xem
      }
    } catch (error) {
      console.log("Chưa có hồ sơ, ở chế độ Tạo mới");
      setIsUpdateMode(false);
      setIsEditing(true); // Chưa có data thì bắt buộc mở Form để tạo
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
    // Hủy sửa thì khôi phục lại dữ liệu gốc
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

      setStatusMsg({ type: 'success', message: 'Cập nhật hồ sơ thành công. Đang chờ Admin kiểm duyệt!' });
      
      // Load lại profile để lấy trạng thái PENDING mới nhất
      await fetchProfile(userId);
      setLogoFile(null); // Reset file upload state
      
    } catch (err) {
      setStatusMsg({ type: 'error', message: err.response?.data?.message || 'Lỗi khi cập nhật hồ sơ.' });
    } finally {
      setIsLoading(false);
    }
  };

  // Helper kiểm tra xem field nào đã bị thay đổi
  const isModified = (fieldName) => isUpdateMode && formData[fieldName] !== originalData[fieldName];
  const isLogoModified = logoFile !== null;

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
      
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h2 className="text-xl font-bold text-gray-800">Hồ sơ Doanh nghiệp</h2>
        <div className="flex items-center gap-3">
          {isUpdateMode && renderStatusBadge()}
          {!isEditing && isUpdateMode && (
            <Button variant="outline" onClick={() => setIsEditing(true)} className="px-3 py-1 text-sm border-blue-600 text-blue-600 hover:bg-blue-50">
              Chỉnh sửa hồ sơ
            </Button>
          )}
        </div>
      </div>
      
      {statusMsg.type && <div className="mb-4"><Toast type={statusMsg.type} message={statusMsg.message} /></div>}

      {verificationStatus === 'REJECTED' && !isEditing && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm">
          <strong>Lưu ý:</strong> Hồ sơ của bạn đã bị từ chối kiểm duyệt. Vui lòng bấm <b>Chỉnh sửa hồ sơ</b> để khắc phục thông tin.
        </div>
      )}

      {/* --- GIAO DIỆN CHẾ ĐỘ XEM (VIEW MODE) --- */}
      {!isEditing ? (
        <div className="flex flex-col gap-6 text-gray-700 text-sm">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-gray-50 border border-gray-200 rounded-md flex items-center justify-center overflow-hidden">
              {logoPreview ? (
                <img src={logoPreview} alt="Logo" className="w-full h-full object-contain" />
              ) : (
                <span className="text-xs text-gray-400">Chưa có Logo</span>
              )}
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">{originalData.companyName || 'Chưa cập nhật tên'}</h3>
              <p className="mt-1">Website: {originalData.website ? <a href={originalData.website} className="text-blue-600 hover:underline" target="_blank" rel="noreferrer">{originalData.website}</a> : 'Chưa cập nhật'}</p>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 mb-2 border-b pb-1">Giới thiệu văn hóa công ty</h4>
            <p className="whitespace-pre-wrap leading-relaxed">{originalData.description || 'Chưa có thông tin mô tả.'}</p>
          </div>
        </div>
      ) : (

      /* --- GIAO DIỆN CHẾ ĐỘ SỬA (EDIT MODE) --- */
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        
        <div className="flex items-center gap-6 p-4 bg-gray-50 border rounded-md relative">
          {isLogoModified && <span className="absolute top-2 right-2 bg-orange-100 text-orange-600 px-2 py-0.5 text-[10px] rounded-full font-bold">Đã đổi ảnh</span>}
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
          </div>
        </div>

        <div className="relative">
          {isModified('companyName') && <span className="absolute right-0 top-0 text-[10px] text-orange-600 font-bold bg-orange-100 px-2 rounded-full">Đã chỉnh sửa</span>}
          <Input 
              label="Tên công ty (Bắt buộc)" 
              name="companyName" 
              value={formData.companyName} 
              onChange={handleChange} 
              required 
          />
        </div>
        
        <div className="relative">
          {isModified('website') && <span className="absolute right-0 top-0 text-[10px] text-orange-600 font-bold bg-orange-100 px-2 rounded-full">Đã chỉnh sửa</span>}
          <Input 
              label="Trang web chính thức" 
              type="url" 
              name="website" 
              value={formData.website} 
              onChange={handleChange} 
              placeholder="https://..." 
          />
        </div>
        
        <div className="flex flex-col gap-1 relative">
          <div className="flex justify-between items-end">
            <label className="text-sm font-medium text-gray-700">Giới thiệu văn hóa công ty</label>
            {isModified('description') && <span className="text-[10px] text-orange-600 font-bold bg-orange-100 px-2 rounded-full">Đã chỉnh sửa</span>}
          </div>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="6"
            placeholder="Mô tả quy mô, ngành nghề, văn hóa công ty..."
            className={`border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 ${isModified('description') ? 'border-orange-300 focus:border-orange-500 focus:ring-orange-100' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-100'}`}
          ></textarea>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          {isUpdateMode && (
            <Button type="button" variant="outline" onClick={handleCancelEdit} disabled={isLoading}>
              Hủy
            </Button>
          )}
          <Button type="submit" isLoading={isLoading}>
            {isUpdateMode ? 'Lưu Thay Đổi (Gửi duyệt lại)' : 'Tạo Hồ Sơ Mới'}
          </Button>
        </div>

      </form>
      )}
    </div>
  );
}
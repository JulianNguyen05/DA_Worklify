import React, { useState } from 'react';
import Input from '../../../components/common/Input';
import Button from '../../../components/common/Button';
import Toast from '../../../components/common/Toast';
// import authService from '../../../features/auth/authService';

export default function SettingsPage() {
  const userId = 2; // Mock ID người dùng hiện tại
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [isMfaEnabled, setIsMfaEnabled] = useState(false); // Trạng thái MFA giả định
  const [statusMsg, setStatusMsg] = useState({ type: null, message: '' });
  const [isLoading, setIsLoading] = useState({ password: false, mfa: false });

  const handlePasswordChange = (e) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
  };

  const submitPasswordChange = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setStatusMsg({ type: 'error', message: 'Mật khẩu xác nhận không khớp!' });
      return;
    }

    setIsLoading(prev => ({ ...prev, password: true }));
    setStatusMsg({ type: null, message: '' });

    try {
      // Giả lập gọi API đổi mật khẩu
      // await authService.changePassword(userId, passwordForm);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setStatusMsg({ type: 'success', message: 'Đổi mật khẩu thành công!' });
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setStatusMsg({ type: 'error', message: 'Mật khẩu hiện tại không đúng hoặc có lỗi xảy ra.' });
    } finally {
      setIsLoading(prev => ({ ...prev, password: false }));
    }
  };

  const handleEnableMfa = async () => {
    setIsLoading(prev => ({ ...prev, mfa: true }));
    setStatusMsg({ type: null, message: '' });

    try {
      // Gọi API kích hoạt MFA theo đặc tả Backend
      // await authService.enableMfa(userId);
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setIsMfaEnabled(true);
      setStatusMsg({ type: 'success', message: 'Kích hoạt Xác thực đa yếu tố (MFA) thành công!' });
    } catch (err) {
      setStatusMsg({ type: 'error', message: 'Không thể kích hoạt MFA lúc này.' });
    } finally {
      setIsLoading(prev => ({ ...prev, mfa: false }));
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      <h2 className="text-xl font-bold text-gray-800">Cài đặt tài khoản</h2>
      
      {statusMsg.type && <Toast type={statusMsg.type} message={statusMsg.message} />}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Box Đổi mật khẩu */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Đổi mật khẩu</h3>
          <form onSubmit={submitPasswordChange} className="flex flex-col gap-4">
            <Input 
              label="Mật khẩu hiện tại" 
              type="password" 
              name="currentPassword" 
              value={passwordForm.currentPassword} 
              onChange={handlePasswordChange} 
              required 
            />
            <Input 
              label="Mật khẩu mới" 
              type="password" 
              name="newPassword" 
              value={passwordForm.newPassword} 
              onChange={handlePasswordChange} 
              required 
            />
            <Input 
              label="Xác nhận mật khẩu mới" 
              type="password" 
              name="confirmPassword" 
              value={passwordForm.confirmPassword} 
              onChange={handlePasswordChange} 
              required 
            />
            <Button type="submit" isLoading={isLoading.password} className="mt-2">
              Cập nhật mật khẩu
            </Button>
          </form>
        </div>

        <div className="space-y-6">
          {/* Box Bảo mật 2 lớp (MFA) */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Bảo mật nâng cao</h3>
            <p className="text-sm text-gray-600 mb-4">
              Xác thực đa yếu tố (MFA) giúp tăng cường bảo mật cho tài khoản của bạn bằng cách yêu cầu mã xác nhận khi đăng nhập.
            </p>
            
            {isMfaEnabled ? (
              <div className="flex items-center gap-2 text-green-600 font-medium bg-green-50 p-3 rounded-md border border-green-200">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                Đã kích hoạt MFA
              </div>
            ) : (
              <Button 
                variant="outline" 
                onClick={handleEnableMfa} 
                isLoading={isLoading.mfa}
                className="w-full border-blue-600 text-blue-600 hover:bg-blue-50"
              >
                Kích hoạt MFA ngay
              </Button>
            )}
          </div>

          {/* Box Tùy chỉnh thông báo */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Tùy chỉnh thông báo</h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" defaultChecked />
                <span className="text-sm text-gray-700">Nhận email khi có ứng viên mới nộp hồ sơ</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" defaultChecked />
                <span className="text-sm text-gray-700">Nhận bản tin hệ thống từ SmartMatch</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
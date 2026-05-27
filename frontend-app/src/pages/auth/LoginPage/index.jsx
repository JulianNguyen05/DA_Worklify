import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Input from '../../../components/common/Input';
import Button from '../../../components/common/Button';
import Toast from '../../../components/common/Toast';
import authService from '../../../features/auth/authService';

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'info' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const closeToast = () => setToast({ show: false, message: '', type: 'info' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    closeToast();

    try {
      const response = await authService.login(formData);
      const { token, role } = response.data; 

      localStorage.setItem('accessToken', token);
      localStorage.setItem('userRole', role);

      setToast({
        show: true,
        message: 'Đăng nhập thành công! Đang chuyển hướng...',
        type: 'success'
      });

      setTimeout(() => {
        if (role === 'CANDIDATE') {
          navigate('/candidate/dashboard');
        } else if (role === 'EMPLOYER') {
          navigate('/employer/dashboard');
        } else if (role === 'ADMIN') {
          navigate('/admin/dashboard');
        } else {
          navigate('/');
        }
      }, 1500);

    } catch (err) {
      console.error("Lỗi đăng nhập:", err);
      let errorMessage = 'Đăng nhập thất bại. Vui lòng kiểm tra lại email hoặc mật khẩu!';
      
      if (err.response && err.response.data) {
        const data = err.response.data;
        if (data.message) {
          errorMessage = data.message;
        } else if (typeof data === "string") {
          errorMessage = data;
        }
      } else if (err.message === "Network Error") {
        errorMessage = "Không thể kết nối đến máy chủ. Vui lòng kiểm tra mạng hoặc Backend!";
      }

      setToast({
        show: true,
        message: errorMessage,
        type: 'error'
      });
      
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full space-y-6 animate-fade-in">
      {/* Form Header */}
      <div className="space-y-1.5">
        <h2 className="text-2xl font-bold tracking-tight text-[#0F172A]">
          Chào mừng trở lại
        </h2>
        <p className="text-sm text-[#64748B]">
          Đăng nhập vào Worklify để quản lý hành trình của bạn.
        </p>
      </div>

      {/* Form Handle */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Hệ thống thông báo Toast (Được đẩy gọn gàng ngay đầu form) */}
        {toast.show && (
          <div className={toast.type === 'error' ? 'animate-shake' : ''}>
            <Toast 
              type={toast.type} 
              message={toast.message} 
              onClose={closeToast} 
            />
          </div>
        )}
        
        {/* Các ô Input đồng điệu hệ thống thiết kế cao cấp */}
        <div className="space-y-4">
          <Input 
            label="Địa chỉ Email" 
            type="email" 
            name="email" 
            value={formData.email} 
            onChange={handleChange} 
            required 
            placeholder="name@company.com"
            className="w-full rounded-xl border-[#E2E8F0] focus:border-[#2563EB] focus:ring-[#2563EB]/20 transition-all text-sm"
          />
          <Input 
            label="Mật khẩu" 
            type="password" 
            name="password" 
            value={formData.password} 
            onChange={handleChange} 
            required 
            placeholder="••••••••"
            className="w-full rounded-xl border-[#E2E8F0] focus:border-[#2563EB] focus:ring-[#2563EB]/20 transition-all text-sm"
          />
        </div>
        
        {/* Tiện ích ghi nhớ & khôi phục mật khẩu */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center">
            <input 
              id="remember-me" 
              name="remember-me" 
              type="checkbox" 
              className="h-4 w-4 text-[#2563EB] focus:ring-[#2563EB]/20 border-[#E2E8F0] rounded-md cursor-pointer transition-all" 
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-[#334155] font-medium cursor-pointer select-none">
              Ghi nhớ đăng nhập
            </label>
          </div>
          <Link to="/auth/forgot-password" className="font-semibold text-[#2563EB] hover:text-[#1D4ED8] transition-colors">
            Quên mật khẩu?
          </Link>
        </div>

        {/* Nút Đăng nhập với hiệu ứng Loading mượt mà */}
        <Button 
          type="submit" 
          disabled={isLoading}
          className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] disabled:bg-[#2563EB]/60 text-white py-3 rounded-xl font-medium tracking-wide shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center text-sm"
        >
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Đang xác thực...</span>
            </div>
          ) : 'Đăng nhập vào hệ thống'}
        </Button>
      </form>

      {/* Chuyển hướng nhanh sang trang Đăng ký */}
      <div className="pt-4 border-t border-[#F1F5F9] text-center text-sm text-[#64748B]">
        Chưa có tài khoản?{' '}
        <Link to="/auth/register" className="font-semibold text-[#2563EB] hover:text-[#1D4ED8] transition-colors">
          Đăng ký ngay
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;
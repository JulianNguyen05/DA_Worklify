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
    <div className="w-full space-y-7 animate-fade-in">
      {/* Form Header */}
      <div className="space-y-2">
        <h2 className="text-[26px] font-extrabold tracking-tight text-[#0F172A]">
          Chào mừng trở lại
        </h2>
        <p className="text-[15px] font-medium text-[#64748B]">
          Đăng nhập vào Worklify để quản lý hành trình của bạn.
        </p>
      </div>

      {/* Form Handle */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Hệ thống thông báo Toast */}
        {toast.show && (
          <div className={toast.type === 'error' ? 'animate-shake' : ''}>
            <Toast 
              type={toast.type} 
              message={toast.message} 
              onClose={closeToast} 
            />
          </div>
        )}
        
        {/* Các ô Input */}
        <div className="space-y-4">
          <Input 
            label="Địa chỉ Email" 
            type="email" 
            name="email" 
            value={formData.email} 
            onChange={handleChange} 
            required 
            placeholder="name@company.com"
            className="w-full rounded-xl border-[#E2E8F0] focus:border-[#2563EB] focus:ring-[#2563EB]/20 transition-all text-[15px] font-medium placeholder:font-normal text-[#0F172A]"
          />
          <Input 
            label="Mật khẩu" 
            type="password" 
            name="password" 
            value={formData.password} 
            onChange={handleChange} 
            required 
            placeholder="••••••••"
            className="w-full rounded-xl border-[#E2E8F0] focus:border-[#2563EB] focus:ring-[#2563EB]/20 transition-all text-[15px] font-medium placeholder:font-normal text-[#0F172A]"
          />
        </div>
        
        {/* Tiện ích ghi nhớ & khôi phục mật khẩu */}
        <div className="flex items-center justify-between text-[14px]">
          <div className="flex items-center group cursor-pointer">
            <input 
              id="remember-me" 
              name="remember-me" 
              type="checkbox" 
              className="h-4 w-4 text-[#2563EB] focus:ring-[#2563EB]/20 border-[#E2E8F0] rounded cursor-pointer transition-all" 
            />
            <label htmlFor="remember-me" className="ml-2 block text-[#475569] font-medium cursor-pointer select-none group-hover:text-[#0F172A] transition-colors">
              Ghi nhớ đăng nhập
            </label>
          </div>
          <Link to="/auth/forgot-password" className="font-semibold text-[#2563EB] hover:text-[#1D4ED8] transition-colors no-underline">
            Quên mật khẩu?
          </Link>
        </div>

        {/* Nút Đăng nhập - Đồng bộ style với nút "Đăng ký miễn phí" trên Navbar */}
        <Button 
          type="submit" 
          disabled={isLoading}
          className="w-full text-white py-3 rounded-xl font-bold tracking-wide transition-all duration-200 flex items-center justify-center text-[15px] disabled:opacity-70"
          style={{
            background: 'linear-gradient(135deg, #2563EB 0%, #1d4ed8 100%)',
            boxShadow: '0 4px 14px rgba(37,99,235,0.25)',
          }}
          onMouseEnter={(e) => { 
            if (!isLoading) {
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(37,99,235,0.4)'; 
              e.currentTarget.style.transform = 'translateY(-1px)'; 
            }
          }}
          onMouseLeave={(e) => { 
            if (!isLoading) {
              e.currentTarget.style.boxShadow = '0 4px 14px rgba(37,99,235,0.25)'; 
              e.currentTarget.style.transform = 'translateY(0)'; 
            }
          }}
        >
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Đang xác thực...</span>
            </div>
          ) : 'Đăng nhập vào hệ thống'}
        </Button>
      </form>

      {/* Chuyển hướng nhanh sang trang Đăng ký */}
      <div className="pt-5 border-t border-[#F1F5F9] text-center text-[14px] font-medium text-[#64748B]">
        Chưa có tài khoản?{' '}
        <Link to="/auth/register" className="font-bold text-[#2563EB] hover:text-[#1D4ED8] transition-colors ml-1 no-underline">
          Đăng ký ngay
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;
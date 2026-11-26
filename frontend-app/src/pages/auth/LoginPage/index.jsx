import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Input from '../../../components/common/Input';
import Button from '../../../components/common/Button';
import Toast from '../../../components/common/Toast';
import { Mail, Lock, ArrowRight } from 'lucide-react';
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
      <div className="space-y-2">
        <h2 className="font-display text-2xl font-bold tracking-tight text-slate-900">
          Chào mừng trở lại
        </h2>
        <p className="text-sm text-slate-500">
          Đăng nhập vào Worklify để quản lý hành trình của bạn.
        </p>
      </div>

      {/* Form Handle */}
      <form onSubmit={handleSubmit} className="space-y-5">
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
            label="Địa chỉ Email" icon={Mail} 
            type="email" 
            name="email" 
            value={formData.email} 
            onChange={handleChange} 
            required 
            placeholder="name@company.com"
          />
          <Input 
            label="Mật khẩu" icon={Lock} 
            type="password" 
            name="password" 
            value={formData.password} 
            onChange={handleChange} 
            required 
            placeholder="••••••••"
          />
        </div>
        
        {/* Tiện ích ghi nhớ & khôi phục mật khẩu */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center group cursor-pointer">
            <input 
              id="remember-me" 
              name="remember-me" 
              type="checkbox" 
              className="h-4 w-4 cursor-pointer rounded border-slate-300 accent-brand-600" 
            />
            <label htmlFor="remember-me" className="ml-2 block text-slate-600 font-medium cursor-pointer select-none group-hover:text-slate-900 transition-colors">
              Ghi nhớ đăng nhập
            </label>
          </div>
          <Link to="/auth/forgot-password" className="font-semibold text-brand-600 hover:text-brand-700 transition-colors no-underline">
            Quên mật khẩu?
          </Link>
        </div>

        {/* Nút Đăng nhập - Đồng bộ style với nút "Đăng ký miễn phí" trên Navbar */}
        <Button type="submit" size="lg" isLoading={isLoading} className="w-full">
          {isLoading ? 'Đang xác thực...' : 'Đăng nhập'}
          {!isLoading && <ArrowRight className="h-4 w-4" />}
        </Button>
      </form>

      {/* Chuyển hướng nhanh sang trang Đăng ký */}
      <div className="border-t border-slate-100 pt-5 text-center text-sm text-slate-500">
        Chưa có tài khoản?{' '}
        <Link to="/auth/register" className="font-semibold text-brand-600 hover:text-brand-700 transition-colors ml-1 no-underline">
          Đăng ký ngay
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;
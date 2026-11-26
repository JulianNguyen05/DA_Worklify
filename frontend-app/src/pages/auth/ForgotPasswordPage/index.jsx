import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Input from '../../../components/common/Input';
import Button from '../../../components/common/Button';
import Toast from '../../../components/common/Toast';
import authService from '../../../features/auth/authService';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'info' });

  const closeToast = () => setToast({ show: false, message: '', type: 'info' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    closeToast();

    try {
      await authService.forgotPassword(email);
      
      setToast({ 
        show: true,
        type: 'success', 
        message: 'Yêu cầu đã được gửi! Vui lòng kiểm tra hộp thư đến (hoặc Spam) của bạn để đặt lại mật khẩu.' 
      });
      setEmail('');

    } catch (err) {
      console.error("Lỗi quên mật khẩu:", err);

      let errorMessage = 'Không tìm thấy tài khoản với email này hoặc có lỗi xảy ra.';
      
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
        type: 'error', 
        message: errorMessage 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full space-y-6 animate-fade-in">
      {/* Form Header */}
      <div className="space-y-2">
        <h2 className="font-display text-2xl font-bold tracking-tight text-slate-900">
          Khôi phục mật khẩu
        </h2>
        <p className="text-sm leading-relaxed text-slate-500">
          Nhập địa chỉ email liên kết với tài khoản Worklify, chúng tôi sẽ hướng dẫn bạn đặt lại mật khẩu mới.
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
        
        {/* Input Field */}
        <div className="space-y-4">
          <Input 
            label="Email xác thực" 
            type="email" 
            name="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
            placeholder="name@company.com"
          />
        </div>

        {/* Nút Submit Đăng Ký - Đồng bộ style Nút MainLayout */}
        <Button type="submit" size="lg" isLoading={isLoading} className="w-full">
          {isLoading ? 'Đang gửi mã...' : 'Gửi yêu cầu xác thực'}
        </Button>
      </form>

      {/* Nút quay lại trang Đăng nhập */}
      <div className="pt-5 border-t border-slate-100 text-center">
        <Link 
          to="/auth/login" 
          className="inline-flex items-center justify-center gap-1.5 text-sm font-semibold text-brand-600 hover:text-brand-700 transition-colors group no-underline"
        >
          <svg 
            className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform duration-200" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Quay lại đăng nhập
        </Link>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
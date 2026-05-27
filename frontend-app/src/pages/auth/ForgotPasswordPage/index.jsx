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
      <div className="space-y-1.5">
        <h2 className="text-2xl font-bold tracking-tight text-[#0F172A]">
          Khôi phục mật khẩu
        </h2>
        <p className="text-sm text-[#64748B] leading-relaxed">
          Nhập địa chỉ email liên kết với tài khoản Worklify, chúng tôi sẽ hướng dẫn bạn đặt lại mật khẩu mới.
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
            className="w-full rounded-xl border-[#E2E8F0] focus:border-[#2563EB] focus:ring-[#2563EB]/20 transition-all text-sm"
          />
        </div>

        {/* Nút Submit với hiệu ứng Spinner chuyên nghiệp */}
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
              <span>Đang gửi mã...</span>
            </div>
          ) : 'Gửi yêu cầu xác thực'}
        </Button>
      </form>

      {/* Nút quay lại trang Đăng nhập được thiết kế tinh giản */}
      <div className="pt-4 border-t border-[#F1F5F9] text-center">
        <Link 
          to="/auth/login" 
          className="inline-flex items-center justify-center gap-1.5 text-sm font-semibold text-[#2563EB] hover:text-[#1D4ED8] transition-colors group"
        >
          <svg 
            className="w-4 h-4 transform group-hover:-translate-x-0.5 transition-transform duration-200" 
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
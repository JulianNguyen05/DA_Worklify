import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Input from '../../../components/common/Input';
import Button from '../../../components/common/Button';
import Toast from '../../../components/common/Toast';
import authService from '../../../features/auth/authService';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Đồng bộ state toast giống như trang Login và Register
  const [toast, setToast] = useState({ show: false, message: '', type: 'info' });

  const closeToast = () => setToast({ show: false, message: '', type: 'info' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    closeToast();

    try {
      await authService.forgotPassword(email);
      
      // Hiển thị thông báo thành công
      setToast({ 
        show: true,
        type: 'success', 
        message: 'Yêu cầu đã được gửi! Vui lòng kiểm tra hộp thư đến (hoặc Spam) của bạn để đặt lại mật khẩu.' 
      });
      setEmail(''); // Xóa nội dung input sau khi gửi thành công

    } catch (err) {
      console.error("Lỗi quên mật khẩu:", err);

      // Bóc tách lỗi từ Backend giống như trang Login
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
    <div className="w-full max-w-md space-y-8">
      <div>
        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
          Khôi phục mật khẩu
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Nhập địa chỉ email liên kết với tài khoản của bạn và chúng tôi sẽ gửi cho bạn hướng dẫn để đặt lại mật khẩu.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        
        {/* Tích hợp Toast dùng chung */}
        {toast.show && (
          <div className={toast.type === 'error' ? 'animate-shake' : ''}>
            <Toast 
              type={toast.type} 
              message={toast.message} 
              onClose={closeToast} 
            />
          </div>
        )}
        
        <div className="space-y-4">
          <Input 
            label="Email xác thực" 
            type="email" 
            name="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
            placeholder="Nhập email của bạn"
          />
        </div>

        <Button 
          type="submit" 
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-md font-semibold transition-all"
        >
          {isLoading ? 'Đang gửi yêu cầu...' : 'Gửi yêu cầu'}
        </Button>
      </form>

      <div className="mt-8 text-center text-sm">
        <Link 
          to="/auth/login" 
          className="font-medium text-blue-600 hover:text-blue-500 flex items-center justify-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Quay lại đăng nhập
        </Link>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
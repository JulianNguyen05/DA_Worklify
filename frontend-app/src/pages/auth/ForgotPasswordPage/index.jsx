import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from '../../../components/layout/AuthLayout';
import Input from '../../../components/common/Input';
import Button from '../../../components/common/Button';
import Toast from '../../../components/common/Toast';
import authService from '../../../features/auth/authService';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState({ type: null, message: '' }); // Dùng chung state cho cả success và error

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus({ type: null, message: '' });

    try {
      await authService.forgotPassword(email);
      // Hiển thị thông báo thành công và chặn form (tùy chọn)
      setStatus({ 
        type: 'success', 
        message: 'Yêu cầu khôi phục mật khẩu đã được gửi! Vui lòng kiểm tra hộp thư đến (hoặc thư mục Spam) của bạn.' 
      });
      setEmail(''); // Xóa nội dung input sau khi gửi thành công
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Không tìm thấy tài khoản với email này hoặc có lỗi xảy ra.';
      setStatus({ type: 'error', message: errorMsg });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout title="Khôi phục mật khẩu">
      <div className="mb-6 text-sm text-gray-600 text-center">
        Nhập địa chỉ email liên kết với tài khoản của bạn và chúng tôi sẽ gửi cho bạn hướng dẫn để đặt lại mật khẩu.
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {status.type && <Toast type={status.type} message={status.message} />}
        
        <Input 
          label="Email xác thực" 
          type="email" 
          name="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
          placeholder="Nhập email của bạn"
        />

        <Button type="submit" isLoading={isLoading} className="w-full mt-2">
          Gửi yêu cầu
        </Button>

        <div className="text-center mt-4 text-sm">
          <Link to="/auth/login" className="text-blue-600 font-medium hover:underline flex items-center justify-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Quay lại đăng nhập
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
};

export default ForgotPasswordPage;
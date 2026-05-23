import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Input from '../../../components/common/Input';
import Button from '../../../components/common/Button';
import Toast from '../../../components/common/Toast'; // Import Toast Component
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
    closeToast(); // Reset thông báo trước khi gửi request

    try {
      // 1. Gọi API đăng nhập qua Service Layer
      const response = await authService.login(formData);

      // 2. Lấy dữ liệu token và role từ ApiResponse trả về
      const { token, role } = response.data; 

      // 3. Lưu Token và Role vào localStorage
      localStorage.setItem('accessToken', token);
      localStorage.setItem('userRole', role); // THÊM DÒNG NÀY

      // 4. Hiển thị thông báo thành công
      setToast({
        show: true,
        message: 'Đăng nhập thành công! Đang chuyển hướng...',
        type: 'success'
      });

      // 5. Đợi 1.5 giây để người dùng đọc thông báo rồi mới điều hướng
      setTimeout(() => {
        if (role === 'CANDIDATE') {
          navigate('/candidate/dashboard');
        } else if (role === 'EMPLOYER') {
          navigate('/employer/dashboard');
        } else if (role === 'ADMIN') {
          navigate('/admin/dashboard');
        } else {
          navigate('/'); // Fallback
        }
      }, 1500);

    } catch (err) {
      console.error("Lỗi đăng nhập:", err);
      
      let errorMessage = 'Đăng nhập thất bại. Vui lòng kiểm tra lại email hoặc mật khẩu!';
      
      // Bóc tách lỗi từ Backend
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

      // Hiển thị lỗi lên Toast
      setToast({
        show: true,
        message: errorMessage,
        type: 'error'
      });
      
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-8">
      <div>
        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
          Chào mừng trở lại
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Đăng nhập vào SmartMatch để tiếp tục hành trình của bạn.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        
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
            label="Địa chỉ Email" 
            type="email" 
            name="email" 
            value={formData.email} 
            onChange={handleChange} 
            required 
            placeholder="Nhập email của bạn"
          />
          <Input 
            label="Mật khẩu" 
            type="password" 
            name="password" 
            value={formData.password} 
            onChange={handleChange} 
            required 
            placeholder="Nhập mật khẩu"
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input 
              id="remember-me" 
              name="remember-me" 
              type="checkbox" 
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" 
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
              Ghi nhớ đăng nhập
            </label>
          </div>
          <div className="text-sm">
            <Link to="/auth/forgot-password" className="font-medium text-blue-600 hover:text-blue-500">
              Quên mật khẩu?
            </Link>
          </div>
        </div>

        <Button 
          type="submit" 
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-md font-semibold transition-all"
        >
          {isLoading ? 'Đang xác thực...' : 'Đăng nhập'}
        </Button>
      </form>

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Hoặc đăng nhập nhanh</span>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <button type="button" className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            Google
          </button>
          <button type="button" className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            LinkedIn
          </button>
        </div>
      </div>

      <p className="mt-8 text-center text-sm text-gray-600">
        Chưa có tài khoản?{' '}
        <Link to="/auth/register" className="font-medium text-blue-600 hover:text-blue-500">
          Đăng ký ngay
        </Link>
      </p>
    </div>
  );
};

export default LoginPage;
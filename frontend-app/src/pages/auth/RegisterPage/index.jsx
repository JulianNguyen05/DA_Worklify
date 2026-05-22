import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthLayout from '../../../components/layout/AuthLayout';
import Input from '../../../components/common/Input';
import Button from '../../../components/common/Button';
import Toast from '../../../components/common/Toast';
import authService from '../../../features/auth/authService';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'CANDIDATE' // Mặc định là ứng viên [cite: 49]
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp!');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Loại bỏ confirmPassword trước khi gửi lên API
      const { confirmPassword, ...registerData } = formData;
      await authService.register(registerData);
      
      // Nếu thành công, điều hướng về trang đăng nhập
      navigate('/auth/login', { state: { message: 'Đăng ký thành công! Vui lòng đăng nhập.' } });
    } catch (err) {
      // Backend của bạn trả về map validationErrors, có thể xử lý hiển thị ở đây [cite: 10, 11]
      const errorMsg = err.response?.data?.message || 'Đăng ký thất bại!';
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout title="Tạo tài khoản SmartMatch">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {error && <Toast type="error" message={error} />}

        {/* Lựa chọn loại tài khoản */}
        <div className="flex gap-4 mb-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input 
              type="radio" 
              name="role" 
              value="CANDIDATE" 
              checked={formData.role === 'CANDIDATE'} 
              onChange={handleChange} 
            />
            <span>Tôi là Ứng viên</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input 
              type="radio" 
              name="role" 
              value="EMPLOYER" 
              checked={formData.role === 'EMPLOYER'} 
              onChange={handleChange} 
            />
            <span>Tôi là Nhà tuyển dụng</span>
          </label>
        </div>
        
        <Input label="Họ và tên" type="text" name="fullName" value={formData.fullName} onChange={handleChange} required />
        <Input label="Email" type="email" name="email" value={formData.email} onChange={handleChange} required />
        <Input label="Mật khẩu" type="password" name="password" value={formData.password} onChange={handleChange} required />
        <Input label="Xác nhận mật khẩu" type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />

        <Button type="submit" isLoading={isLoading} className="w-full mt-4">
          Đăng ký
        </Button>

        <p className="text-center mt-4 text-sm text-gray-600">
          Đã có tài khoản? <Link to="/auth/login" className="text-blue-600 font-bold hover:underline">Đăng nhập</Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default RegisterPage;
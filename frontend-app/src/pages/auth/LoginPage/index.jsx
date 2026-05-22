import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthLayout from '../../../components/layout/AuthLayout';
import Input from '../../../components/common/Input';
import Button from '../../../components/common/Button';
import Toast from '../../../components/common/Toast'; // Giả sử bạn có component Toast để thông báo
import authService from '../../../features/auth/authService';

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await authService.login(formData);
      // Lưu token vào localStorage để axiosClient tự động đính kèm vào header sau này [cite: 232]
      localStorage.setItem('accessToken', res.data.token); 
      
      // Chuyển hướng dựa trên Role (Ứng viên hoặc NTD)
      if (res.data.role === 'CANDIDATE') {
        navigate('/candidate/dashboard');
      } else if (res.data.role === 'EMPLOYER') {
        navigate('/employer/dashboard');
      } else {
        navigate('/admin/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại!');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout title="Chào mừng trở lại SmartMatch">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {error && <Toast type="error" message={error} />}
        
        <Input 
          label="Email" 
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
        
        <div className="flex justify-between items-center text-sm">
          <Link to="/auth/forgot-password" className="text-blue-600 hover:underline">
            Quên mật khẩu?
          </Link>
        </div>

        <Button type="submit" isLoading={isLoading} className="w-full mt-4">
          Đăng nhập
        </Button>

        <p className="text-center mt-4 text-sm text-gray-600">
          Chưa có tài khoản? <Link to="/auth/register" className="text-blue-600 font-bold hover:underline">Đăng ký ngay</Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default LoginPage;
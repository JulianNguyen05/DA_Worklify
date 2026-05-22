import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Input from '../../../components/common/Input';
import Button from '../../../components/common/Button';

const RegisterPage = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    fullName: '',      
    companyName: '',   
    email: '',         
    password: '',      
    confirmPassword: '',
    role: 'CANDIDATE'  
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRoleChange = (role) => {
    setError(null);
    setFormData({ ...formData, role, fullName: '', companyName: '' });
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
      const payload = {
        email: formData.email,
        password: formData.password,
        role: formData.role,
        ...(formData.role === 'CANDIDATE' ? { fullName: formData.fullName } : { companyName: formData.companyName })
      };

      console.log("Dữ liệu gửi đi:", payload);
      
      setTimeout(() => {
        const successMsg = formData.role === 'EMPLOYER' 
            ? 'Đăng ký thành công! Vui lòng đăng nhập để cập nhật hồ sơ pháp lý.' 
            : 'Đăng ký thành công! Vui lòng đăng nhập.';
            
        navigate('/auth/login', { state: { message: successMsg } });
      }, 1000);

    } catch (err) {
      setError(err.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại!');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-8">
      <div>
        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
          Tạo tài khoản mới
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        {error && <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm">{error}</div>}

        <div className="flex bg-gray-100 p-1 rounded-lg">
          <button type="button" onClick={() => handleRoleChange('CANDIDATE')} className={`flex-1 text-center py-2 rounded-md text-sm font-medium transition-colors ${formData.role === 'CANDIDATE' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}>
            Ứng viên
          </button>
          <button type="button" onClick={() => handleRoleChange('EMPLOYER')} className={`flex-1 text-center py-2 rounded-md text-sm font-medium transition-colors ${formData.role === 'EMPLOYER' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}>
            Nhà tuyển dụng
          </button>
        </div>
        
        <div className="space-y-4">
          {formData.role === 'CANDIDATE' ? (
            <Input label="Họ và tên" type="text" name="fullName" value={formData.fullName} onChange={handleChange} required placeholder="VD: Nguyễn Văn A" />
          ) : (
            <Input label="Tên doanh nghiệp" type="text" name="companyName" value={formData.companyName} onChange={handleChange} required placeholder="VD: Công ty Cổ phần ABC" />
          )}

          <Input label="Địa chỉ Email" type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="Nhập email" />
          <Input label="Mật khẩu" type="password" name="password" value={formData.password} onChange={handleChange} required placeholder="Tạo mật khẩu" />
          <Input label="Xác nhận mật khẩu" type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required placeholder="Nhập lại mật khẩu" />
        </div>

        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-md font-semibold">
          {isLoading ? 'Đang xử lý...' : 'Đăng ký'}
        </Button>
      </form>
      <p className="mt-8 text-center text-sm text-gray-600">
        Đã có tài khoản? <Link to="/auth/login" className="font-medium text-blue-600 hover:text-blue-500">Đăng nhập ngay</Link>
      </p>
    </div>
  );
};

export default RegisterPage;
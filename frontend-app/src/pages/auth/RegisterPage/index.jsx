import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Input from "../../../components/common/Input";
import Button from "../../../components/common/Button";
import Toast from "../../../components/common/Toast";
import authService from "../../../features/auth/authService";

const RegisterPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    companyName: "",
    email: "",
    phone: "", // [ĐÃ THÊM] Bổ sung trường số điện thoại khớp với DB
    password: "",
    confirmPassword: "",
    role: "CANDIDATE",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "info" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRoleChange = (role) => {
    setToast({ show: false, message: "", type: "info" });
    setFormData({ ...formData, role, fullName: "", companyName: "" });
  };

  const closeToast = () => setToast({ show: false, message: "", type: "info" });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Kiểm tra trùng khớp mật khẩu phía Client
    if (formData.password !== formData.confirmPassword) {
      setToast({
        show: true,
        message: "Mật khẩu xác nhận không trùng khớp!",
        type: "error"
      });
      return;
    }

    setIsLoading(true);
    closeToast();

    try {
      // 2. Chuẩn hóa cấu trúc Payload động dựa theo vai trò (Role)
      // [ĐÃ SỬA] Thêm trường phone vào payload gửi lên API
      const payload = {
        email: formData.email,
        phone: formData.phone, 
        password: formData.password,
        role: formData.role,
        ...(formData.role === "CANDIDATE"
          ? { fullName: formData.fullName }
          : { companyName: formData.companyName }),
      };

      // 3. Thực hiện gọi API đăng ký thông qua Service Layer
      await authService.register(payload);

      // 4. Thiết lập nội dung thông báo thành công tương ứng
      const successMsg =
        formData.role === "EMPLOYER"
          ? "Đăng ký thành công! Đang chuyển hướng sang trang đăng nhập để bạn bổ sung hồ sơ doanh nghiệp..."
          : "Đăng ký thành công! Hệ thống đang chuyển hướng sang trang đăng nhập...";

      setToast({
        show: true,
        message: successMsg,
        type: "success"
      });

      // 5. Treo màn hình 2.5 giây cho người dùng đọc Toast rồi mới chuyển hướng
      setTimeout(() => {
        navigate("/auth/login");
      }, 2500);

    } catch (err) {
      console.error("Lỗi đăng ký:", err);

      // Trích xuất lỗi từ Backend trả về để đưa lên Toast
      let errorMessage = "Đăng ký thất bại. Vui lòng thử lại sau!";

      if (err.response && err.response.data) {
        const data = err.response.data;
        if (data.message) {
          errorMessage = data.message;
        } else if (data.error && typeof data.error === "string") {
          errorMessage = data.error;
        } else if (typeof data === "string") {
          errorMessage = data;
        }
      } else if (err.message === "Network Error") {
        errorMessage = "Không thể kết nối đến máy chủ. Vui lòng kiểm tra mạng hoặc Docker Backend!";
      }

      setToast({
        show: true,
        message: errorMessage,
        type: "error"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full space-y-7 animate-fade-in">
      {/* Form Header */}
      <div className="space-y-2">
        <h2 className="text-[26px] font-extrabold tracking-tight text-[#0F172A]">
          Tạo tài khoản mới
        </h2>
        <p className="text-[15px] font-medium text-[#64748B]">
          Bắt đầu hành trình tìm kiếm cơ hội cùng Worklify.
        </p>
      </div>

      {/* Form Handle */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Tích hợp Toast dùng chung */}
        {toast.show && (
          <div className={toast.type === "error" ? "animate-shake" : ""}>
            <Toast 
              type={toast.type} 
              message={toast.message} 
              onClose={closeToast} 
            />
          </div>
        )}

        {/* Bộ chuyển đổi Tab Vai Trò (Role Switcher) */}
        <div className="flex bg-[#F1F5F9] p-1.5 rounded-xl border border-[#E2E8F0]/50">
          <button
            type="button"
            onClick={() => handleRoleChange("CANDIDATE")}
            className={`flex-1 text-center py-2.5 rounded-lg text-[14px] transition-all duration-200 ${
              formData.role === "CANDIDATE" 
                ? "bg-white text-[#2563EB] font-bold shadow-[0_2px_8px_rgba(0,0,0,0.06)]" 
                : "text-[#64748B] font-medium hover:text-[#0F172A]"
            }`}
          >
            Ứng viên
          </button>
          <button
            type="button"
            onClick={() => handleRoleChange("EMPLOYER")}
            className={`flex-1 text-center py-2.5 rounded-lg text-[14px] transition-all duration-200 ${
              formData.role === "EMPLOYER" 
                ? "bg-white text-[#2563EB] font-bold shadow-[0_2px_8px_rgba(0,0,0,0.06)]" 
                : "text-[#64748B] font-medium hover:text-[#0F172A]"
            }`}
          >
            Nhà tuyển dụng
          </button>
        </div>

        {/* Input Fields Container */}
        <div className="space-y-4">
          {/* Render trường dữ liệu linh hoạt dựa trên Role */}
          {formData.role === "CANDIDATE" ? (
            <Input
              label="Họ và tên"
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              placeholder="VD: Nguyễn Văn A"
              className="w-full rounded-xl border-[#E2E8F0] focus:border-[#2563EB] focus:ring-[#2563EB]/20 transition-all text-[15px] font-medium placeholder:font-normal text-[#0F172A]"
            />
          ) : (
            <Input
              label="Tên doanh nghiệp"
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              required
              placeholder="VD: Công ty Cổ phần Worklify"
              className="w-full rounded-xl border-[#E2E8F0] focus:border-[#2563EB] focus:ring-[#2563EB]/20 transition-all text-[15px] font-medium placeholder:font-normal text-[#0F172A]"
            />
          )}

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

          {/* [ĐÃ THÊM] Input cho Số điện thoại */}
          <Input
            label="Số điện thoại liên hệ"
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            placeholder="VD: 0901234567"
            className="w-full rounded-xl border-[#E2E8F0] focus:border-[#2563EB] focus:ring-[#2563EB]/20 transition-all text-[15px] font-medium placeholder:font-normal text-[#0F172A]"
          />
          
          <Input
            label="Mật khẩu"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="Tối thiểu 6 ký tự"
            className="w-full rounded-xl border-[#E2E8F0] focus:border-[#2563EB] focus:ring-[#2563EB]/20 transition-all text-[15px] font-medium placeholder:font-normal text-[#0F172A]"
          />
          
          <Input
            label="Xác nhận mật khẩu"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            placeholder="Nhập lại mật khẩu giống phía trên"
            className="w-full rounded-xl border-[#E2E8F0] focus:border-[#2563EB] focus:ring-[#2563EB]/20 transition-all text-[15px] font-medium placeholder:font-normal text-[#0F172A]"
          />
        </div>

        {/* Nút Submit Đăng Ký - Đồng bộ style Nút MainLayout */}
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
              <span>Đang tạo tài khoản...</span>
            </div>
          ) : "Đăng ký tài khoản"}
        </Button>
      </form>

      {/* Điều hướng quay lại trang Đăng Nhập */}
      <div className="pt-5 border-t border-[#F1F5F9] text-center text-[14px] font-medium text-[#64748B]">
        Đã có tài khoản?{" "}
        <Link
          to="/auth/login"
          className="font-bold text-[#2563EB] hover:text-[#1D4ED8] transition-colors ml-1 no-underline"
        >
          Đăng nhập ngay
        </Link>
      </div>
    </div>
  );
};

export default RegisterPage;
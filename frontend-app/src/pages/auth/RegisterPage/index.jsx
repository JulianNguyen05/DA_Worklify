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
      const payload = {
        email: formData.email,
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
    <div className="w-full space-y-6 animate-fade-in">
      {/* Form Header */}
      <div className="space-y-1.5">
        <h2 className="text-2xl font-bold tracking-tight text-[#0F172A]">
          Tạo tài khoản mới
        </h2>
        <p className="text-sm text-[#64748B]">
          Bắt đầu hành trình tìm kiếm cơ hội cùng Worklify.
        </p>
      </div>

      {/* Form Handle */}
      <form onSubmit={handleSubmit} className="space-y-5">
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

        {/* Bộ chuyển đổi Tab Vai Trò (Role Switcher) - Thiết kế thanh lịch dạng Pill */}
        <div className="flex bg-[#F1F5F9] p-1 rounded-xl border border-[#E2E8F0]/30">
          <button
            type="button"
            onClick={() => handleRoleChange("CANDIDATE")}
            className={`flex-1 text-center py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
              formData.role === "CANDIDATE" 
                ? "bg-white text-[#2563EB] shadow-sm" 
                : "text-[#64748B] hover:text-[#0F172A]"
            }`}
          >
            Ứng viên
          </button>
          <button
            type="button"
            onClick={() => handleRoleChange("EMPLOYER")}
            className={`flex-1 text-center py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
              formData.role === "EMPLOYER" 
                ? "bg-white text-[#2563EB] shadow-sm" 
                : "text-[#64748B] hover:text-[#0F172A]"
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
              placeholder="Nguyễn Văn A"
              className="w-full rounded-xl border-[#E2E8F0] focus:border-[#2563EB] focus:ring-[#2563EB]/20 transition-all text-sm"
            />
          ) : (
            <Input
              label="Tên doanh nghiệp"
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              required
              placeholder="Công ty Cổ phần Worklify"
              className="w-full rounded-xl border-[#E2E8F0] focus:border-[#2563EB] focus:ring-[#2563EB]/20 transition-all text-sm"
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
            className="w-full rounded-xl border-[#E2E8F0] focus:border-[#2563EB] focus:ring-[#2563EB]/20 transition-all text-sm"
          />
          
          <Input
            label="Mật khẩu"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="Tối thiểu 6 ký tự"
            className="w-full rounded-xl border-[#E2E8F0] focus:border-[#2563EB] focus:ring-[#2563EB]/20 transition-all text-sm"
          />
          
          <Input
            label="Xác nhận mật khẩu"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            placeholder="Nhập lại mật khẩu giống phía trên"
            className="w-full rounded-xl border-[#E2E8F0] focus:border-[#2563EB] focus:ring-[#2563EB]/20 transition-all text-sm"
          />
        </div>

        {/* Nút Submit Đăng Ký với Spinner quay mượt mà */}
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
              <span>Đang tạo tài khoản...</span>
            </div>
          ) : "Đăng ký tài khoản"}
        </Button>
      </form>

      {/* Điều hướng quay lại trang Đăng Nhập */}
      <div className="pt-4 border-t border-[#F1F5F9] text-center text-sm text-[#64748B]">
        Đã có tài khoản?{" "}
        <Link
          to="/auth/login"
          className="font-semibold text-[#2563EB] hover:text-[#1D4ED8] transition-colors"
        >
          Đăng nhập ngay
        </Link>
      </div>
    </div>
  );
};

export default RegisterPage;
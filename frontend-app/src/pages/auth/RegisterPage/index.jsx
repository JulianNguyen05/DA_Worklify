import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Input from "../../../components/common/Input";
import Button from "../../../components/common/Button";
import Toast from "../../../components/common/Toast";
import { UserRound, Building2 } from "lucide-react";
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
    <div className="w-full space-y-6 animate-fade-in">
      {/* Form Header */}
      <div className="space-y-2">
        <h2 className="font-display text-2xl font-bold tracking-tight text-slate-900">
          Tạo tài khoản mới
        </h2>
        <p className="text-sm text-slate-500">
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

        {/* Bộ chuyển đổi Tab Vai Trò (Role Switcher) */}
        <div className="flex rounded-lg bg-slate-100 p-1">
          <button
            type="button"
            onClick={() => handleRoleChange("CANDIDATE")}
            className={`flex flex-1 items-center justify-center gap-2 rounded-md py-2 text-sm transition-colors ${ formData.role === "CANDIDATE" ? "bg-white text-slate-900 font-semibold shadow-xs" : "text-slate-500 font-medium hover:text-slate-900" }`}
          >
            <UserRound className="h-4 w-4" /> Ứng viên
          </button>
          <button
            type="button"
            onClick={() => handleRoleChange("EMPLOYER")}
            className={`flex flex-1 items-center justify-center gap-2 rounded-md py-2 text-sm transition-colors ${ formData.role === "EMPLOYER" ? "bg-white text-slate-900 font-semibold shadow-xs" : "text-slate-500 font-medium hover:text-slate-900" }`}
          >
            <Building2 className="h-4 w-4" /> Nhà tuyển dụng
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
          />
          
          <Input
            label="Mật khẩu"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="Tối thiểu 6 ký tự"
          />
          
          <Input
            label="Xác nhận mật khẩu"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            placeholder="Nhập lại mật khẩu giống phía trên"
          />
        </div>

        {/* Nút Submit Đăng Ký - Đồng bộ style Nút MainLayout */}
        <Button type="submit" size="lg" isLoading={isLoading} className="w-full">
          {isLoading ? "Đang tạo tài khoản..." : "Đăng ký tài khoản"}
        </Button>
      </form>

      {/* Điều hướng quay lại trang Đăng Nhập */}
      <div className="border-t border-slate-100 pt-5 text-center text-sm text-slate-500">
        Đã có tài khoản?{" "}
        <Link
          to="/auth/login"
          className="font-semibold text-brand-600 hover:text-brand-700 transition-colors ml-1 no-underline"
        >
          Đăng nhập ngay
        </Link>
      </div>
    </div>
  );
};

export default RegisterPage;
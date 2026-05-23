import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Input from "../../../components/common/Input";
import Button from "../../../components/common/Button";
import Toast from "../../../components/common/Toast"; // Import Toast Component
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
    <div className="w-full max-w-md space-y-8">
      <div>
        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
          Tạo tài khoản mới
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        {/* Tích hợp Toast dùng chung cho cả trạng thái lỗi lẫn thành công */}
        {toast.show && (
          <div className="animate-shake">
            <Toast 
              type={toast.type} 
              message={toast.message} 
              onClose={closeToast} 
            />
          </div>
        )}

        <div className="flex bg-gray-100 p-1 rounded-lg">
          <button
            type="button"
            onClick={() => handleRoleChange("CANDIDATE")}
            className={`flex-1 text-center py-2 rounded-md text-sm font-medium transition-colors ${formData.role === "CANDIDATE" ? "bg-white shadow-sm text-blue-600" : "text-gray-500 hover:text-gray-700"}`}
          >
            Ứng viên
          </button>
          <button
            type="button"
            onClick={() => handleRoleChange("EMPLOYER")}
            className={`flex-1 text-center py-2 rounded-md text-sm font-medium transition-colors ${formData.role === "EMPLOYER" ? "bg-white shadow-sm text-blue-600" : "text-gray-500 hover:text-gray-700"}`}
          >
            Nhà tuyển dụng
          </button>
        </div>

        <div className="space-y-4">
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
              placeholder="VD: Công ty Cổ phần ABC"
            />
          )}

          <Input
            label="Địa chỉ Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="Nhập email"
          />
          <Input
            label="Mật khẩu"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="Tạo mật khẩu"
          />
          <Input
            label="Xác nhận mật khẩu"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            placeholder="Nhập lại mật khẩu"
          />
        </div>

        <Button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-md font-semibold transition-all"
          disabled={isLoading}
        >
          {isLoading ? "Đang xử lý..." : "Đăng ký"}
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-gray-600">
        Đã có tài khoản?{" "}
        <Link
          to="/auth/login"
          className="font-medium text-blue-600 hover:text-blue-500"
        >
          Đăng nhập ngay
        </Link>
      </p>
    </div>
  );
};

export default RegisterPage;
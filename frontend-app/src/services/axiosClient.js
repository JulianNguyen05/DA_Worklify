import axios from 'axios';

// Khởi tạo instance của axios
const axiosClient = axios.create({
  // Đã có sẵn /api/v1 ở đây, nên các service bên dưới chỉ cần gọi /auth/...
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor cho Request: Gắn JWT Token vào trước khi gửi đi
// File: axiosClient.js
axiosClient.interceptors.request.use(
  (config) => {
    let token = null;

    // 1. Thử lấy từ Object 'user' trước (Vì dữ liệu thật nằm ở đây)
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const userObj = JSON.parse(userStr);
        token = userObj.accessToken; // Trích xuất token từ nội bộ object user
      } catch (e) {
        console.error("Không thể parse Object user từ localStorage", e);
      }
    }

    // 2. Phương án dự phòng nếu bạn lưu lẻ ở ngoài
    if (!token || token === 'undefined' || token === 'null') {
      token = localStorage.getItem('accessToken');
    }

    // 3. Gắn token hợp lệ vào header
    if (token && token !== 'undefined' && token !== 'null') {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor cho Response: Xử lý dữ liệu trả về và bắt lỗi
axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Xử lý lỗi phổ biến (Token hết hạn, chưa xác thực)
    if (error.response && error.response.status === 401) {
      console.warn("Token hết hạn hoặc chưa xác thực (401). Đang chuyển hướng...");
      // Xóa thông tin phiên làm việc
      localStorage.removeItem('user');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('userRole');

      // Chuyển hướng về trang Login
      if (window.location.pathname !== '/auth/login') {
        window.location.href = '/auth/login';
      }
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
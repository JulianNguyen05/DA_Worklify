import axios from 'axios';

// Khởi tạo instance của axios
const axiosClient = axios.create({
  // Thay đổi URL này thành URL Backend thực tế của bạn hoặc dùng biến môi trường (.env)
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080', 
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor cho Request: Gắn JWT Token vào trước khi gửi đi
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
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
    // Backend Spring Boot của bạn bọc dữ liệu trong ApiResponse (code, message, data, timestamp)
    return response;
  },
  (error) => {
    // Xử lý lỗi phổ biến (Token hết hạn, chưa xác thực)
    if (error.response && error.response.status === 401) {
      console.warn("Token hết hạn hoặc chưa xác thực (401). Đang chuyển hướng...");
      // Xóa token cũ
      localStorage.removeItem('accessToken');
      // Chuyển hướng về trang Login (sử dụng window.location để force redirect ngoài React Router Context)
      if (window.location.pathname !== '/auth/login') {
        window.location.href = '/auth/login';
      }
    }
    
    // Nếu có validationErrors (mã 400 Bad Request) từ GlobalExceptionHandler, bạn có thể custom ở đây
    return Promise.reject(error);
  }
);

export default axiosClient;
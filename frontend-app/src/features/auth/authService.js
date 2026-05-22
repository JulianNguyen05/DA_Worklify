import axiosClient from '../../services/axiosClient';

const authService = {
  // Gửi LoginRequest tới Backend [cite: 50]
  login: async (credentials) => {
    const response = await axiosClient.post('/api/v1/auth/login', credentials);
    return response.data; // Trả về ApiResponse chứa AuthResponse (bao gồm token)
  },

  // Gửi RegisterRequest tới Backend [cite: 49]
  register: async (userData) => {
    const response = await axiosClient.post('/api/v1/auth/register', userData);
    return response.data; // Trả về ApiResponse chứa UserResponse
  },

  forgotPassword: async (email) => {
    // API endpoint có thể thay đổi tùy thuộc vào cấu hình route thực tế ở Backend của bạn
    const response = await axiosClient.post('/api/v1/auth/forgot-password', { email });
    return response.data;
  }
};

export default authService;
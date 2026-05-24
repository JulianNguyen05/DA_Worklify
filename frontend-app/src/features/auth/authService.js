import axiosClient from '../../services/axiosClient';

const authService = {
  register: async (userData) => {
    // Gọi API: http://localhost:8080/api/v1/auth/register
    const response = await axiosClient.post('/auth/register', userData);
    return response.data; 
  },

  login: async (credentials) => {
    // Gọi API: http://localhost:8080/api/v1/auth/login
    const response = await axiosClient.post('/auth/login', credentials);
    
    // response.data là cục ApiResponse { code: 200, message: "...", data: { accessToken: "...", role: "..." } }
    const apiResponse = response.data;
    
    // Bóc tách payload thực sự (AuthResponse) nằm bên trong field "data"
    const authData = apiResponse.data; 

    // Kiểm tra và lưu thông tin
    if (authData && authData.accessToken) {
      // Lưu dạng Object cho hàm getCurrentUser
      localStorage.setItem('user', JSON.stringify(authData));
      
      // Lưu 2 biến này để AxiosClient và Navbar hoạt động bình thường
      localStorage.setItem('accessToken', authData.accessToken);
      localStorage.setItem('userRole', authData.role);
    }
    
    return apiResponse;
  },

  logout: () => {
    // Xóa sạch thông tin phiên đăng nhập
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userRole');
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch (e) {
      return null;
    }
  },

  forgotPassword: async (email) => {
    // Gọi API: http://localhost:8080/api/v1/auth/forgot-password
    const response = await axiosClient.post('/auth/forgot-password', { email });
    return response.data;
  },

  changePassword: async (userId, passwordData) => {
    // Gọi API: PUT http://localhost:8080/api/v1/auth/{userId}/password
    const response = await axiosClient.put(`/auth/${userId}/password`, passwordData);
    return response.data;
  },

  enableMfa: async (userId) => {
    // Gọi API: http://localhost:8080/api/v1/auth/{userId}/mfa/enable
    const response = await axiosClient.post(`/auth/${userId}/mfa/enable`);
    return response.data;
  }
};

export default authService;
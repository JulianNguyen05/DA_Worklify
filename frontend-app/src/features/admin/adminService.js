import axiosClient from '../../services/axiosClient';

const adminService = {
  // Lấy thống kê tổng quan cho Dashboard [cite: 42]
  getDashboardStats: async () => {
    const response = await axiosClient.get('/api/v1/admin/dashboard');
    return response.data;
  },

  // Kiểm duyệt tin tuyển dụng [cite: 43]
  moderateJob: async (jobId, status) => {
    const response = await axiosClient.patch(`/api/v1/admin/jobs/${jobId}/moderate?status=${status}`);
    return response.data;
  },

  // Khóa tài khoản người dùng [cite: 45]
  banUser: async (userId) => {
    const response = await axiosClient.patch(`/api/v1/admin/users/${userId}/ban`);
    return response.data;
  },

  // --- Các hàm lấy danh sách (Giả định Backend có hỗ trợ dựa trên mô hình CRUD) ---
  getUsers: async (page = 0, size = 10) => {
    const response = await axiosClient.get(`/api/v1/admin/users?page=${page}&size=${size}`);
    return response.data;
  },

  getPendingJobs: async (page = 0, size = 10) => {
    // Tận dụng API search jobs nhưng thêm bộ lọc trạng thái PENDING
    const response = await axiosClient.get(`/api/v1/jobs/search?status=PENDING&page=${page}&size=${size}`);
    return response.data;
  }
};

export default adminService;
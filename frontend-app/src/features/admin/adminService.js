import axiosClient from '../../services/axiosClient';

const adminService = {
  // Lấy thống kê tổng quan cho Dashboard
  getDashboardStats: async () => {
    const response = await axiosClient.get('/admin/dashboard');
    return response.data;
  },

  // Kiểm duyệt tin tuyển dụng
  moderateJob: async (jobId, status) => {
    const response = await axiosClient.patch(`/admin/jobs/${jobId}/moderate?status=${status}`);
    return response.data;
  },

  // Khóa tài khoản người dùng
  banUser: async (userId) => {
    const response = await axiosClient.patch(`/admin/users/${userId}/ban`);
    return response.data;
  },

  // --- Các hàm lấy danh sách ---
  getUsers: async (page = 0, size = 10) => {
    const response = await axiosClient.get(`/admin/users?page=${page}&size=${size}`);
    return response.data;
  },

  // Lấy danh sách doanh nghiệp chờ duyệt
  getPendingCompanies: async () => {
    const response = await axiosClient.get('/admin/companies/pending');
    return response.data;
  },

  // Duyệt hoặc từ chối doanh nghiệp
  moderateCompany: async (companyId, action, reason = '') => {
    const response = await axiosClient.patch(`/admin/companies/${companyId}/moderate`, {
      action: action, // 'APPROVED' hoặc 'REJECTED'
      reason: reason
    });
    return response.data;
  },

  getPendingJobs: async (page = 0, size = 10) => {
    // Tận dụng API search jobs nhưng thêm bộ lọc trạng thái PENDING
    const response = await axiosClient.get(`/jobs/search?status=PENDING&page=${page}&size=${size}`);
    return response.data;
  }
};

export default adminService;
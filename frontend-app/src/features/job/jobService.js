import axiosClient from '../../services/axiosClient';

const jobService = {
  // Khách/Ứng viên tìm kiếm việc làm
  searchJobs: async (keyword = '', location = '', page = 0, size = 10) => {
    // Đã xóa tiền tố /api/v1 vì axiosClient đã cấu hình baseURL rồi
    const response = await axiosClient.get('/jobs/search', {
      params: { keyword, location, page, size }
    });
    return response.data;
  },

  // Xem chi tiết tin tuyển dụng
  getJobDetail: async (jobId) => {
    // Đã xóa tiền tố /api/v1
    const response = await axiosClient.get(`/jobs/${jobId}`);
    return response.data;
  },

  getPublicJobsByCompany: async (companyId, page = 0, size = 10) => {
    const response = await axiosClient.get(`/jobs/public/employers/${companyId}?page=${page}&size=${size}`);
    return response.data;
  },

  // Xem hồ sơ doanh nghiệp (Public)
  getCompanyProfile: async (companyId) => {
    // Đã xóa tiền tố /api/v1
    const response = await axiosClient.get(`/employers/${companyId}/profile`);
    return response.data;
  }
};

export default jobService;
import axiosClient from '../../services/axiosClient';

const jobService = {
  // Khách/Ứng viên tìm kiếm việc làm
  searchJobs: async (keyword = '', location = '', page = 0, size = 10) => {
    const response = await axiosClient.get('/api/v1/jobs/search', {
      params: { keyword, location, page, size }
    });
    return response.data;
  },

  // Xem chi tiết tin tuyển dụng
  getJobDetail: async (jobId) => {
    const response = await axiosClient.get(`/api/v1/jobs/${jobId}`);
    return response.data;
  },
  
  // Xem hồ sơ doanh nghiệp (Public)
  getCompanyProfile: async (companyId) => {
    const response = await axiosClient.get(`/api/v1/employers/${companyId}/profile`);
    return response.data;
  }
};

export default jobService;
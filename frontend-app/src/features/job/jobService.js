import axiosClient from '../../services/axiosClient';

// Bỏ các tham số rỗng để URL gọn và backend không nhận chuỗi ""
const cleanParams = (params) =>
  Object.fromEntries(Object.entries(params).filter(([, v]) => v !== '' && v !== null && v !== undefined));

const jobService = {
  /**
   * Tìm việc làm (chỉ tin đang mở, còn hạn). Lọc phía server.
   * filters: { keyword, location, workType, salaryMin, salaryMax } (lương tính theo triệu VNĐ)
   */
  searchJobs: async (filters = {}, page = 0, size = 10) => {
    const response = await axiosClient.get('/jobs/search', {
      params: cleanParams({ ...filters, page, size }),
    });
    return response.data;
  },

  getJobDetail: async (jobId) => {
    const response = await axiosClient.get(`/jobs/${jobId}`);
    return response.data;
  },

  getPublicJobsByCompany: async (companyId, page = 0, size = 10) => {
    const response = await axiosClient.get(`/jobs/public/employers/${companyId}?page=${page}&size=${size}`);
    return response.data;
  },

  // Xem hồ sơ doanh nghiệp (Public)
  getCompanyProfile: async (companyId) => {
    const response = await axiosClient.get(`/employers/company/${companyId}`);
    return response.data;
  },

  // ===== Lưu tin (ứng viên) =====
  getSavedJobs: async (page = 0, size = 10) => {
    const response = await axiosClient.get('/saved-jobs', { params: { page, size } });
    return response.data;
  },

  getSavedJobIds: async () => {
    const response = await axiosClient.get('/saved-jobs/ids');
    return response.data;
  },

  saveJob: async (jobId) => {
    const response = await axiosClient.post(`/saved-jobs/${jobId}`);
    return response.data;
  },

  unsaveJob: async (jobId) => {
    const response = await axiosClient.delete(`/saved-jobs/${jobId}`);
    return response.data;
  },
};

export default jobService;

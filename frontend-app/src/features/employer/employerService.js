import axiosClient from '../../services/axiosClient';

const employerService = {
  // --- Hồ sơ Doanh nghiệp ---

  // --- Tin tuyển dụng ---
  createJobPosting: async (companyId, jobData) => {
    const response = await axiosClient.post(`/api/v1/jobs/employers/${companyId}`, jobData);
    return response.data;
  },
  // Giả định API lấy danh sách tin của công ty
  getMyJobs: async (companyId, page = 0, size = 10) => {
    const response = await axiosClient.get(`/api/v1/jobs/employers/${companyId}/list?page=${page}&size=${size}`);
    return response.data;
  },

  // --- Quản lý Ứng viên & AI ---
  getApplicationsForJob: async (jobId, page = 0, size = 10) => {
    const response = await axiosClient.get(`/api/v1/applications/jobs/${jobId}/review-board?page=${page}&size=${size}`);
    return response.data;
  },
  getAiScore: async (applicationId) => {
    const response = await axiosClient.get(`/api/v1/applications/${applicationId}/ai-score`);
    return response.data;
  },
  updateApplicationStatus: async (companyId, applicationId, status) => {
    const response = await axiosClient.patch(`/api/v1/applications/employers/${companyId}/${applicationId}/status?status=${status}`);
    return response.data;
  },

  getCompanyProfile: async (userId) => {
    const response = await axiosClient.get(`/employers/${userId}/profile`);
    return response.data;
  },
  createProfile: async (userId, profileData) => {
    const response = await axiosClient.post(`/employers/${userId}/profile`, profileData);
    return response.data;
  },
  updateProfile: async (userId, profileData) => {
    const response = await axiosClient.put(`/employers/${userId}/profile`, profileData);
    return response.data;
  },
  uploadLogo: async (userId, file) => {
    const formData = new FormData();
    formData.append('file', file);
    // Lưu ý: Thêm header multipart/form-data để axios hiểu đây là file
    const response = await axiosClient.post(`/employers/${userId}/logo`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  // --- Thống kê Dashboard ---
  getDashboardStats: async (companyId) => {
    try {
      // Khi Backend hoàn thiện, mở comment dòng dưới và xóa phần Mock Data
      // const response = await axiosClient.get(`/api/v1/employers/${companyId}/dashboard`);
      // return response.data;

      // Mock Data tạm thời để render UI
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            data: {
              activeJobs: 15,
              pendingApplications: 52,
              interviewed: 18
            }
          });
        }, 500); // Giả lập độ trễ mạng 0.5s
      });
    } catch (error) {
      throw error;
    }
  },
};

export default employerService;
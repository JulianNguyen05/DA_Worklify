import axiosClient from '../../services/axiosClient';

const employerService = {
  // --- Hồ sơ Doanh nghiệp ---
  getCompanyProfile: async (userId) => {
    const response = await axiosClient.get(`/api/v1/employers/${userId}/profile`);
    return response.data;
  },
  createProfile: async (userId, profileData) => {
    const response = await axiosClient.post(`/api/v1/employers/${userId}/profile`, profileData);
    return response.data;
  },

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
  }
};

export default employerService;
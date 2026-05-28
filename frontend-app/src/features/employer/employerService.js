import axiosClient from '../../services/axiosClient';

const employerService = {
  // --- Hồ sơ Doanh nghiệp ---
  // Sử dụng đường dẫn tương đối so với baseURL (/api/v1)
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
    const response = await axiosClient.post(`/employers/${userId}/logo`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  // --- Tin tuyển dụng ---
  createJobPosting: async (companyId, jobData) => {
    // Sửa: loại bỏ /api/v1/ dư thừa
    const response = await axiosClient.post(`/jobs/employers/${companyId}`, jobData);
    return response.data;
  },

  // --- Quản lý Ứng viên & AI ---
  getApplicationsForJob: async (jobId, page = 0, size = 10) => {
    // Sửa: loại bỏ /api/v1/ dư thừa
    const response = await axiosClient.get(`/applications/jobs/${jobId}/review-board?page=${page}&size=${size}`);
    return response.data;
  },
  getAiScore: async (applicationId) => {
    // Sửa: loại bỏ /api/v1/ dư thừa
    const response = await axiosClient.get(`/applications/${applicationId}/ai-score`);
    return response.data;
  },
  updateApplicationStatus: async (companyId, applicationId, status) => {
    // Sửa: loại bỏ /api/v1/ dư thừa
    const response = await axiosClient.patch(`/applications/employers/${companyId}/${applicationId}/status?status=${status}`);
    return response.data;
  },

  getMyJobs: async (companyId, page = 0, size = 10) => {
    // URL đã được đồng bộ với JobController
    const response = await axiosClient.get(`/jobs/employers/${companyId}?page=${page}&size=${size}`);
    return response.data;
  },

  // 1. Lấy chi tiết tin tuyển dụng đổ lên form sửa (Khớp với GET /api/v1/jobs/{jobId})
  getJobDetail: async (jobId) => {
    const response = await axiosClient.get(`/jobs/${jobId}`);
    return response.data;
  },

  // 2. Gửi dữ liệu cập nhật lên Backend (Khớp với PUT /api/v1/jobs/{jobId})
  updateJobPosting: async (companyId, jobId, jobData) => {
    const response = await axiosClient.put(`/jobs/employers/${companyId}/${jobId}`, jobData);
    return response.data;
  },

// File: frontend-app/src/features/employer/employerService.js
  getAllCompanies: async (page = 0, size = 5, userId = null) => {
    let url = `/employers?page=${page}&size=${size}`;
    if (userId) {
      url += `&userId=${userId}`; // Truyền userId lên BE nếu có đăng nhập
    }
    const response = await axiosClient.get(url);
    return response.data;
  },

// API Like công ty
  likeCompany: async (companyId, userId) => {
    // Truyền userId lên BE thông qua query string (?userId=...)
    const response = await axiosClient.post(`/employers/${companyId}/like?userId=${userId}`);
    return response.data;
  },

  // --- Thống kê Dashboard ---
  getDashboardStats: async (companyId) => {
    try {
      // Backend hoàn thiện xong, bạn chỉ cần bỏ comment dòng dưới:
      // const response = await axiosClient.get(`/employers/${companyId}/dashboard`);
      // return response.data;

      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            data: {
              activeJobs: 15,
              pendingApplications: 52,
              interviewed: 18
            }
          });
        }, 500);
      });
    } catch (error) {
      throw error;
    }
  },
};

export default employerService;
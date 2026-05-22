import axiosClient from '../../services/axiosClient';

const candidateService = {
  // Quản lý hồ sơ
  getProfile: async (userId) => {
    const response = await axiosClient.get(`/api/v1/candidates/${userId}/profile`);
    return response.data;
  },
  
  createOrUpdateProfile: async (userId, profileData) => {
    const response = await axiosClient.post(`/api/v1/candidates/${userId}/profile`, profileData);
    return response.data;
  },

  // Quản lý CV
  uploadCv: async (userId, file) => {
    const formData = new FormData();
    formData.append('file', file);
    // Sử dụng multipart/form-data theo đặc tả Backend
    const response = await axiosClient.post(`/api/v1/candidates/${userId}/cvs`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  getCvs: async (userId) => {
    const response = await axiosClient.get(`/api/v1/candidates/${userId}/cvs`);
    return response.data;
  },

  // Theo dõi tiến trình ứng tuyển
  getMyApplications: async (userId, page = 0, size = 10) => {
    // Giả định endpoint lấy danh sách đơn ứng tuyển của candidate
    const response = await axiosClient.get(`/api/v1/applications/candidates/${userId}?page=${page}&size=${size}`);
    return response.data;
  }
};

export default candidateService;
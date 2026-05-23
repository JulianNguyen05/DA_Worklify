import axiosClient from '../../services/axiosClient';

const candidateService = {
  getProfile: async (userId) => {
    const response = await axiosClient.get(`/candidates/${userId}/profile`);
    return response.data;
  },
  
  createOrUpdateProfile: async (userId, profileData) => {
    const response = await axiosClient.post(`/candidates/${userId}/profile`, profileData);
    return response.data;
  },

  uploadCv: async (userId, file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await axiosClient.post(`/candidates/${userId}/cvs`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  getCvs: async (userId) => {
    const response = await axiosClient.get(`/candidates/${userId}/cvs`);
    return response.data;
  },

  getMyApplications: async (userId, page = 0, size = 10) => {
    const response = await axiosClient.get(`/applications/candidates/${userId}?page=${page}&size=${size}`);
    return response.data;
  },

  // === BỔ SUNG HÀM LƯU CV SANDBOX ===
  saveGeneratedCv: async (userId, rawText) => {
    const response = await axiosClient.post(`/candidates/${userId}/cvs/generated`, { rawText });
    return response.data;
  }
};

export default candidateService;
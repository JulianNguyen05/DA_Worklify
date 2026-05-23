import axiosClient from '../../services/axiosClient';

const candidateService = {
  // ─── 1. QUẢN LÝ PROFILE ──────────────────────────────────────────────
  getProfile: async (userId) => {
    const response = await axiosClient.get(`/candidates/${userId}/profile`);
    return response.data;
  },
  
  createOrUpdateProfile: async (userId, profileData) => {
    // profileData lúc này từ index.jsx gửi xuống sẽ bao gồm:
    // fullName, phone, gender, dob, address, email, summary
    const response = await axiosClient.post(`/candidates/${userId}/profile`, profileData);
    return response.data;
  },

  // ─── 2. QUẢN LÝ SKILLS (CÁC HÀM MỚI THEO YÊU CẦU CỦA INDEX.JSX) ────
  
  // Được gọi ở dòng 98 trong index.jsx: lấy danh sách kỹ năng
  getSkills: async (userId) => {
    const response = await axiosClient.get(`/candidates/${userId}/skills`);
    return response.data;
  },

  // Được gọi ở dòng 198 trong index.jsx: tạo kỹ năng mới
  createSkill: async (userId, skillData) => {
    // skillData gồm: skillName, level, category, description
    const response = await axiosClient.post(`/candidates/${userId}/skills`, skillData);
    return response.data; 
  },

  // Được gọi ở dòng 196 trong index.jsx: cập nhật kỹ năng đã có (dựa vào remoteId)
  updateSkill: async (userId, skillId, skillData) => {
    const response = await axiosClient.put(`/candidates/${userId}/skills/${skillId}`, skillData);
    return response.data;
  },

  // ─── 3. QUẢN LÝ CV (Giữ nguyên các hàm cũ) ─────────────────────────
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
  }
};

export default candidateService;
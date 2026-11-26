import axiosClient from '../../services/axiosClient';

// Chấm điểm mức độ phù hợp CV–JD bằng AI (backend-ml qua backend-core).
// Người dùng được xác định từ JWT nên không cần truyền userId.
const matchingService = {
  // Ứng viên: mức độ phù hợp giữa hồ sơ online của mình và một tin tuyển dụng
  getMyMatchForJob: async (jobId) => {
    const response = await axiosClient.get(`/matching/jobs/${jobId}/me`);
    return response.data;
  },

  // Nhà tuyển dụng: xếp hạng các hồ sơ ứng tuyển của một tin theo điểm phù hợp (điểm cao trước)
  rankApplicationsForJob: async (jobId) => {
    const response = await axiosClient.get(`/matching/jobs/${jobId}/applications`);
    return response.data;
  },
};

// Lấy thông báo lỗi tiếng Việt từ ApiResponse của backend (503 khi dịch vụ AI tắt, 403 khi không có quyền...)
export const getMatchingErrorMessage = (error) =>
  error?.response?.data?.message || 'Không chấm điểm được lúc này, vui lòng thử lại sau.';

export default matchingService;

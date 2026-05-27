import axiosClient from '../../services/axiosClient';

const applicationService = {
  // Nộp đơn ứng tuyển
  submitApplication: async (candidateId, applicationData) => {
    // Gọi API: POST /api/v1/applications/candidates/{candidateId}
    const response = await axiosClient.post(`/applications/candidates/${candidateId}`, applicationData);
    return response.data;
  }
};

export default applicationService;
import axiosClient from '../../services/axiosClient';

const applicationService = {
  // Nộp đơn ứng tuyển
  submitApplication: async (candidateId, applicationData) => {
    const response = await axiosClient.post(`/applications/candidates/${candidateId}`, applicationData);
    return response.data;
  },

  // Rút đơn (chỉ khi đơn còn ở trạng thái PENDING)
  withdrawApplication: async (applicationId) => {
    const response = await axiosClient.delete(`/applications/${applicationId}`);
    return response.data;
  },
};

export default applicationService;

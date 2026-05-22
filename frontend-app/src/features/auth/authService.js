import axiosClient from '../../services/axiosClient';

const authService = {
  register: async (userData) => {
    // userData bao gồm: fullName, email, password, role
    const response = await axiosClient.post('/auth/register', userData);
    if (response.data && response.data.accessToken) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  },

  login: async (credentials) => {
    // credentials bao gồm: email, password
    const response = await axiosClient.post('/auth/login', credentials);
    if (response.data && response.data.accessToken) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch (e) {
      return null;
    }
  }
};

export default authService;
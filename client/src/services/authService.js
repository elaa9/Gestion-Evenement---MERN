import api from './api';

export const authService = {
  // Register a new user
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  // Login existing user
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  // Get current logged-in user profile
  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  // Update profile
  updateProfile: async (data) => {
    const response = await api.put('/auth/profile', data);
    return response.data;
  }
};

export default authService;

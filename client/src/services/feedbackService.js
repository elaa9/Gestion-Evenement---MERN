import api from './api';

export const feedbackService = {
  // Get all feedbacks for an event
  getByEvent: async (eventId) => {
    const response = await api.get(`/feedback/event/${eventId}`);
    return response.data;
  },

  // Post feedback for an event (Protected)
  create: async (eventId, feedbackData) => {
    const response = await api.post(`/feedback/event/${eventId}`, feedbackData);
    return response.data;
  },

  // Delete feedback (Protected & Author only)
  delete: async (id) => {
    const response = await api.delete(`/feedback/${id}`);
    return response.data;
  }
};

export default feedbackService;

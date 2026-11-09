import api from './api';

export const eventService = {
  // Get all events with optional filters (keyword, category, location, sortBy)
  getAll: async (params = {}) => {
    const response = await api.get('/events', { params });
    return response.data;
  },

  // Get single event by ID with creator and feedbacks
  getById: async (id) => {
    const response = await api.get(`/events/${id}`);
    return response.data;
  },

  // Create event (Protected)
  create: async (eventData) => {
    const response = await api.post('/events', eventData);
    return response.data;
  },

  // Update event (Protected & Owner only)
  update: async (id, eventData) => {
    const response = await api.put(`/events/${id}`, eventData);
    return response.data;
  },

  // Delete event (Protected & Owner only)
  delete: async (id) => {
    const response = await api.delete(`/events/${id}`);
    return response.data;
  },

  // Get events created by logged in user (Protected)
  getMyEvents: async () => {
    const response = await api.get('/events/user/my-events');
    return response.data;
  }
};

export default eventService;

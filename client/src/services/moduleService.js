import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('ub_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const moduleService = {
  // Get all modules with pagination
  getAll: async (params = {}) => {
    const response = await API.get('/modules', { params });
    return response.data;
  },

  // Get modules by year
  getByYear: async (year, params = {}) => {
    const response = await API.get(`/modules/year/${year}`, { params });
    return response.data;
  },

  // Get modules by year and semester
  getByYearAndSemester: async (year, semester, params = {}) => {
    const response = await API.get(`/modules/year/${year}/semester/${semester}`, { params });
    return response.data;
  },

  // Get single module
  getById: async (id) => {
    const response = await API.get(`/modules/${id}`);
    return response.data;
  },

  // Create module (admin only)
  create: async (data) => {
    const response = await API.post('/modules', data);
    return response.data;
  },

  // Update module (admin only)
  update: async (id, data) => {
    const response = await API.put(`/modules/${id}`, data);
    return response.data;
  },

  // Delete module (admin only)
  delete: async (id) => {
    const response = await API.delete(`/modules/${id}`);
    return response.data;
  },
};

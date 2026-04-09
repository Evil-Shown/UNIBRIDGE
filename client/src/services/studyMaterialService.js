import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('ub_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const studyMaterialService = {
  // Get all materials (with filters)
  getAll: async (params = {}) => {
    const response = await API.get('/materials', { params });
    return response.data;
  },

  // Get materials by module
  getByModule: async (moduleName, params = {}) => {
    const response = await API.get('/materials', { 
      params: { ...params, module: moduleName } 
    });
    return response.data;
  },

  // Get materials by year and semester
  getByYearAndSemester: async (year, semester, params = {}) => {
    const response = await API.get('/materials', { 
      params: { ...params, year, semester } 
    });
    return response.data;
  },

  // Get single material
  getById: async (id) => {
    const response = await API.get(`/materials/${id}`);
    return response.data;
  },

  // Create material submission (student)
  create: async (data) => {
    const response = await API.post('/materials', data);
    return response.data;
  },

  // Download material
  download: async (id) => {
    const response = await API.get(`/materials/${id}/download`, {
      responseType: 'blob',
    });
    return response.data;
  },

  // Like material
  like: async (id) => {
    const response = await API.post(`/materials/${id}/like`);
    return response.data;
  },

  // Dislike material
  dislike: async (id) => {
    const response = await API.post(`/materials/${id}/dislike`);
    return response.data;
  },

  // Add comment
  addComment: async (id, text) => {
    const response = await API.post(`/materials/${id}/comments`, { text });
    return response.data;
  },

  // Get user's submissions (student)
  getMySubmissions: async (params = {}) => {
    const response = await API.get('/materials/my-submissions', { params });
    return response.data;
  },

  // Get pending submissions for admin review
  getPending: async (params = {}) => {
    const response = await API.get('/materials/pending', { params });
    return response.data;
  },

  // Publish material (admin)
  publish: async (id) => {
    const response = await API.post('/materials/admin/publish', { id });
    return response.data;
  },
};

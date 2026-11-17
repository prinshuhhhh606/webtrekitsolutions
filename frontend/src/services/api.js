import axios from 'axios';

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD
    ? 'https://webtrekitsolutions-ezoq.onrender.com/api'
    : 'http://localhost:5001/api');

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercept requests to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('webtrek_admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercept responses to handle errors smoothly
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If unauthorized on admin routes, clear token
      if (window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/login') {
        localStorage.removeItem('webtrek_admin_token');
        localStorage.removeItem('webtrek_admin_user');
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

// Helper to handle both standard JSON bodies and multipart FormData
const postData = (url, data) => {
  const isForm = typeof FormData !== 'undefined' && data instanceof FormData;
  return api.post(url, data, isForm ? { headers: { 'Content-Type': 'multipart/form-data' } } : {});
};

const putData = (url, data) => {
  const isForm = typeof FormData !== 'undefined' && data instanceof FormData;
  return api.put(url, data, isForm ? { headers: { 'Content-Type': 'multipart/form-data' } } : {});
};

// Endpoints
export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (data) => api.put('/auth/change-password', data),
};

export const servicesService = {
  getAll: (params) => api.get('/services', { params }),
  getBySlug: (slug) => api.get(`/services/slug/${slug}`),
  getById: (id) => api.get(`/services/${id}`),
  create: (data) => postData('/services', data),
  update: (id, data) => putData(`/services/${id}`, data),
  delete: (id) => api.delete(`/services/${id}`),
};

export const projectsService = {
  getAll: (params) => api.get('/projects', { params }),
  getBySlug: (slug) => api.get(`/projects/slug/${slug}`),
  getById: (id) => api.get(`/projects/${id}`),
  create: (data) => postData('/projects', data),
  update: (id, data) => putData(`/projects/${id}`, data),
  delete: (id) => api.delete(`/projects/${id}`),
};

export const teamService = {
  getAll: (params) => api.get('/team', { params }),
  getById: (id) => api.get(`/team/${id}`),
  create: (data) => postData('/team', data),
  update: (id, data) => putData(`/team/${id}`, data),
  toggleStatus: (id, isActive) => api.patch(`/team/${id}/status`, { isActive }),
  delete: (id) => api.delete(`/team/${id}`),
};

export const testimonialsService = {
  getAll: (params) => api.get('/testimonials', { params }),
  getById: (id) => api.get(`/testimonials/${id}`),
  create: (data) => postData('/testimonials', data),
  update: (id, data) => putData(`/testimonials/${id}`, data),
  delete: (id) => api.delete(`/testimonials/${id}`),
};

export const faqsService = {
  getAll: (params) => api.get('/faqs', { params }),
  getById: (id) => api.get(`/faqs/${id}`),
  create: (data) => api.post('/faqs', data),
  update: (id, data) => api.put(`/faqs/${id}`, data),
  delete: (id) => api.delete(`/faqs/${id}`),
};

export const enquiriesService = {
  create: (data) => api.post('/enquiries', data),
  getAll: (params) => api.get('/enquiries', { params }),
  getStats: () => api.get('/enquiries/stats'),
  getById: (id) => api.get(`/enquiries/${id}`),
  updateStatus: (id, data) => api.patch(`/enquiries/${id}`, data),
  delete: (id) => api.delete(`/enquiries/${id}`),
};

export const settingsService = {
  get: () => api.get('/settings'),
  update: (data) => api.put('/settings', data),
};

export const blogsService = {
  getAll: (params) => api.get('/blogs', { params }),
  getBySlug: (slug) => api.get(`/blogs/slug/${slug}`),
  getById: (id) => api.get(`/blogs/${id}`),
  create: (formData) => api.post('/blogs', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, formData) => api.put(`/blogs/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id) => api.delete(`/blogs/${id}`),
};

export const quotationsService = {
  getAll: (params) => api.get('/quotations', { params }),
  getById: (id) => api.get(`/quotations/${id}`),
  create: (data) => api.post('/quotations', data),
  update: (id, data) => api.put(`/quotations/${id}`, data),
  delete: (id) => api.delete(`/quotations/${id}`),
};

export const clientProjectsService = {
  getAll: (params) => api.get('/client-projects', { params }),
  getById: (id) => api.get(`/client-projects/${id}`),
  create: (data) => api.post('/client-projects', data),
  update: (id, data) => api.put(`/client-projects/${id}`, data),
  delete: (id) => api.delete(`/client-projects/${id}`),
};

export const uploadService = {
  uploadSingle: (formData) =>
    api.post('/upload/single', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  uploadMultiple: (formData) =>
    api.post('/upload/multiple', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
};

export default api;


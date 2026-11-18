import axios from 'axios';

const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    if (host === 'localhost' || host === '127.0.0.1') {
      return '/api';
    }
  }
  return (
    import.meta.env.VITE_API_URL ||
    'https://webtrekitsolutions-ezoq.onrender.com/api'
  );
};

const api = axios.create({
  baseURL: getBaseUrl(),
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercept requests to attach JWT token and ensure correct runtime baseURL
api.interceptors.request.use(
  (config) => {
    config.baseURL = getBaseUrl();
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
  create: async (data) => {
    const res = await api.post('/enquiries', data);
    if (res?.data?.success && res.data.data) {
      if (typeof window !== 'undefined') {
        const newEnq = res.data.data;
        try {
          const bc = new BroadcastChannel('webtrek_enquiries_channel');
          bc.postMessage({ type: 'NEW_ENQUIRY', data: newEnq });
          bc.close();
        } catch (_) {}
        try {
          localStorage.setItem('webtrek_latest_enquiry', JSON.stringify({
            timestamp: Date.now(),
            enquiry: newEnq,
          }));
        } catch (_) {}
        window.dispatchEvent(new CustomEvent('webtrek:new_enquiry', { detail: newEnq }));
      }
    }
    return res;
  },
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

export const careersService = {
  getStatus: () => api.get('/careers/status'),
  updateStatus: (data) => api.patch('/careers/status', data),
  getJobs: (params) => api.get('/careers/jobs', { params }),
  getJobById: (id) => api.get(`/careers/jobs/${id}`),
  createJob: (data) => api.post('/careers/jobs', data),
  updateJob: (id, data) => api.put(`/careers/jobs/${id}`, data),
  deleteJob: (id) => api.delete(`/careers/jobs/${id}`),
  apply: (formData) =>
    api.post('/careers/apply', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  getApplications: (params) => api.get('/careers/applications', { params }),
  updateApplicationStatus: (id, data) => api.patch(`/careers/applications/${id}`, data),
  deleteApplication: (id) => api.delete(`/careers/applications/${id}`),
};

export default api;


// frontend/src/services/api.js
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000, // 5 second timeout limit
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('pmosense_token') || localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    let message = 'Network connection issue.';
    
    if (error.code === 'ECONNABORTED' || (error.message && error.message.includes('timeout'))) {
      message = 'Request timed out (5s limit reached). Backend server taking too long to respond.';
    } else if (error.response?.data?.message) {
      message = error.response.data.message;
    } else if (error.response?.status === 401) {
      message = 'Session expired. Please log in again.';
    }

    return Promise.reject(new Error(message));
  }
);

export const authAPI = {
  login: (email, password, role) => api.post('/auth/login', { email, password, role }),
  register: (name, email, password, role, extra) => api.post('/auth/register', { name, email, password, role, ...extra }),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => api.post(`/auth/reset-password/${token}`, { password }),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (profileData) => api.put('/auth/profile', profileData),
};

export const assessmentAPI = {
  submit: (formData) => api.post('/assessment/submit', formData),
  getHistory: () => api.get('/history'),
  delete: (id) => api.delete(`/history/${id}`),
};

export const doctorAPI = {
  getApprovedDoctors: () => api.get('/doctor/list'),
  getConsultations: () => api.get('/doctor/consultations'),
  postQuery: (question, doctorId) => api.post('/doctor/consult', { question, doctorId }),
  postReply: (id, reply) => api.put(`/doctor/consult/${id}/reply`, { reply }),
};

export const adminAPI = {
  getDashboardStats: () => api.get('/admin/stats'),
  getPatients: () => api.get('/admin/patients'),
  togglePatientVerify: (id) => api.put(`/admin/patients/${id}/verify`),
  getDoctors: () => api.get('/admin/doctors'),
  toggleDoctorApprove: (id) => api.put(`/admin/doctors/${id}/approve`),
};

export const educationAPI = {
  getArticles: () => api.get('/education/articles'),
  createArticle: (articleData) => api.post('/admin/articles', articleData),
  updateArticle: (id, articleData) => api.put(`/admin/articles/${id}`, articleData),
  deleteArticle: (id) => api.delete(`/admin/articles/${id}`),
};

export default api;

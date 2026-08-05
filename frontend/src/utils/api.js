// frontend/src/utils/api.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 5000, // 5 second request timeout limit
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('pmosense_token') || localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    let message = 'Network connection issue.';
    
    if (error.code === 'ECONNABORTED' || (error.message && error.message.includes('timeout'))) {
      message = 'Request timed out (5s limit). Server taking too long to respond.';
    } else if (error.response?.data?.message) {
      message = error.response.data.message;
    } else if (error.response?.status === 401) {
      message = 'Session expired. Please log in again.';
    }

    return Promise.reject(new Error(message));
  }
);

export default api;

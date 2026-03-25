import axios from 'axios';

let baseURL = import.meta.env.VITE_API_URL || 'https://skinlesion-classification.onrender.com/api';
if (baseURL.endsWith('/')) baseURL = baseURL.slice(0, -1);
if (!baseURL.endsWith('/api')) baseURL += '/api';

const api = axios.create({
  baseURL: baseURL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// We could add response interceptor to handle 401s and auto logout or token refresh
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('first_name');
      // Redirect handled by protected route checks usually
    }
    return Promise.reject(error);
  }
);

export default api;

import axios from 'axios';

const API_URL = import.meta.env.REACT_APP_BACKEND_URL || '';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

// Auth API
export const authAPI = {
  signup: (data: any) => api.post('/api/auth/signup', data),
  login: (data: any) => api.post('/api/auth/login', data),
  verifyEmail: (token: string) => api.get(`/api/auth/verify-email?token=${token}`),
  resendVerification: (email: string) => api.post('/api/auth/resend-verification', null, { params: { email } }),
  getMe: () => api.get('/api/auth/me'),
  changePassword: (data: any) => api.post('/api/auth/change-password', data),
  updateProfile: (data: any) => api.put('/api/auth/profile', data),
  getCompanies: () => api.get('/api/companies'),
};

// Admin API
export const adminAPI = {
  getPendingEmployees: () => api.get('/api/admin/pending-employees'),
  approveEmployee: (employeeId: string) => api.post(`/api/admin/approve-employee/${employeeId}`),
  getEmployees: () => api.get('/api/admin/employees'),
  getStats: () => api.get('/api/admin/stats'),
};

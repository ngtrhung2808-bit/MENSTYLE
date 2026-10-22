
import axios from 'axios';

// Tạo một Axios Instance dùng chung
const baseUrl = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) || 'http://localhost:5000/api';
const axiosInstance = axios.create({
  // Base URL for API calls – works both in Vite dev server and when run via Node.
  baseURL: baseUrl,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Tự động đính kèm token khi gọi API
axiosInstance.interceptors.request.use(
  (config) => {
    // Guard against environments where localStorage is not available (e.g., Node scripts).
    const token = typeof window !== 'undefined' && window.localStorage
      ? window.localStorage.getItem('menstyle_token')
      : undefined;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Xử lý phản hồi từ API
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn('Phiên đăng nhập không hợp lệ hoặc đã hết hạn');
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;

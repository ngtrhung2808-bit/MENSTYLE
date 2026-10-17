
import axios from 'axios';

// Tạo một Axios Instance dùng chung
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Tự động đính kèm token khi gọi API
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('menstyle_token');

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

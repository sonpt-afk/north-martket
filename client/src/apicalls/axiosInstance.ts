import axios from 'axios';

export const axiosInstance = axios.create();

// Add request interceptor to add token dynamically
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.authorization = `Bearer ${token}`;
  }
  return config;
});
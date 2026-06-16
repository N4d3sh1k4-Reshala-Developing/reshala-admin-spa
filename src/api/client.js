import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const getBaseURL = () => {
  // Runtime env from nginx
  if (window.ENV_CONFIG?.API_BASE_URL) {
    return window.ENV_CONFIG.API_BASE_URL;
  }
  // Build-time env for development
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  return '/api';
};

const client = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true,
});

client.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle token expiration
client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 and not already retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Attempt to refresh the token
        // The gateway will use the HttpOnly refresh cookie
        const { data: refreshResponse } = await axios.post('/api/v0/auth/refresh', {}, { withCredentials: true });
        
        const accessToken = refreshResponse.data?.accessToken || refreshResponse.accessToken;
        useAuthStore.getState().updateToken(accessToken);

        // Retry the original request with new token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return client(originalRequest);
      } catch (refreshError) {
        // Refresh failed (e.g. refresh token expired)
        useAuthStore.getState().logout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default client;

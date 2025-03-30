// src/services/api.ts
import axios from 'axios';
import { useAuthStore } from '../stores/authStore'; // Import store

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000', // Use environment variable
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the token
apiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token; // Get token directly from store state
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Optional: Add a response interceptor for handling 401 errors (e.g., token expired)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token is invalid or expired, clear auth state and redirect to login
      useAuthStore.getState().clearAuth();
      // Avoid redirecting if already on login page to prevent loops
      if (window.location.pathname !== '/login') {
         window.location.href = '/login'; // Or use react-router navigation
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
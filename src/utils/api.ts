// src/utils/api.ts

import axios from 'axios';

const api = axios.create({
  baseURL: '/', // Base URL can be set to an environment variable if needed
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor if needed (e.g., for auth tokens)
api.interceptors.request.use(
  (config) => {
    // Optionally add authorization headers
    // const token = getAuthToken(); // Implement token retrieval
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor to handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle specific status codes or errors
    if (error.response) {
      // Server responded with a status other than 2xx
      console.error('API Error:', error.response.data);
    } else if (error.request) {
      // Request was made but no response received
      console.error('No response received:', error.request);
    } else {
      // Something else caused the error
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api;

import axios from 'axios';

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');

  // Asegura que headers existe
  if (!config.headers) {
    config.headers = {};
  }

  // Si hay token, se añade
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }

  return config;
});

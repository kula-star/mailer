import axios from 'axios';

const configuredApiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const apiOrigin = /^https?:\/\//i.test(configuredApiUrl)
  ? configuredApiUrl.replace(/\/$/, '')
  : `https://${configuredApiUrl.replace(/\/$/, '')}`;
const apiBaseUrl = apiOrigin.endsWith('/api') ? apiOrigin : `${apiOrigin}/api`;

const api = axios.create({
  baseURL: apiBaseUrl
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;

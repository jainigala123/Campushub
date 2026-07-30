import axios from 'axios';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '/api';

const api = axios.create({
  baseURL: apiBaseUrl,
  timeout: 10000,
});

export const fetchEvents = async () => {
  return api.get('/events');
};

export const fetchClubs = async () => {
  return api.get('/clubs');
};

export default api;

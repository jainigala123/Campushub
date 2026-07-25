import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
});

export const fetchEvents = async () => {
  return api.get('/events');
};

export const fetchClubs = async () => {
  return api.get('/clubs');
};

export default api;

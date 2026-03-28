import { getToken } from '@/storage/secureStore';
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.freeapi.app/api/v1',
  timeout: 10000,
});

api.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
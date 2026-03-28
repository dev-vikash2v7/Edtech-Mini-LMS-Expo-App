import api from './api';

export const login = (email: string, password: string) =>
  api.post('/users/login', { email, password });

export const register = (data: any) => {
  return api.post('/users/register', data)
};

export const getCurrentUser = () =>
  api.get('/users/current-user');

export const logoutApi = () =>
  api.post('/users/logout');

export const updateAvatarApi = (formData: FormData) =>
  api.patch('/users/avatar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

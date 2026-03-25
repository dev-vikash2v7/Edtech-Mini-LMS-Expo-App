import * as SecureStore from 'expo-secure-store';

export const setToken = (token: string) =>
  SecureStore.setItemAsync('token', token);

export const getToken = () =>
  SecureStore.getItemAsync('token');

export const removeToken = () =>
  SecureStore.deleteItemAsync('token');
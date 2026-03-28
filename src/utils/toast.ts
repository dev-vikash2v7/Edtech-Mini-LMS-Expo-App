import { DeviceEventEmitter } from 'react-native';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastConfig {
  title: string;
  message?: string;
  type?: ToastType;
}

export const showToast = (config: ToastConfig | string, message?: string, type: ToastType = 'info') => {
  if (typeof config === 'string') {
    DeviceEventEmitter.emit('SHOW_TOAST', { title: config, message, type });
  } else {
    DeviceEventEmitter.emit('SHOW_TOAST', { ...config, type: config.type || 'info' });
  }
};

import { AuthProvider, useAuth } from '@/hooks/useAuth';
import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { StatusBar } from 'react-native';
import '../../global.css';

import { Toast } from '@/components/Toast';

import { requestNotificationPermission } from '@/services/notification.service';

import { Text, View } from 'react-native';

import { useNetwork } from '@/hooks/useNetwork';
import * as Notifications from 'expo-notifications';
import { AppState } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

let isAppActive = true;

AppState.addEventListener('change', (state) => {
  isAppActive = state === 'active';
});

Notifications.setNotificationHandler({
  handleNotification: async (notification) => {
    const savedPreference = await AsyncStorage.getItem('notifications_enabled');
    if (savedPreference === 'false') {
      return {
        shouldShowAlert: false,
        shouldPlaySound: false,
        shouldSetBadge: false,
      };
    }

    const type = notification.request.content.data?.type;

    return {
      shouldShowAlert: type === 'important' ? true : !isAppActive,

      shouldPlaySound: type === 'important' ? true : !isAppActive,

      shouldSetBadge: false,
    };
  },
});

function RootNav() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (loading) return;

    const inAuthScreen = segments[0] === 'login';

    if (!user && !inAuthScreen) {
      router.replace('/login');
    } else if (user && inAuthScreen) {
      router.replace('/home');
    }
  }, [user, loading]);

  return <Stack screenOptions={{ headerShown: false }} />;
}

export default function RootLayout() {


  const { isOffline } = useNetwork();



  useEffect(() => {
    const checkAndRequestPermission = async () => {
      const savedPreference = await AsyncStorage.getItem('notifications_enabled');
      if (savedPreference !== 'false') {
        await requestNotificationPermission();
      }
    };
    checkAndRequestPermission();
  }, []);


  return (
    <AuthProvider>
      <StatusBar barStyle={isOffline ? 'light-content' : 'dark-content'} />

      {isOffline && (
        <View className="bg-red-500 pt-8 pb-3 ">
          <Text className="text-white text-center">
            No Internet Connection
          </Text>
        </View>
      )}

      <RootNav />
      <Toast />
    </AuthProvider>
  );
}


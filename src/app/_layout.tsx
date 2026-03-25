import { AuthProvider, useAuth } from '@/store/auth.store';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

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

export default function Layout() {
  return (
    <AuthProvider>
      <StatusBar style="light" />

      <RootNav />
    </AuthProvider>
  );
}
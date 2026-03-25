import { useAuth } from '@/store/auth.store';
import { Redirect } from 'expo-router';

export default function Index() {
  const { user, loading } = useAuth();

  if (loading) return null;

  return user ? <Redirect href="/home" /> : <Redirect href="/login" />;
}
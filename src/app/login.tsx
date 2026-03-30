import { useAuth } from '@/hooks/useAuth';
import { showToast } from '@/utils/toast';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SafeAreaView } from 'react-native-safe-area-context';
import { login } from '../services/auth.service';

export default function Login() {
  const { loginUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const params = useLocalSearchParams();


  const handleLogin = async () => {
    try {
      if (!email || !password) {
        showToast('Validation Error', 'Please enter your email and password.', 'error');
        return;
      }
      setLoading(true);
      const res = await login(email, password);
      const token = res.data.data.accessToken;
      const user = res.data.data.user;
      await loginUser(token, user);
      router.replace('/home');


    } catch (e: any) {
      console.log(e.response?.data || e.message);
      showToast('Login Failed', e.response?.data?.message || 'Login failed. Please check your credentials.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAwareScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingHorizontal: 28 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        enableOnAndroid={true}
        extraScrollHeight={20}
      >
        <View className="mb-10 mt-6">
          <View className="h-16 w-16 bg-indigo-50 rounded-2xl items-center justify-center mb-6">
            <Text className="text-3xl">🚀</Text>
          </View>
          <Text className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
            Welcome Back
          </Text>
          <Text className="text-base text-slate-500 font-medium leading-6">
            Sign in to continue your secure learning journey.
          </Text>
        </View>

        <View>
          <View className="mb-5">
            <Text className="text-sm font-bold text-slate-700 mb-2 ml-1">Email Address</Text>
            <TextInput
              placeholder="hello@example.com"
              placeholderTextColor="#94a3b8"
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
              className="bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-base text-slate-900 font-medium"
            />
          </View>

          <View className="mb-4">
            <Text className="text-sm font-bold text-slate-700 mb-2 ml-1">Password</Text>
            <View className="relative justify-center">
              <TextInput
                placeholder="••••••••"
                placeholderTextColor="#94a3b8"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
                className="bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-base text-slate-900 font-medium pr-12"
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                className="absolute right-4"
              >
                <Ionicons name={showPassword ? "eye-off" : "eye"} size={24} color="#94a3b8" />
              </TouchableOpacity>
            </View>
          </View>

          <View className="flex-row justify-end mb-6">
            <TouchableOpacity>
              <Text className="text-sm font-bold text-indigo-600">Forgot Password?</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="mt-4">
          <TouchableOpacity
            onPress={handleLogin}
            disabled={loading}
            className={`py-4 rounded-2xl items-center ${loading ? 'bg-indigo-400' : 'bg-indigo-600'}`}
            style={{ shadowColor: '#4f46e5', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5 }}
          >
            {loading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text className="text-white font-bold text-lg tracking-wide">
                Sign In
              </Text>
            )}
          </TouchableOpacity>

          <View className="flex-row justify-center mt-10 mb-8">
            <Text className="text-slate-500 font-medium text-base">
              Don't have an account?{' '}
            </Text>
            <TouchableOpacity onPress={() => router.push('/register')}>
              <Text className="text-indigo-600 font-bold text-base">Create one</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}
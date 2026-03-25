import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { login } from '../services/auth.service';
import { useAuth } from '../store/auth.store';


export default function Login() {
  const { loginUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const handleLogin = async () => {
    try {
      setLoading(true);
      const res = await login(email, password);
      console.log(res.data)
      const token = res.data.data.accessToken;
      await loginUser(token);
    } catch (e) {
      console.log('Login failed', e);
    } finally {
      setLoading(false);
    }
  };

  return (

    <View className="flex-1 justify-center px-6">

      <Text className="text-3xl font-bold text-center mb-8">
        Welcome Back 👋
      </Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        className="border border-gray-300 rounded-xl px-4 py-3 mb-4"
      />

      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        className="border border-gray-300 rounded-xl px-4 py-3 mb-6"
      />

      <TouchableOpacity
        onPress={handleLogin}
        className="bg-black py-4 rounded-xl items-center"
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white font-semibold text-lg">
            Login
          </Text>
        )}
      </TouchableOpacity>


      <TouchableOpacity onPress={() => router.push('/register')} className="mt-6">
        <Text className="text-center text-gray-600">
          Don't have an account? <Text className="font-bold text-black">Register</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}
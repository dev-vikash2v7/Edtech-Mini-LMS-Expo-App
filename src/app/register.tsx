import { useRouter } from 'expo-router';
import { useState } from 'react';
import { showToast } from '@/utils/toast';
import {
    ActivityIndicator,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SafeAreaView } from 'react-native-safe-area-context';
import { register } from '../services/auth.service';

export default function Register() {
    const router = useRouter();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    function containsUppercase(str: string) {
        return /[A-Z]/.test(str);
    }

    const handleRegister = async () => {
        try {
            if (!name || !email || !password) {
                showToast('Validation Error', 'Please fill all the fields.', 'error');
                return;
            }
            if (name.length < 3) {
                showToast('Validation Error', 'Username should be at least 3 characters long.', 'error');
                return;
            }
            if (containsUppercase(name)) {
                showToast('Validation Error', 'Username should not contain uppercase letters.', 'error');
                return;
            }
            if (password.length < 6) {
                showToast('Validation Error', 'Password should be at least 6 characters long.', 'error');
                return;
            }
            setLoading(true);


            const res = await register({
                username: name,
                email,
                password,
                role: "USER",
            });

            showToast('Registration Successful 🎉', 'Welcome aboard! You can now sign in.', 'success');
            router.replace({ pathname: '/login', params: { newUser: true } });

        } catch (e: any) {
            console.log(e.response?.data || e.message);
            showToast('Registration Failed', e.response?.data?.message || 'Register failed. Please check your inputs.', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <KeyboardAwareScrollView
                contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingHorizontal: 28, paddingVertical: 20 }}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                enableOnAndroid={true}
                extraScrollHeight={0}
            >
                <View className="mb-10 mt-2">
                    <View className="h-16 w-16 bg-indigo-50 rounded-2xl items-center justify-center mb-6">
                        <Text className="text-3xl">✨</Text>
                    </View>
                    <Text className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
                        Create Account
                    </Text>
                    <Text className="text-base text-slate-500 font-medium leading-6">
                        Join us to start your learning journey today.
                    </Text>
                </View>

                <View>
                    <View className="mb-5">
                        <Text className="text-sm font-bold text-slate-700 mb-2 ml-1">Full Name</Text>
                        <TextInput
                            placeholder="John Doe"
                            placeholderTextColor="#94a3b8"
                            autoCapitalize="words"
                            value={name}
                            onChangeText={setName}
                            className="bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-base text-slate-900 font-medium"
                        />
                    </View>

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

                    <View className="mb-6">
                        <Text className="text-sm font-bold text-slate-700 mb-2 ml-1">Password</Text>
                        <TextInput
                            placeholder="••••••••"
                            placeholderTextColor="#94a3b8"
                            secureTextEntry
                            value={password}
                            onChangeText={setPassword}
                            className="bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-base text-slate-900 font-medium"
                        />
                    </View>
                </View>

                <View className="mt-2">
                    <TouchableOpacity
                        onPress={handleRegister}
                        disabled={loading}
                        className={`py-4 rounded-2xl items-center ${loading ? 'bg-indigo-400' : 'bg-indigo-600'}`}
                        style={{ shadowColor: '#4f46e5', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5 }}
                    >
                        {loading ? (
                            <ActivityIndicator color="#ffffff" />
                        ) : (
                            <Text className="text-white font-bold text-lg tracking-wide">
                                Sign Up
                            </Text>
                        )}
                    </TouchableOpacity>

                    <View className="flex-row justify-center mt-10 mb-8">
                        <Text className="text-slate-500 font-medium text-base">
                            Already have an account?{' '}
                        </Text>
                        <TouchableOpacity onPress={() => router.push('/login')}>
                            <Text className="text-indigo-600 font-bold text-base">Sign In</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAwareScrollView>
        </SafeAreaView>
    );
}
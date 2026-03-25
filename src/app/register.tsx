import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { ActivityIndicator, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { register } from '../services/auth.service';

export default function Register() {
    const router = useRouter();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        try {
            setLoading(true);

            await register({
                name,
                email,
                password,
            });

            router.replace('/login');

        } catch (e) {
            console.log(e);
            console.log('Register failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <StatusBar style="dark" />

            <View className="flex-1 justify-center px-6">

                <Text className="text-3xl font-bold text-center mb-8">
                    Create Account 🚀
                </Text>

                <TextInput
                    placeholder="Full Name"
                    value={name}
                    onChangeText={setName}
                    className="border border-gray-300 rounded-xl px-4 py-3 mb-4"
                />

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
                    onPress={handleRegister}
                    className="bg-black py-4 rounded-xl items-center"
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text className="text-white font-semibold text-lg">
                            Register
                        </Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => router.push('/login')}
                    className="mt-6"
                >
                    <Text className="text-center text-gray-600">
                        Already have an account? <Text className="font-bold text-black">Login</Text>
                    </Text>
                </TouchableOpacity>

            </View>
        </SafeAreaView>
    );
}
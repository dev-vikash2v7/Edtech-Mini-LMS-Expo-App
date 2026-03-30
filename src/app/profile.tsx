import { useAuth } from '@/hooks/useAuth';
import { useEnrolled } from '@/hooks/useEnrolled';
import profile from '@/images/profile.png';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Image,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Profile() {
    const { user, logout, updateAvatar } = useAuth();
    const { enrolled } = useEnrolled(user?._id);

    const [loading, setLoading] = useState<boolean>(false);
    const [image, setImage] = useState<string>(user?.avatar?.url || '');
    const [bookmarks, setBookmarks] = useState<number[]>([]);

    const avatarUri = user?.avatar?.localUri || user?.avatar?.url || image;

    const loadBookmarks = async () => {
        const stored = await AsyncStorage.getItem(user?._id + '/bookmarks');
        if (stored) {
            setBookmarks(JSON.parse(stored));
        }
    };


    useEffect(() => {
        loadBookmarks();
    }, []);

    const pickImage = async () => {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permission.granted === false) return;

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });


        setLoading(true)
        if (!result.canceled) {
            const uri = result.assets[0].uri;
            setImage(uri);
            try {
                await updateAvatar(uri);
            } catch (error) {
                console.log('Failed to upload avatar', error);
            }
        }
        setLoading(false)
    };


    return (
        <SafeAreaView className="flex-1 bg-slate-50">

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
                <View className="bg-white rounded-b-[40px] shadow-sm pb-8 px-6 pt-6 mb-8">
                    <Text className="text-2xl font-extrabold text-slate-900 mb-6 text-center tracking-tight">My Profile</Text>

                    <View className="items-center">
                        <TouchableOpacity onPress={pickImage} activeOpacity={0.8} className="relative mb-4">
                            <View style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.15, shadowRadius: 10, elevation: 6 }}>
                                {loading ? (
                                    <View className="w-32 h-32 rounded-full border-4 border-white bg-slate-200 items-center justify-center">
                                        <ActivityIndicator size="large" color="#6366f1" />
                                    </View>
                                ) : (
                                    <Image
                                        source={(!avatarUri) ? profile : { uri: avatarUri }}
                                        className="w-32 h-32 rounded-full border-4 border-white bg-slate-200"
                                    />
                                )}
                            </View>
                            <View className="absolute bottom-1 right-1 bg-indigo-600 w-10 h-10 rounded-full items-center justify-center border-4 border-white">
                                <Text className="text-white text-sm">📸</Text>
                            </View>
                        </TouchableOpacity>

                        <Text className="text-2xl font-bold text-slate-900 tracking-tight">
                            {user?.username || 'Learner Profile'}
                        </Text>
                        <Text className="text-sm text-slate-500 font-medium mt-1">
                            {user?.email || 'Student Account'}
                        </Text>
                    </View>
                </View>

                <View className="px-6 mb-8">
                    <Text className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 ml-2">Learning Stats</Text>
                    <View className="flex-row justify-between" style={{ gap: 16 }}>
                        <View className="flex-1 bg-white py-6 px-4 rounded-[28px] shadow-sm items-center border border-slate-100">
                            <View className="w-14 h-14 bg-indigo-50 rounded-full items-center justify-center mb-3">
                                <Text className="text-2xl">🔖</Text>
                            </View>
                            <Text className="text-3xl font-black text-slate-800 tracking-tight">
                                {bookmarks.length}
                            </Text>
                            <Text className="text-xs font-bold text-slate-500 mt-1 uppercase tracking-wider">
                                Bookmarked
                            </Text>
                        </View>

                        <View className="flex-1 bg-white py-6 px-4 rounded-[28px] shadow-sm items-center border border-slate-100">
                            <View className="w-14 h-14 bg-emerald-50 rounded-full items-center justify-center mb-3">
                                <Text className="text-2xl">🏆</Text>
                            </View>
                            <Text className="text-3xl font-black text-slate-800 tracking-tight">
                                {enrolled.length}
                            </Text>
                            <Text className="text-xs font-bold text-slate-500 mt-1 uppercase tracking-wider">
                                Enrolled
                            </Text>
                        </View>
                    </View>
                </View>

                <View className="px-6 mb-8">
                    <Text className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 ml-2">Preferences</Text>

                    <TouchableOpacity className="bg-white p-4 items-center justify-between border border-slate-100 mb-3" style={{ borderRadius: 24, flexDirection: 'row' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <View className="w-12 h-12 bg-slate-50 rounded-full items-center justify-center mr-4">
                                <Text className="text-lg">⚙️</Text>
                            </View>
                            <Text className="text-base font-bold text-slate-800">Account Settings</Text>
                        </View>
                        <Text className="text-slate-300 font-bold text-lg mr-2">›</Text>
                    </TouchableOpacity>


                    <TouchableOpacity className="bg-white p-4 items-center justify-between border border-slate-100" style={{ borderRadius: 24, flexDirection: 'row' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <View className="w-12 h-12 bg-slate-50 rounded-full items-center justify-center mr-4">
                                <Text className="text-lg">🎧</Text>
                            </View>
                            <Text className="text-base font-bold text-slate-800">Help & Support</Text>
                        </View>
                        <Text className="text-slate-300 font-bold text-lg mr-2">›</Text>
                    </TouchableOpacity>
                </View>

                {/* Logout Button */}
                <View className="px-6">
                    <TouchableOpacity
                        onPress={logout}
                        className="bg-red-50 py-4 items-center border border-red-100"
                        style={{ borderRadius: 20, flexDirection: 'row', justifyContent: 'center' }}
                    >
                        <Text className="text-red-600 font-bold text-lg mr-2">🚪</Text>
                        <Text className="text-red-600 font-bold text-lg tracking-wide">
                            Sign Out
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
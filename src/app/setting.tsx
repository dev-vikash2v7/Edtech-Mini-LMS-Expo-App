import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    Alert,
    AppState,
    Image,
    Linking,
    Modal,
    NativeModules,
    Platform,
    ScrollView,
    Switch,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const APP_ICONS = [
    { id: 'default', name: 'Default', color: '#000', image: require('../../assets/icon.png') },
    { id: 'green', name: 'Green Icon', color: '#10b981', image: require('../../assets/icon1.png') },
    { id: 'blue', name: 'Blue Icon', color: '#4f46e5', image: require('../../assets/icon2.png') },
    { id: 'red', name: 'Red Icon', color: '#ef4444', image: require('../../assets/icon3.png') },
];

export default function Setting() {
    const router = useRouter();
    const [showIconModal, setShowIconModal] = useState(false);
    const [currentIcon, setCurrentIcon] = useState('default');
    const [notificationsEnabled, setNotificationsEnabled] = useState(false);

    useEffect(() => {
        loadCurrentIcon();
        checkNotificationPermission();

        const subscription = AppState.addEventListener('change', nextAppState => {
            if (nextAppState === 'active') {
                checkNotificationPermission();
            }
        });

        return () => {
            subscription.remove();
        };
    }, []);

    const checkNotificationPermission = async () => {
        const { status } = await Notifications.getPermissionsAsync();
        const savedPreference = await AsyncStorage.getItem('notifications_enabled');

        if (status === 'granted' && savedPreference !== 'false') {
            setNotificationsEnabled(true);
        } else {
            setNotificationsEnabled(false);
        }
    };

    const loadCurrentIcon = async () => {
        const savedIcon = await AsyncStorage.getItem('app_icon_key');
        if (savedIcon) setCurrentIcon(savedIcon);
    };

    const changeIcon = async (iconId: string) => {
        try {
            if (Platform.OS !== 'android') {
                Alert.alert('Info', 'Dynamic icons supported only on Android (custom setup)');
                return;
            }

            const module = NativeModules.AppIconModule;

            if (!module) {
                Alert.alert('Error', 'Native module not linked properly');
                return;
            }

            const aliasMap: Record<string, string> = {
                default: 'MainActivityAlias',
                blue: 'MainActivityIcon1',
                green: 'MainActivityIcon2',
                red: 'MainActivityIcon3',
            };

            const aliasName = aliasMap[iconId];

            if (!aliasName) {
                throw new Error('Invalid icon');
            }
            await module.changeIcon(aliasName);

            await AsyncStorage.setItem('app_icon_key', iconId);
            setCurrentIcon(iconId);

            Alert.alert(
                'Restart Required',
                'App will restart to apply new icon.',
                [{ text: 'OK' }]
            );
            setShowIconModal(false);



        } catch (error) {
            console.error('Icon change error:', error);
            Alert.alert('Error', 'Failed to change app icon');
        }
    };

    const toggleNotifications = async () => {
        if (!notificationsEnabled) {
            const { status } = await Notifications.requestPermissionsAsync();
            if (status === 'granted') {
                await AsyncStorage.setItem('notifications_enabled', 'true');

                console.log('Notifications enabled');

                Notifications.setNotificationHandler({
                    handleNotification: async () => ({
                        shouldShowAlert: true,
                        shouldPlaySound: true,
                        shouldSetBadge: true,
                    }),
                });
                setNotificationsEnabled(true);
            } else {
                Alert.alert(
                    'Permission Denied',
                    'To enable notifications, please allow it in your system settings.',
                    [
                        { text: 'Cancel', style: 'cancel' },
                        { text: 'Open Settings', onPress: () => Linking.openSettings() }
                    ]
                );
            }
        } else {
            await AsyncStorage.setItem('notifications_enabled', 'false');
            await Notifications.cancelAllScheduledNotificationsAsync();

            Notifications.setNotificationHandler({
                handleNotification: async () => ({
                    shouldShowAlert: false,
                    shouldPlaySound: false,
                    shouldSetBadge: false,
                }),
            });

            setNotificationsEnabled(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-slate-50">
            <View className="px-6 pt-4 pb-2 flex-row items-center border-b border-slate-100 bg-white">
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="w-10 h-10 bg-slate-50 rounded-full items-center justify-center mr-4"
                >
                    <Text className="text-xl text-slate-800">←</Text>
                </TouchableOpacity>
                <Text className="text-xl font-bold text-slate-900">Settings</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 24 }}>
                <Text className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 ml-2">Preferences</Text>

                <TouchableOpacity
                    onPress={() => setShowIconModal(true)}
                    className="bg-white p-4 items-center justify-between border border-slate-100 mb-4 shadow-sm"
                    style={{ borderRadius: 24, flexDirection: 'row' }}
                >
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View className="w-12 h-12 bg-indigo-50 rounded-full items-center justify-center mr-4">
                            <Text className="text-lg">🎨</Text>
                        </View>
                        <View>
                            <Text className="text-base font-bold text-slate-800">App Icon</Text>
                            <Text className="text-xs text-slate-400 font-medium">Customize your home screen</Text>
                        </View>
                    </View>
                    <View className="flex-row items-center">
                        <Text className="text-indigo-600 text-sm font-bold mr-2">Change</Text>
                        <Text className="text-slate-300 font-bold text-lg mr-2">›</Text>
                    </View>
                </TouchableOpacity>

                <View
                    className="bg-white p-4 items-center justify-between border border-slate-100 mb-4 shadow-sm"
                    style={{ borderRadius: 24, flexDirection: 'row' }}
                >
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View className="w-12 h-12 bg-emerald-50 rounded-full items-center justify-center mr-4">
                            <Text className="text-lg">🔔</Text>
                        </View>
                        <View>
                            <Text className="text-base font-bold text-slate-800">Notifications</Text>
                            <Text className="text-xs text-slate-400 font-medium">{notificationsEnabled ? 'Push alerts active' : 'Turn on push alerts'}</Text>
                        </View>
                    </View>
                    <Switch
                        value={notificationsEnabled}
                        onValueChange={toggleNotifications}
                        trackColor={{ false: '#e2e8f0', true: '#10b981' }}
                        thumbColor={notificationsEnabled ? '#ffffff' : '#f8fafc'}
                    />
                </View>

            </ScrollView>

            <Modal
                visible={showIconModal}
                transparent
                animationType="slide"
                onRequestClose={() => setShowIconModal(false)}
            >
                <View className="flex-1 justify-end bg-black/50">
                    <View className="bg-white rounded-t-[40px] p-8 pb-12">
                        <View className="flex-row justify-between items-center mb-8">
                            <View>
                                <Text className="text-2xl font-black text-slate-900">Choose App Icon</Text>
                                <Text className="text-slate-400 text-sm font-medium">Select your favorite style</Text>
                            </View>
                            <TouchableOpacity onPress={() => setShowIconModal(false)} className="bg-slate-100 p-2 rounded-full w-10 h-10 items-center justify-center">
                                <Text className="text-slate-500 font-bold text-lg">✕</Text>
                            </TouchableOpacity>
                        </View>

                        <View className="flex-row flex-wrap justify-between" style={{ gap: 16 }}>
                            {APP_ICONS.map((icon) => (
                                <TouchableOpacity
                                    key={icon.id}
                                    onPress={() => changeIcon(icon.id)}
                                    className={`w-[47%] p-4 rounded-3xl border-2 items-center transition-all ${currentIcon === icon.id ? 'border-indigo-600 bg-indigo-50/30 shadow-md' : 'border-slate-100 bg-slate-50'}`}
                                >
                                    <View style={{
                                        shadowColor: icon.color,
                                        shadowOffset: { width: 0, height: 4 },
                                        shadowOpacity: 0.2,
                                        shadowRadius: 8,
                                        elevation: 4,
                                        backgroundColor: 'white',
                                        borderRadius: 20,
                                        padding: 4
                                    }}>
                                        <Image
                                            source={icon.image}
                                            className="w-16 h-16 rounded-2xl"
                                        />
                                    </View>
                                    <Text className={`text-base font-bold mt-4 ${currentIcon === icon.id ? 'text-indigo-600' : 'text-slate-700'}`}>
                                        {icon.name}
                                    </Text>
                                    {currentIcon === icon.id && (
                                        <View className="absolute top-3 right-3 bg-indigo-600 rounded-full w-6 h-6 items-center justify-center shadow-sm">
                                            <Text className="text-white text-[12px] font-bold">✓</Text>
                                        </View>
                                    )}
                                </TouchableOpacity>
                            ))}
                        </View>


                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

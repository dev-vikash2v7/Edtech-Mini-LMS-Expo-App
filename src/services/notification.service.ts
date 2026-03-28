import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';

export const updateLastOpen = async () => {
    await AsyncStorage.setItem('lastOpen', Date.now().toString());
};

export const resetReminder = async () => {
    await Notifications.cancelAllScheduledNotificationsAsync();
};

export const scheduleReminderNotification = async () => {
    const lastOpen = await AsyncStorage.getItem('lastOpen');
    const now = Date.now();

    const diff = now - Number(lastOpen);

    const remaining = 30 - Math.floor(diff / 1000);
    await Notifications.scheduleNotificationAsync({
        content: {
            title: "Come back!",
            body: "Continue learning 🚀",
            data: {
                type: 'reminder',
            },
        },
        trigger: { seconds: remaining, type: 'timeInterval', repeats: true },
    });
};


export const requestNotificationPermission = async () => {
    await Notifications.requestPermissionsAsync();
};

export const triggerBookmarkNotification = async () => {
    await Notifications.scheduleNotificationAsync({
        content: {
            title: "Great job!",
            body: "You bookmarked 5 courses 🎉",
            data: {
                type: 'important',
            },
        },
        trigger: null,
    });
};

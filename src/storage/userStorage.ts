import AsyncStorage from '@react-native-async-storage/async-storage';

const USER_KEY = 'auth_user';

export const saveUser = async (user: any) => {
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const getSavedUser = async () => {
    const data = await AsyncStorage.getItem(USER_KEY);
    return data ? JSON.parse(data) : null;
};

export const removeSavedUser = async () => {
    await AsyncStorage.removeItem(USER_KEY);
};
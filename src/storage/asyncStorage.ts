import AsyncStorage from '@react-native-async-storage/async-storage';

export const getBookmarks = async () => {
    const data = await AsyncStorage.getItem('bookmarks');
    return data ? JSON.parse(data) : [];
};

export const saveBookmarks = async (bookmarks: string[]) => {
    await AsyncStorage.setItem('bookmarks', JSON.stringify(bookmarks));
};
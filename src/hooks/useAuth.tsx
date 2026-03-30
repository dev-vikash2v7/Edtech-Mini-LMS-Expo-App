import { getSavedUser, removeSavedUser, saveUser } from '@/storage/userStorage';
import * as FileSystem from 'expo-file-system/legacy';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { getCurrentUser, logoutApi, updateAvatarApi } from '../services/auth.service';
import { getToken, removeToken, setToken } from '../storage/secureStore';
import { useNetwork } from './useNetwork';

export interface User {
    _id: string;
    username: string;
    email: string;
    avatar: { url: string; localUri?: string };
    role: string;
    [key: string]: any;
}

type AuthContextType = {
    user: User | null;
    loginUser: (token: string, userData: User, newUser?: boolean) => Promise<void>;
    logout: () => Promise<void>;
    loading: boolean;
    updateAvatar: (imageUri: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const { isOffline } = useNetwork()


    const updateUser = async (userData: User) => {
        let localUri = userData.avatar?.localUri;

        if (userData.avatar?.url) {
            try {
                let imageUrl = userData.avatar.url;

                if (imageUrl.startsWith('http://')) {
                    imageUrl = imageUrl.replace('http://', 'https://');
                }

                const filename =
                    imageUrl.split('/').pop()?.split('?')[0] ||
                    `avatar_${userData._id}.jpg`;

                const fileUri = FileSystem.documentDirectory + filename;

                const fileInfo = await FileSystem.getInfoAsync(fileUri);

                if (fileInfo.exists) {
                    localUri = fileUri;
                } else {
                    const downloadResult = await FileSystem.downloadAsync(
                        imageUrl,
                        fileUri
                    );

                    if (downloadResult.status === 200) {
                        localUri = downloadResult.uri;
                    }
                }
            } catch (error) {
                console.log('Error downloading avatar:', error);
            }
        }

        const updatedUser: User = {
            ...userData,
            avatar: {
                url: userData.avatar.url,
                localUri,
            },
        };


        setUser(updatedUser);
        await saveUser(updatedUser);
    };

    const loginUser = async (token: string, userData: User) => {
        await setToken(token);

        updateUser(userData);
    };

    const logout = async () => {
        try {
            await logoutApi();
        } catch (error) {
            console.log('Error logging out via API:', error);
        } finally {
            await removeToken();
            await removeSavedUser()
            setUser(null);
        }
    };
    const updateAvatar = async (imageUri: string) => {
        try {
            const formData = new FormData();
            const filename = imageUri.split('/').pop() || 'avatar.jpg';
            const match = /\.(\w+)$/.exec(filename);
            const type = match ? `image/${match[1]}` : `image`;

            formData.append('avatar', {
                uri: imageUri,
                name: filename,
                type,
            } as any);

            const res = await updateAvatarApi(formData);

            if (res.data?.data) {

                updateUser(res.data.data);
            }
        } catch (error: any) {
            console.log('Error updating avatar:', error);
            throw error;
        }
    };

    useEffect(() => {
        (async () => {
            const token = await getToken();

            if (!token) {
                setLoading(false);
                return;
            }

            try {
                if (!isOffline) {
                    const res = await getCurrentUser();


                    await updateUser(res.data.data);
                } else {
                    const savedUser = await getSavedUser();

                    if (savedUser) {
                        setUser(savedUser);
                    }
                }
            } catch (error) {
                console.log('Error fetching current user:', error);

                const savedUser = await getSavedUser();
                if (savedUser) {
                    setUser(savedUser);
                } else {
                    await removeToken();
                    setUser(null);
                }
            }

            setLoading(false);
        })();
    }, [isOffline]);

    return (
        <AuthContext.Provider value={{ user, loginUser, logout, loading, updateAvatar }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    return context;
};
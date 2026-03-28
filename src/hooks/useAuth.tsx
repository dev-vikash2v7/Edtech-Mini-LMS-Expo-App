import { getSavedUser, removeSavedUser, saveUser } from '@/storage/userStorage';
import { useNetInfo } from '@react-native-community/netinfo';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { getCurrentUser, logoutApi, updateAvatarApi } from '../services/auth.service';
import { getToken, removeToken, setToken } from '../storage/secureStore';

export interface User {
    _id: string;
    username: string;
    email: string;
    avatar: { url: string };
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
    const { isOffline } = useNetInfo()


    const updateUser = async (userData: User, newUser?: boolean) => {
        const updatedUser = {
            username: userData.username,
            email: userData.email,
            avatar: newUser
                ? { url: `https://ui-avatars.com/api/?name=${userData.username}` }
                : userData.avatar,
            role: userData.role,
            _id: userData._id,
        };

        setUser(updatedUser);

        await saveUser(updatedUser);
    };

    const loginUser = async (token: string, userData: User, newUser?: boolean) => {
        await setToken(token);
        console.log({
            user

        })
        updateUser(userData, newUser);
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

                    const avatar = res.data.data.avatar.url;

                    let avatarResult;
                    try {
                        avatarResult = await fetch(avatar);
                    } catch (error) {
                        console.log(error, 'avatar fetch error');
                    }

                    await updateUser(res.data.data, !avatarResult);
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
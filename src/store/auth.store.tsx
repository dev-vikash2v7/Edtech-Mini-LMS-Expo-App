import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { getToken, removeToken, setToken } from '../storage/secureStore';

type AuthContextType = {
    user: { token: string } | null;
    loginUser: (token: string) => Promise<void>;
    logout: () => Promise<void>;
    loading: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<{ token: string } | null>(null);
    const [loading, setLoading] = useState(true);

    const loginUser = async (token: string) => {
        await setToken(token);
        setUser({ token });
    };

    const logout = async () => {
        await removeToken();
        setUser(null);
    };

    useEffect(() => {
        (async () => {
            const token = await getToken();
            if (token) setUser({ token });
            setLoading(false);
        })();
    }, []);

    return (
        <AuthContext.Provider value={{ user, loginUser, logout, loading }
        }>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);

    return context;
};
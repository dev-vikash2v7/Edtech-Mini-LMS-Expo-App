import NetInfo from '@react-native-community/netinfo';
import { useEffect, useState } from 'react';

export const useNetwork = () => {
    const [isOffline, setIsOffline] = useState(false);

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener((state) => {
            setIsOffline(!state.isConnected);
        });

        return unsubscribe;
    }, []);

    return { isOffline };
};
import React, { useEffect, useState, useRef } from 'react';
import { Animated, DeviceEventEmitter, Text, View, Platform } from 'react-native';
import { ToastConfig } from '@/utils/toast';

export const Toast = () => {
    const [config, setConfig] = useState<ToastConfig | null>(null);
    const translateY = useRef(new Animated.Value(-150)).current;

    useEffect(() => {
        const listener = DeviceEventEmitter.addListener('SHOW_TOAST', (toastConfig: ToastConfig) => {
            setConfig(toastConfig);

            Animated.spring(translateY, {
                toValue: Platform.OS === 'ios' ? 60 : 40,
                useNativeDriver: true,
                speed: 12,
            }).start();

            setTimeout(() => {
                Animated.timing(translateY, {
                    toValue: -150,
                    duration: 300,
                    useNativeDriver: true,
                }).start(() => setConfig(null));
            }, 3000);
        });

        return () => {
            listener.remove();
        };
    }, [translateY]);

    if (!config) return null;

    const bgColors = {
        success: 'bg-emerald-500',
        error: 'bg-red-500',
        info: 'bg-indigo-500',
    };

    const bgColor = bgColors[config.type || 'info'];

    return (
        <Animated.View
            className={`absolute left-5 right-5 z-50 rounded-2xl p-4 shadow-xl flex-row items-center ${bgColor}`}
            style={{ transform: [{ translateY }], elevation: 10 }}
        >
            <View className="flex-1">
                <Text className="text-white font-bold text-base">{config.title}</Text>
                {config.message ? (
                    <Text className="text-white/90 text-sm mt-0.5">{config.message}</Text>
                ) : null}
            </View>
        </Animated.View>
    );
};

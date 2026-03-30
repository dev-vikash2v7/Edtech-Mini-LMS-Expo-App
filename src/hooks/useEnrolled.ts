import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useMemo, useState } from 'react';
import { useFocusEffect } from 'expo-router';

export const useEnrolled = (userId?: string) => {
    const [enrolled, setEnrolled] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    const enrolledSet = useMemo(
        () => new Set(enrolled),
        [enrolled]
    );

    const storageKey = `${userId}/enrolled`;

    const loadEnrolled = useCallback(async () => {
        if (!userId) return;

        try {
            setLoading(true);
            const stored = await AsyncStorage.getItem(storageKey);

            if (stored) {
                const parsed = JSON.parse(stored).map(String);
                setEnrolled(parsed);
            }
        } catch (err) {
            console.log('Enrolled load error', err);
        } finally {
            setLoading(false);
        }
    }, [userId]);

    const toggleEnrolled = useCallback(
        async (rawId: string | number) => {
            if (!userId) return;

            const id = String(rawId);
            let updated: string[];

            if (enrolledSet.has(id)) {
                updated = enrolled.filter((e) => e !== id);
            } else {
                updated = [...enrolled, id];
            }

            setEnrolled(updated);

            try {
                await AsyncStorage.setItem(storageKey, JSON.stringify(updated));
            } catch (err) {
                console.log('Enrolled save error', err);
            }
        },
        [enrolled, enrolledSet, userId]
    );

    const isEnrolled = useCallback(
        (id: string | number) => {
            return enrolledSet.has(String(id));
        },
        [enrolledSet]
    );

    useFocusEffect(
        useCallback(() => {
            loadEnrolled();
        }, [loadEnrolled])
    );

    return {
        enrolled,
        enrolledSet,
        loading,
        toggleEnrolled,
        isEnrolled,
        reload: loadEnrolled,
    };
};

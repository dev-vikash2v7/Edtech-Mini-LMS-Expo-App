import { triggerBookmarkNotification } from '@/services/notification.service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useMemo, useState } from 'react';

export const useBookmarks = (userId?: string) => {
    const [bookmarks, setBookmarks] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    const bookmarkSet = useMemo(
        () => new Set(bookmarks),
        [bookmarks]
    );

    const storageKey = `${userId}/bookmarks`;

    const loadBookmarks = useCallback(async () => {
        if (!userId) return;

        try {
            setLoading(true);
            const stored = await AsyncStorage.getItem(storageKey);

            if (stored) {
                const parsed = JSON.parse(stored).map(String);
                setBookmarks(parsed);
            }
        } catch (err) {
            console.log('Bookmark load error', err);
        } finally {
            setLoading(false);
        }
    }, [userId]);

    const toggleBookmark = useCallback(
        async (rawId: string | number) => {
            if (!userId) return;

            const id = String(rawId);
            let updated: string[];

            if (bookmarkSet.has(id)) {
                updated = bookmarks.filter((b) => b !== id);
            } else {
                updated = [...bookmarks, id];
            }

            setBookmarks(updated);

            try {
                await AsyncStorage.setItem(storageKey, JSON.stringify(updated));

                if (updated.length === 5) {
                    triggerBookmarkNotification();
                }
            } catch (err) {
                console.log('Bookmark save error', err);
            }
        },
        [bookmarks, bookmarkSet, userId]
    );

    const isBookmarked = useCallback(
        (id: string | number) => {
            return bookmarkSet.has(String(id));
        },
        [bookmarkSet]
    );

    useEffect(() => {
        loadBookmarks();
    }, [loadBookmarks]);

    return {
        bookmarks,
        bookmarkSet,
        loading,
        toggleBookmark,
        isBookmarked,
        reload: loadBookmarks,
    };
};
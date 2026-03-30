import CourseItem from '@/components/home/CourseItem';
import { useAuth } from '@/hooks/useAuth';
import { useBookmarks } from '@/hooks/useBookmarks';
import { useEnrolled } from '@/hooks/useEnrolled';
import profile from '@/images/profile.png';
import {
    resetReminder,
    scheduleReminderNotification,
    updateLastOpen
} from '@/services/notification.service';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
    FlatList,
    Image,
    RefreshControl,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { getCourses, getLocalCourses } from '../services/course.service';

const HomeScreen = () => {
    const [courses, setCourses] = useState<any[]>([]);
    const [filteredCourses, setFilteredCourses] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');

    const [error, setError] = useState('');

    const router = useRouter();
    const { user } = useAuth();

    const { toggleBookmark, isBookmarked } = useBookmarks(user?._id);
    const { isEnrolled } = useEnrolled(user?._id);



    useEffect(() => {
        const handleReminder = async () => {
            await updateLastOpen();
            await resetReminder();
            await scheduleReminderNotification();
        };
        handleReminder();
    }, []);

    const avatarUri = user?.avatar?.localUri || user?.avatar?.url;

    try {
    } catch (error) {
        console.log(error, 'avatar fetch error');
    }


    const ITEM_HEIGHT = 260;

    const getItemLayout = (_, index) => ({
        length: ITEM_HEIGHT,
        offset: ITEM_HEIGHT * index,
        index,
    });



    const fetchCourses = useCallback(async () => {
        try {
            setLoading(true);
            setError('');

            const data = await getCourses();
            setCourses(data);
            setFilteredCourses(data);
        } catch (err: any) {
            setError(err.message || 'Failed to load courses');

            const localCourses = await getLocalCourses();
            if (localCourses && localCourses.length > 0) {
                setCourses(localCourses);
                setFilteredCourses(localCourses);
            } else {
                setError(err.message || 'Failed to load courses');
            }
        } finally {
            setLoading(false);
        }
    }, []);



    useEffect(() => {
        fetchCourses();
    }, [fetchCourses]);

    const handleSearch = useCallback(
        (text: string) => {
            setSearch(text);

            const filtered = courses.filter((course) =>
                course.title.toLowerCase().includes(text.toLowerCase())
            );

            setFilteredCourses(filtered);
        },
        [courses]
    );


    const renderItem = useCallback(
        ({ item }: any) => (
            <CourseItem
                item={item}
                isBookmarked={isBookmarked(item.id)}
                onToggle={toggleBookmark}
                isEnrolled={isEnrolled(item.id)}
                router={router}
            />
        ),
        [toggleBookmark, isBookmarked, isEnrolled, router]
    );



    return (
        <View className="flex-1 bg-[#f5f7fb] pt-5">



            <View className="flex-row justify-between items-center px-[15px] mb-2.5 mt-4">
                <Text className="text-2xl font-bold text-slate-800">House Of Edtech</Text>

                <TouchableOpacity onPress={() => router.push('/profile')}>
                    <Image
                        source={(!avatarUri) ? profile : {
                            uri: avatarUri,
                        }}
                        className="w-12 h-12 rounded-full border-2 border-slate-200"
                    />
                </TouchableOpacity>
            </View>

            <TextInput
                placeholder="Search courses..."
                value={search}
                onChangeText={handleSearch}
                className="m-[15px] p-3 bg-white rounded-[10px] border border-slate-100 "
                placeholderTextColor={'#94a3b8'}
            />




            <FlatList
                data={filteredCourses}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                getItemLayout={getItemLayout}
                initialNumToRender={5}
                maxToRenderPerBatch={5}
                windowSize={5}
                removeClippedSubviews
                updateCellsBatchingPeriod={50}
                refreshControl={
                    <RefreshControl refreshing={loading} onRefresh={fetchCourses} />
                }
            />
            {error ? (
                <View className="items-center mt-5 mb-3">
                    <Text className="text-red-500">{error}</Text>

                    <TouchableOpacity
                        onPress={fetchCourses}
                        className="mt-3 bg-blue-500 px-4 py-2 rounded"
                    >
                        <Text className="text-white">Retry</Text>
                    </TouchableOpacity>
                </View>
            ) : null}
        </View>
    );
};

export default HomeScreen;
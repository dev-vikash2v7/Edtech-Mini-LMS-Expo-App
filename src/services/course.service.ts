import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './api';

const COURSES_STORAGE_KEY = '@courses_list';

export const getCourses = async () => {
    try {
        const [usersRes, productsRes] = await Promise.all([
            api.get('/public/randomusers'),
            api.get('/public/randomproducts'),
        ]);

        const users = usersRes.data?.data?.data || [];
        const products = productsRes.data?.data?.data || [];

        const courses = products.map((product: any, index: number) => {
            const instructor = users[index];

            return {
                id: product.id || product._id || index,
                title: product.title,
                description: product.description,
                thumbnail: product.thumbnail,
                price: product.price,
                category: product.category,
                images: product.images,

                instructorName: instructor
                    ? `${instructor.name.first} ${instructor.name.last}`
                    : 'Unknown Instructor',

                instructorAvatar: instructor?.picture?.thumbnail,
            };
        });

        try {
            await AsyncStorage.setItem(COURSES_STORAGE_KEY, JSON.stringify(courses));
        } catch (storageError) {
            console.log('Error saving courses to local storage:', storageError);
        }

        return courses;
    } catch (error: any) {
        if (error.code === 'ECONNABORTED') {
            throw new Error('Request timed out. Please try again.');
        } else if (!error.response) {
            throw new Error('Network error. Please check your internet connection.');
        } else {
            throw new Error('Failed to load courses. Please try again later.');
        }
    }
};

export const getLocalCourses = async () => {
    try {
        const stored = await AsyncStorage.getItem(COURSES_STORAGE_KEY);
        if (stored) {
            return JSON.parse(stored);
        }
        return null;
    } catch (error) {
        console.log('Error fetching local courses:', error);
        return null;
    }
};
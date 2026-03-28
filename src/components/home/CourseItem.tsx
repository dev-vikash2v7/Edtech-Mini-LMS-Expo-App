
import placeholder from "@/images/course.jpg";
import React, { memo, useState } from 'react';
import {
    Image,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const CourseItem = memo(({ item, isBookmarked, onToggle, isEnrolled, router }: any) => {
    const [imgError, setImgError] = useState(false);

    return (
        <TouchableOpacity
            className="bg-white mx-4 mb-4 rounded-xl overflow-hidden shadow-sm border border-slate-100"
            activeOpacity={0.9}
            onPress={() =>
                router.push({
                    pathname: '/webview',
                    params: item,
                })
            }
        >
            <Image
                source={!imgError ? { uri: item.thumbnail, } : placeholder}
                className="w-full h-[180px]"
                onError={() => setImgError(true)}
            />

            <View className="p-3">
                <Text className="text-base font-bold text-slate-800">
                    {item.title}
                </Text>

                <View className="flex-row items-center gap-2 mt-2">
                    <Image
                        source={{ uri: item.instructorAvatar }}
                        className="w-5 h-5 rounded-full"
                    />
                    <Text className="text-slate-600 text-[13px]">
                        {item.instructorName}
                    </Text>
                </View>

                <Text
                    numberOfLines={2}
                    className="mt-[6px] text-slate-500 text-[13px] leading-5"
                >
                    {item.description}
                </Text>

                <View className="mt-2.5 flex-row justify-between items-center">
                    <Text className="font-bold text-emerald-700 text-base">
                        ₹{item.price}
                    </Text>

                    <View className="flex-row items-center gap-3">
                        <TouchableOpacity className={`px-2 py-1 rounded-md ${isEnrolled ? 'bg-emerald-100' : 'bg-indigo-100'}`}>
                            <Text className={`text-[11px] font-bold ${isEnrolled ? 'text-emerald-700' : 'text-indigo-700'}`}>{isEnrolled ? '✅ Enrolled' : 'Enroll'}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => onToggle(item.id)}>
                            <Text>{isBookmarked ? '🔖' : '📑'}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
}
);

export default CourseItem;
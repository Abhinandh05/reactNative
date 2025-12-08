import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { CourseCard } from '../components/CourseCard';
import { useColorScheme } from '../components/useColorScheme';
import { Colors } from '../constants/Colors';
import api from '../utils/api';

interface Course {
    id: string;
    course_title: string;
    course_thumbnail: string;
    creator: {
        name: string;
    };
    course_price: number;
    course_type: string;
    progress?: number;
}

export default function MyCoursesScreen() {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];
    const router = useRouter();

    const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchEnrolledCourses();
    }, []);

    const fetchEnrolledCourses = async () => {
        try {
            setLoading(true);
            const res = await api.get('/api/v1/enrollment/my-courses');
            const courses = res.data?.courses || res.data?.enrollments || [];
            setEnrolledCourses(Array.isArray(courses) ? courses : []);
        } catch (error: any) {
            console.error('Error fetching enrolled courses:', error.response?.data || error.message);
            
            if (error.response?.status === 404) {
                setEnrolledCourses([]);
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: 'Failed to load your courses',
                });
            }
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={[styles.container, styles.centered, { backgroundColor: theme.background }]}>
                <ActivityIndicator size="large" color={theme.primary} />
            </View>
        );
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <FontAwesome name="arrow-left" size={24} color={theme.primary} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: theme.text }]}>My Courses</Text>
                <View style={{ width: 24 }} />
            </View>

            {enrolledCourses.length > 0 ? (
                <FlatList
                    data={enrolledCourses}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <CourseCard
                            id={item.id}
                            title={item.course_title}
                            author={item.creator?.name || 'Unknown'}
                            image={{ uri: item.course_thumbnail }}
                            progress={item.progress || 0}
                            style={{ marginHorizontal: 16 }}
                        />
                    )}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                />
            ) : (
                <View style={styles.emptyContainer}>
                    <FontAwesome name="inbox" size={48} color={theme.icon} />
                    <Text style={[styles.emptyText, { color: theme.text }]}>
                        You haven't enrolled in any courses yet
                    </Text>
                    <TouchableOpacity
                        style={[styles.button, { backgroundColor: theme.primary }]}
                        onPress={() => router.push('/(tabs)/courses')}
                    >
                        <Text style={styles.buttonText}>Explore Courses</Text>
                    </TouchableOpacity>
                </View>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    centered: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        marginTop: 8,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
    },
    listContent: {
        paddingHorizontal: 0,
        paddingVertical: 8,
        paddingBottom: 80,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 32,
    },
    emptyText: {
        fontSize: 16,
        marginVertical: 16,
        textAlign: 'center',
    },
    button: {
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
        marginTop: 16,
    },
    buttonText: {
        color: 'white',
        fontWeight: '600',
        textAlign: 'center',
    },
});

import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { useColorScheme } from '../../components/useColorScheme';
import { Colors } from '../../constants/Colors';
import api from '../../utils/api';

export default function ManageCoursesScreen() {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];
    const router = useRouter();

    const [courses, setCourses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchCourses = async () => {
        try {
            setLoading(true);
            const res = await api.get('/api/v1/course/creator');
            setCourses(res.data?.courses || []);
        } catch (error: any) {
            console.error('Error fetching courses:', error);
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Failed to load courses',
            });
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            fetchCourses();
        }, [])
    );

    const handlePublishToggle = async (courseId: number, isPublished: boolean) => {
        try {
            const res = await api.patch(`/api/v1/course/publish/${courseId}`);
            if (res.data?.success) {
                Toast.show({
                    type: 'success',
                    text1: 'Success',
                    text2: isPublished ? 'Course unpublished' : 'Course published',
                });
                fetchCourses();
            }
        } catch (error: any) {
            console.error('Error toggling publish:', error);
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Failed to update course',
            });
        }
    };

    const handleAddLectures = (courseId: number) => {
        router.push(`/admin/add-lecture/${courseId}`);
    };

    if (loading) {
        return (
            <View style={[styles.container, styles.centered, { backgroundColor: theme.background }]}>
                <ActivityIndicator size="large" color={theme.primary} />
            </View>
        );
    }

    const CourseItem = ({ item }: any) => (
        <View style={[styles.courseCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <View style={styles.courseHeader}>
                <View style={styles.courseInfo}>
                    <Text style={[styles.courseTitle, { color: theme.text }]} numberOfLines={2}>
                        {item.course_title}
                    </Text>
                    <Text style={[styles.courseCategory, { color: theme.icon }]}>
                        {item.category}
                    </Text>
                </View>
                <View style={[styles.badge, { backgroundColor: item.is_published ? '#4CAF50' : '#FFC107' }]}>
                    <Text style={styles.badgeText}>
                        {item.is_published ? 'Published' : 'Draft'}
                    </Text>
                </View>
            </View>

            <View style={styles.courseFooter}>
                <TouchableOpacity
                    style={[styles.actionBtn, { backgroundColor: theme.primary + '20' }]}
                    onPress={() => handleAddLectures(item.id)}
                >
                    <FontAwesome name="film" size={16} color={theme.primary} />
                    <Text style={[styles.actionBtnText, { color: theme.primary }]}>Lectures</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.actionBtn, { backgroundColor: theme.secondary + '20' }]}
                    onPress={() => handlePublishToggle(item.id, item.is_published)}
                >
                    <FontAwesome name={item.is_published ? 'eye-slash' : 'eye'} size={16} color={theme.secondary} />
                    <Text style={[styles.actionBtnText, { color: theme.secondary }]}>
                        {item.is_published ? 'Unpublish' : 'Publish'}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Text style={{ color: theme.primary, fontSize: 16, fontWeight: '600' }}>← Back</Text>
                </TouchableOpacity>
                <Text style={[styles.title, { color: theme.text }]}>My Courses</Text>
                <View style={{ width: 40 }} />
            </View>

            {courses.length === 0 ? (
                <View style={styles.emptyState}>
                    <FontAwesome name="book" size={48} color={theme.icon} />
                    <Text style={[styles.emptyText, { color: theme.text }]}>No courses yet</Text>
                    <TouchableOpacity
                        style={[styles.createButton, { backgroundColor: theme.primary }]}
                        onPress={() => router.push('/admin/create-course')}
                    >
                        <Text style={styles.createButtonText}>Create First Course</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <FlatList
                    data={courses}
                    renderItem={CourseItem}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.listContent}
                    scrollEnabled={false}
                />
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
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingVertical: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: '800',
    },
    listContent: {
        paddingHorizontal: 24,
        paddingBottom: 24,
    },
    courseCard: {
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
    },
    courseHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    courseInfo: {
        flex: 1,
        marginRight: 12,
    },
    courseTitle: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 4,
    },
    courseCategory: {
        fontSize: 13,
    },
    badge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    badgeText: {
        color: 'white',
        fontSize: 12,
        fontWeight: '600',
    },
    courseFooter: {
        flexDirection: 'row',
        gap: 8,
    },
    actionBtn: {
        flex: 1,
        flexDirection: 'row',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    actionBtnText: {
        fontSize: 12,
        fontWeight: '600',
        marginLeft: 6,
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '600',
        marginVertical: 16,
    },
    createButton: {
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
        marginTop: 16,
    },
    createButtonText: {
        color: 'white',
        fontWeight: '600',
    },
});

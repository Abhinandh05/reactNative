import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { useColorScheme } from '../components/useColorScheme';
import { Colors } from '../constants/Colors';
import api from '../utils/api';

interface Lecture {
    id: string;
    lectureTitle: string;
    videoUrl?: string;
    publicId?: string;
    isPreviewFree?: boolean;
}

interface Course {
    id: string;
    course_title: string;
    description: string;
    course_thumbnail: string;
    course_level: string;
    course_price: number;
    course_type: string;
    category: string;
    creator: {
        name: string;
    };
}

export default function CourseDetailScreen() {
    const { courseId } = useLocalSearchParams();
    const router = useRouter();
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];

    const [course, setCourse] = useState<Course | null>(null);
    const [lectures, setLectures] = useState<Lecture[]>([]);
    const [loading, setLoading] = useState(true);
    const [lectureError, setLectureError] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchCourseDetails();
    }, [courseId]);

    const fetchCourseDetails = async () => {
        try {
            setLoading(true);
            setError(null);
            setLectureError(null);

            if (!courseId) {
                throw new Error('Course ID is missing');
            }

            console.log('Fetching course details for courseId:', courseId);

            // Fetch course details
            const courseRes = await api.get(`/api/v1/course/${courseId}`);
            const courseData = courseRes.data?.course || courseRes.data;
            
            if (!courseData) {
                throw new Error('Course data is empty');
            }
            
            console.log('Course data fetched successfully:', courseData);
            setCourse(courseData);

            // Fetch lectures
            try {
                console.log('Fetching lectures from:', `/api/v1/video/${courseId}/lecture`);
                const lecturesRes = await api.get(`/api/v1/video/${courseId}/lecture`);
                console.log('Lectures API response:', lecturesRes.data);
                
                const lecturesData = lecturesRes.data?.lectures || lecturesRes.data || [];
                setLectures(Array.isArray(lecturesData) ? lecturesData : []);
                
                console.log('Lectures set:', lecturesData.length, 'lectures');
            } catch (lectureError: any) {
                console.warn('Could not fetch lectures:', {
                    message: lectureError.message,
                    status: lectureError.response?.status,
                    data: lectureError.response?.data,
                    url: `/api/v1/video/${courseId}/lecture`,
                });
                
                // Capture error message for display
                let errorMsg = 'Could not load lectures';
                if (lectureError.response?.status === 404) {
                    errorMsg = 'Lectures endpoint not found (404)';
                } else if (lectureError.response?.status === 401) {
                    errorMsg = 'Authentication required to view lectures';
                } else if (lectureError.message === 'Network Error') {
                    errorMsg = 'Backend server is not running';
                }
                
                setLectureError(errorMsg);
                setLectures([]);
            }
        } catch (err: any) {
            console.error('Error fetching course details:', {
                message: err.message,
                response: err.response?.data,
                status: err.response?.status,
            });
            setError(err.response?.data?.message || 'Failed to load course details');
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Could not load course details',
            });
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

    if (error || !course) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
                <View style={styles.errorContainer}>
                    <FontAwesome name="exclamation-circle" size={48} color={theme.primary} />
                    <Text style={[styles.errorText, { color: theme.text }]}>
                        {error || 'Course not found'}
                    </Text>
                    <TouchableOpacity
                        style={[styles.button, { backgroundColor: theme.primary }]}
                        onPress={() => router.back()}
                    >
                        <Text style={styles.buttonText}>Go Back</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Header with back button */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <FontAwesome name="arrow-left" size={24} color={theme.primary} />
                    </TouchableOpacity>
                    <Text style={[styles.headerTitle, { color: theme.text }]}>Course Details</Text>
                    <View style={{ width: 24 }} />
                </View>

                {/* Course Thumbnail */}
                {course.course_thumbnail && (
                    <Image
                        source={{ uri: course.course_thumbnail }}
                        style={styles.thumbnail}
                    />
                )}

                {/* Course Info */}
                <View style={styles.content}>
                    <Text style={[styles.title, { color: theme.primary }]}>
                        {course.course_title}
                    </Text>

                    <View style={styles.metaInfo}>
                        <View style={styles.metaItem}>
                            <FontAwesome name="user" size={16} color={theme.icon} />
                            <Text style={[styles.metaText, { color: theme.icon }]}>
                                {course.creator?.name || 'Unknown'}
                            </Text>
                        </View>
                        <View style={styles.metaItem}>
                            <FontAwesome name="tag" size={16} color={theme.icon} />
                            <Text style={[styles.metaText, { color: theme.icon }]}>
                                {course.category || 'General'}
                            </Text>
                        </View>
                        <View style={styles.metaItem}>
                            <FontAwesome name="graduation-cap" size={16} color={theme.icon} />
                            <Text style={[styles.metaText, { color: theme.icon }]}>
                                {course.course_level || 'Beginner'}
                            </Text>
                        </View>
                    </View>

                    {course.course_type === 'paid' && (
                        <View style={[styles.priceTag, { backgroundColor: theme.primary }]}>
                            <Text style={styles.priceText}>₹{course.course_price}</Text>
                        </View>
                    )}

                    {course.description && (
                        <View style={styles.section}>
                            <Text style={[styles.sectionTitle, { color: theme.text }]}>About</Text>
                            <Text style={[styles.description, { color: theme.icon }]}>
                                {course.description}
                            </Text>
                        </View>
                    )}

                    {/* Lectures Section */}
                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: theme.text }]}>
                            Lectures ({lectures.length})
                        </Text>

                        {lectureError && (
                            <View style={[styles.errorBanner, { backgroundColor: 'rgba(244, 67, 54, 0.1)' }]}>
                                <FontAwesome name="exclamation-circle" size={16} color="#F44336" />
                                <Text style={[styles.errorBannerText, { color: '#F44336' }]}>
                                    {lectureError}
                                </Text>
                            </View>
                        )}

                        {lectures.length > 0 ? (
                            <FlatList
                                data={lectures}
                                scrollEnabled={false}
                                keyExtractor={(item) => item.id.toString()}
                                renderItem={({ item }) => (
                                    <View style={[styles.lectureCard, { backgroundColor: theme.card }]}>
                                        <View style={styles.lectureNumber}>
                                            <Text style={[styles.lectureNumberText, { color: theme.primary }]}>
                                                {lectures.indexOf(item) + 1}
                                            </Text>
                                        </View>
                                        <View style={styles.lectureContent}>
                                            <Text
                                                style={[styles.lectureName, { color: theme.text }]}
                                                numberOfLines={2}
                                            >
                                                {item.lectureTitle || 'Untitled Lecture'}
                                            </Text>
                                            {item.isPreviewFree && (
                                                <View style={styles.durationBadge}>
                                                    <FontAwesome name="eye" size={12} color={theme.icon} />
                                                    <Text style={[styles.durationText, { color: theme.icon }]}>
                                                        Preview available
                                                    </Text>
                                                </View>
                                            )}
                                        </View>
                                        <TouchableOpacity 
                                            style={styles.playButton}
                                            onPress={() => {
                                                if (item.videoUrl) {
                                                    router.push({
                                                        pathname: '/lecture-player',
                                                        params: {
                                                            lectureId: item.id.toString(),
                                                            courseId: courseId,
                                                            lectureTitle: item.lectureTitle,
                                                        },
                                                    });
                                                } else {
                                                    Toast.show({
                                                        type: 'info',
                                                        text1: 'No Video',
                                                        text2: 'This lecture does not have a video yet',
                                                    });
                                                }
                                            }}
                                        >
                                            <FontAwesome name="play" size={20} color={item.videoUrl ? theme.primary : theme.icon} />
                                        </TouchableOpacity>
                                    </View>
                                )}
                            />
                        ) : (
                            <Text style={[styles.noLectures, { color: theme.icon }]}>
                                No lectures available yet
                            </Text>
                        )}
                    </View>

                    <View style={{ height: 80 }} />
                </View>
            </ScrollView>
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
    thumbnail: {
        width: '100%',
        height: 200,
        resizeMode: 'cover',
    },
    content: {
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    metaInfo: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 16,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 16,
        marginBottom: 8,
    },
    metaText: {
        marginLeft: 6,
        fontSize: 14,
    },
    priceTag: {
        alignSelf: 'flex-start',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        marginBottom: 16,
    },
    priceText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 16,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 12,
    },
    description: {
        fontSize: 14,
        lineHeight: 20,
    },
    lectureCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        marginBottom: 8,
        borderRadius: 8,
    },
    lectureNumber: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.1)',
        marginRight: 12,
    },
    lectureNumberText: {
        fontWeight: 'bold',
    },
    lectureContent: {
        flex: 1,
    },
    lectureName: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 4,
    },
    durationBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    durationText: {
        marginLeft: 4,
        fontSize: 12,
    },
    playButton: {
        padding: 8,
    },
    noLectures: {
        fontSize: 14,
        textAlign: 'center',
        paddingVertical: 20,
    },
    errorBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
        gap: 8,
    },
    errorBannerText: {
        fontWeight: '600',
        fontSize: 13,
        flex: 1,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    errorText: {
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
        fontSize: 14,
    },
});

import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { CourseCard } from '../../components/CourseCard';
import { Input } from '../../components/Input';
import { useColorScheme } from '../../components/useColorScheme';
import { Colors } from '../../constants/Colors';
import api from '../../utils/api';

export default function DashboardScreen() {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];
    const router = useRouter();

    const [user, setUser] = useState<any>(null);
    const [courses, setCourses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const fetchData = async () => {
        try {
            setError(false);
            setLoading(true);

            // Fetch User Profile
            let userData: any = null;
            try {
                const userRes = await api.get('/api/v1/user/profile');
                userData = userRes.data?.user || userRes.data;
                setUser(userData);

                // Route admin users to admin panel
                if (userData?.role === 'admin' || userData?.role === 'superadmin') {
                    router.replace('/admin');
                    return;
                }
            } catch (profileError: any) {
                console.error('Profile fetch error:', profileError.response?.data || profileError.message);
                throw profileError;
            }

            // Fetch Published Courses
            try {
                const coursesRes = await api.get('/api/v1/course/published-course');
                const coursesData = coursesRes.data?.courses || [];
                
                if (Array.isArray(coursesData)) {
                    setCourses(coursesData);
                } else {
                    setCourses([]);
                }
            } catch (courseError: any) {
                console.error('Courses fetch error:', courseError.response?.data || courseError.message);
                
                // If 404, it just means no courses published yet
                if (courseError.response?.status === 404) {
                    setCourses([]);
                } else {
                    // For other errors, still load dashboard but show message
                    setCourses([]);
                }
            }

        } catch (error: any) {
            console.error('Error fetching dashboard data:', error.response?.data || error.message);
            setError(true);
            
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: error.response?.data?.message || 'Failed to load dashboard',
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (loading) {
        return (
            <View style={[styles.container, styles.centered, { backgroundColor: theme.background }]}>
                <ActivityIndicator size="large" color={theme.primary} />
            </View>
        );
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                <View style={styles.header}>
                    <View>
                        <Text style={[styles.greeting, { color: theme.text }]}>Hello, {user?.name || 'Student'} 👋</Text>
                        <Text style={[styles.subtitle, { color: theme.icon }]}>What do you want to learn today?</Text>
                    </View>
                    <View style={[styles.avatar, { backgroundColor: theme.primary }]}>
                        <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>
                            {user?.name?.charAt(0).toUpperCase() || 'S'}
                        </Text>
                    </View>
                </View>

                {/* Quick Action: My Courses */}
                <TouchableOpacity
                    style={[styles.quickAction, { backgroundColor: theme.primary }]}
                    onPress={() => router.push('my-courses' as any)}
                >
                    <View>
                        <Text style={[styles.quickActionTitle, { color: 'white' }]}>My Courses</Text>
                        <Text style={[styles.quickActionSubtitle, { color: 'rgba(255,255,255,0.8)' }]}>View your enrolled courses</Text>
                    </View>
                    <FontAwesome name="arrow-right" size={20} color="white" />
                </TouchableOpacity>

                <View style={styles.searchSection}>
                    <Input placeholder="Search for courses..." glass style={{ borderRadius: 16 }} />
                </View>

                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>Explore Courses</Text>
                    {courses.length === 0 ? (
                        <Text style={{ color: theme.icon }}>No courses available at the moment.</Text>
                    ) : (
                        courses.map((course: any) => (
                            <CourseCard
                                key={course._id || course.id}
                                id={course._id || course.id}
                                title={course.course_title}
                                author={course.creator?.name || course.creator || "Instructor"}
                                image={{ uri: course.course_thumbnail || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600' }}
                                rating={4.5}
                            />
                        ))
                    )}
                </View>

                <View style={{ height: 80 }} />
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
    scrollContent: {
        padding: 24,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    greeting: {
        fontSize: 28,
        fontWeight: 'bold',
    },
    subtitle: {
        fontSize: 16,
        marginTop: 4,
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    quickAction: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 12,
        marginBottom: 20,
    },
    quickActionTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    quickActionSubtitle: {
        fontSize: 13,
    },
    searchSection: {
        marginBottom: 32,
    },
    section: {
        marginBottom: 32,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 16,
    },
    horizontalScroll: {
        marginLeft: -24,
        paddingLeft: 24,
        marginRight: -24,
    },
});

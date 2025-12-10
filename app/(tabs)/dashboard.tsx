import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    FlatList,
    Image,
    Modal,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from 'react-native';
import Animated, {
    Easing,
    FadeInDown,
    Layout,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CourseCard } from '../../components/CourseCard';
import { Input } from '../../components/Input';
import { useColorScheme } from '../../components/useColorScheme';
import { Colors } from '../../constants/Colors';
import api from '../../utils/api';

const { height } = Dimensions.get('window');

const DUMMY_NOTIFICATIONS = [
    { id: '1', title: 'Course Completed', description: 'Congratulations! You successfully completed "React Native Mastery".', time: '2 mins ago', read: false },
    { id: '2', title: 'New Course Available', description: 'Check out the new "Advanced TypeScript" course.', time: '1 hour ago', read: false },
    { id: '3', title: 'Assignment Due', description: 'Your assignment for "UI/UX Design" is due tomorrow.', time: '3 hours ago', read: true },
    { id: '4', title: 'Live Session Starting', description: 'Join the live Q&A session with the instructor.', time: '5 hours ago', read: false },
    { id: '5', title: 'System Update', description: 'We have updated the LMS with new features.', time: '1 day ago', read: true },
    { id: '6', title: 'Feedback Request', description: 'Please rate your experience with the "Web Development" course.', time: '1 day ago', read: true },
    { id: '7', title: 'New Comment', description: 'John Doe commented on your discussion post.', time: '2 days ago', read: true },
    { id: '8', title: 'Enrollment Confirmed', description: 'You have been enrolled in "Data Structures".', time: '3 days ago', read: true },
    { id: '9', title: 'Exam Results', description: 'Your results for the Mid-Term exam are out.', time: '4 days ago', read: true },
    { id: '10', title: 'Profile Updated', description: 'Your profile changes have been saved successfully.', time: '5 days ago', read: true },
    { id: '11', title: 'Welcome!', description: 'Welcome to the new LMS platform. Happy learning!', time: '1 week ago', read: true },
];

const HIGH_DEMAND_COURSES = [
    { id: '1', title: 'React Native Pro', image: 'https://images.unsplash.com/photo-1555099962-4199c345e5dd?w=600', rating: 4.9, students: '1.2k' },
    { id: '2', title: 'Advanced Python', image: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=600', rating: 4.8, students: '950' },
    { id: '3', title: 'Data Science 101', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600', rating: 4.7, students: '800' },
    { id: '4', title: 'UX Design Master', image: 'https://www.freepik.com/free-photos-vectors/ui-ux-design?w=600', rating: 4.9, students: '1.5k' },
    { id: '5', title: 'Cyber Security', image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600', rating: 4.8, students: '1.1k' },
];

export default function DashboardScreen() {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const [user, setUser] = useState<any>(null);
    const [courses, setCourses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [refreshing, setRefreshing] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState(DUMMY_NOTIFICATIONS);

    // Infinite Carousel Logic
    const CARD_WIDTH = 280;
    const CARD_MARGIN = 16;
    const TOTAL_ITEM_WIDTH = CARD_WIDTH + CARD_MARGIN;
    // We duplicate the data enough times to fill the screen + buffer for seamless loop
    const CAROUSEL_DATA = [...HIGH_DEMAND_COURSES, ...HIGH_DEMAND_COURSES, ...HIGH_DEMAND_COURSES, ...HIGH_DEMAND_COURSES];

    const translateX = useSharedValue(0);

    useEffect(() => {
        const totalWidth = TOTAL_ITEM_WIDTH * HIGH_DEMAND_COURSES.length;
        // Reset and start animation
        translateX.value = 0;
        translateX.value = withRepeat(
            withTiming(-totalWidth, {
                duration: 20000, // Adjust speed: 20s for one set to scroll
                easing: Easing.linear,
            }),
            -1, // Infinite reps
            false // Do not reverse
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: translateX.value }],
        };
    });

    const fetchData = async () => {
        try {
            setLoading(true);
            const userRes = await api.get('/api/v1/user/profile');
            const userData = userRes.data?.user || userRes.data;
            setUser(userData);

            if (userData?.role === 'admin' || userData?.role === 'superadmin') {
                router.replace('/admin');
                return;
            }

            const coursesRes = await api.get('/api/v1/course/published-course');
            setCourses(coursesRes.data?.courses || []);
        } catch (error: any) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchData().finally(() => setRefreshing(false));
    }, []);

    if (loading) {
        return (
            <View style={[styles.container, styles.centered, { backgroundColor: theme.background }]}>
                <ActivityIndicator size="large" color={theme.primary} />
            </View>
        );
    }

    const filteredCourses = courses.filter(course => {
        const matchesSearch = course.course_title?.toLowerCase().includes(searchQuery.toLowerCase());
        let matchesFilter = true;
        if (selectedCategory === 'Free') {
            matchesFilter = Number(course.course_price) === 0;
        } else if (selectedCategory === 'Paid') {
            matchesFilter = Number(course.course_price) > 0;
        }
        return matchesSearch && matchesFilter;
    });

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <View style={[styles.container, { backgroundColor: theme.background, paddingTop: insets.top }]}>
            <ScrollView
                contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 20 }]}
                showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            >
                {/* Header with Greeting, Bell, and Avatar */}
                <Animated.View
                    entering={FadeInDown.delay(200).duration(500)}
                    style={styles.header}
                >
                    <View style={{ flex: 1 }}>
                        <Text style={[styles.greeting, { color: theme.textSecondary }]}>Welcome back,</Text>
                        <Text style={[styles.userName, { color: theme.text }]}>
                            {user?.name || 'StackUp'} 👋
                        </Text>
                    </View>

                    <View style={styles.headerRight}>
                        <TouchableOpacity
                            style={[styles.iconButton, { backgroundColor: theme.surface, borderColor: theme.border }]}
                            onPress={() => setShowNotifications(true)}
                        >
                            <FontAwesome name="bell-o" size={20} color={theme.text} />
                            {unreadCount > 0 && (
                                <View style={styles.badge}>
                                    <Text style={styles.badgeText}>{unreadCount > 9 ? '9+' : unreadCount}</Text>
                                </View>
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => router.push('/(tabs)/profile')}
                            style={[styles.avatarContainer, { borderColor: theme.border, backgroundColor: theme.primary }]}
                        >
                            <Text style={styles.avatarText}>
                                {user?.name ? user.name.charAt(0).toUpperCase() : 'S'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>

                {/* Search Bar */}
                <Animated.View
                    entering={FadeInDown.delay(300).duration(500)}
                    style={styles.searchContainer}
                >
                    <Input
                        placeholder="Search for courses..."
                        startIcon={<FontAwesome name="search" size={20} color={theme.textSecondary} />}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        style={{ backgroundColor: theme.surface, borderWidth: 0 }}
                        containerStyle={{ borderWidth: 0, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 }}
                    />
                </Animated.View>

                {/* High Demand Courses Carousel - Infinite Loop */}
                <Animated.View entering={FadeInDown.delay(350).duration(500)} style={{ marginBottom: 24 }}>
                    <Text style={[styles.sectionTitle, { color: theme.text, marginBottom: 16 }]}>High Demand Courses 🔥</Text>

                    <View style={{ overflow: 'hidden', width: '100%' }}>
                        <Animated.View style={[{ flexDirection: 'row' }, animatedStyle]}>
                            {CAROUSEL_DATA.map((item, index) => (
                                <TouchableOpacity
                                    key={`${item.id}-${index}`}
                                    activeOpacity={0.9}
                                    onPress={() => router.push(`/course/${item.id}`)}
                                    style={{ marginRight: 16, width: 280 }}
                                >
                                    <View style={{ height: 160, borderRadius: 16, overflow: 'hidden', marginBottom: 12 }}>
                                        <Image
                                            source={{ uri: item.image }}
                                            style={{ width: '100%', height: '100%' }}
                                        />
                                        <View style={{ position: 'absolute', top: 10, right: 10, backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 }}>
                                            <Text style={{ color: '#FFF', fontWeight: 'bold', fontSize: 12 }}>★ {item.rating}</Text>
                                        </View>
                                    </View>
                                    <Text style={{ fontSize: 16, fontWeight: '700', color: theme.text, marginBottom: 4 }} numberOfLines={1}>{item.title}</Text>
                                    <Text style={{ fontSize: 14, color: theme.textSecondary }}>{item.students} students enrolled</Text>
                                </TouchableOpacity>
                            ))}
                        </Animated.View>
                    </View>
                </Animated.View>

                {/* Filter Chips */}
                <Animated.View
                    entering={FadeInDown.delay(400).duration(500)}
                    style={styles.categoriesContainer}
                >
                    {['All', 'Free', 'Paid'].map((filter, index) => (
                        <TouchableOpacity
                            key={index}
                            onPress={() => setSelectedCategory(filter)}
                            style={[
                                styles.chip,
                                {
                                    backgroundColor: selectedCategory === filter ? theme.primary : theme.surface,
                                    borderColor: theme.border,
                                    borderWidth: selectedCategory === filter ? 0 : 1
                                }
                            ]}
                        >
                            <Text style={[styles.chipText, { color: selectedCategory === filter ? '#FFF' : theme.textSecondary }]}>
                                {filter}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </Animated.View>

                <Animated.View entering={FadeInDown.delay(500).duration(500)} style={styles.sectionHeader}>
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>
                        {selectedCategory === 'All' ? 'Featured Courses' : `${selectedCategory} Courses`}
                    </Text>
                    <TouchableOpacity onPress={() => router.push('/(tabs)/courses')}>
                        <Text style={[styles.seeAll, { color: theme.primary }]}>See All</Text>
                    </TouchableOpacity>
                </Animated.View>

                <View style={styles.courseList}>
                    {filteredCourses.length === 0 ? (
                        <View style={styles.emptyState}>
                            <FontAwesome name="book" size={48} color={theme.textTertiary} />
                            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>No courses found.</Text>
                        </View>
                    ) : (
                        filteredCourses.map((course: any, index: number) => (
                            <Animated.View
                                key={course._id || course.id}
                                entering={FadeInDown.delay(600 + (index * 100)).duration(500)}
                                layout={Layout.springify()}
                            >
                                <CourseCard
                                    id={course._id || course.id}
                                    title={course.course_title}
                                    author={course.creator?.name || "Instructor"}
                                    image={{ uri: course.course_thumbnail || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600' }}
                                    rating={course.rating || 0}
                                    reviews={course.reviews_count || 0}
                                    price={course.course_price !== undefined ? Number(course.course_price) : 0}
                                />
                            </Animated.View>
                        ))
                    )}
                </View>

                <View style={{ height: 40 }} />
            </ScrollView>

            {/* Notification Modal */}
            <Modal
                transparent
                visible={showNotifications}
                animationType="fade"
                onRequestClose={() => setShowNotifications(false)}
            >
                <TouchableWithoutFeedback onPress={() => setShowNotifications(false)}>
                    <View style={styles.modalOverlay}>
                        <TouchableWithoutFeedback>
                            <View style={[styles.modalContent, { backgroundColor: theme.background }]}>
                                <View style={[styles.modalHeader, { borderBottomColor: theme.border }]}>
                                    <View>
                                        <Text style={[styles.modalTitle, { color: theme.text }]}>Notifications</Text>
                                        <Text style={[styles.modalSubtitle, { color: theme.textSecondary }]}>
                                            You have {unreadCount} unread messages
                                        </Text>
                                    </View>
                                    <TouchableOpacity
                                        onPress={() => setShowNotifications(false)}
                                        style={[styles.closeButton, { backgroundColor: theme.surface }]}
                                    >
                                        <FontAwesome name="close" size={20} color={theme.text} />
                                    </TouchableOpacity>
                                </View>

                                <FlatList
                                    data={notifications}
                                    keyExtractor={(item) => item.id}
                                    showsVerticalScrollIndicator={false}
                                    contentContainerStyle={{ padding: 16 }}
                                    renderItem={({ item }) => (
                                        <TouchableOpacity style={[
                                            styles.notificationItem,
                                            {
                                                backgroundColor: item.read ? 'transparent' : theme.surface,
                                                borderColor: theme.border
                                            }
                                        ]}>
                                            <View style={[styles.notificationIcon, { backgroundColor: theme.primary + '20' }]}>
                                                <FontAwesome name={item.read ? "bell-o" : "bell"} size={20} color={theme.primary} />
                                            </View>
                                            <View style={styles.notificationText}>
                                                <View style={styles.notificationTop}>
                                                    <Text style={[
                                                        styles.notificationTitle,
                                                        { color: theme.text, fontWeight: item.read ? '600' : '700' }
                                                    ]}>
                                                        {item.title}
                                                    </Text>
                                                    <Text style={[styles.notificationTime, { color: theme.textTertiary }]}>
                                                        {item.time}
                                                    </Text>
                                                </View>
                                                <Text
                                                    style={[styles.notificationDesc, { color: theme.textSecondary }]}
                                                    numberOfLines={2}
                                                >
                                                    {item.description}
                                                </Text>
                                            </View>
                                            {!item.read && <View style={[styles.dot, { backgroundColor: theme.error }]} />}
                                        </TouchableOpacity>
                                    )}
                                />
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </View>
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
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    iconButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
    },
    badge: {
        position: 'absolute',
        top: -2,
        right: -2,
        backgroundColor: '#EF4444',
        borderRadius: 10,
        minWidth: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 4,
        borderWidth: 2,
        borderColor: '#FFF',
    },
    badgeText: {
        color: '#FFF',
        fontSize: 10,
        fontWeight: 'bold',
    },
    greeting: {
        fontSize: 16,
        marginBottom: 4,
    },
    userName: {
        fontSize: 24,
        fontWeight: '800',
    },
    avatarContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        borderWidth: 1,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: 'bold',
    },
    searchContainer: {
        marginBottom: 24,
    },
    categoriesContainer: {
        flexDirection: 'row',
        paddingHorizontal: 0,
        marginBottom: 24,
        gap: 12,
    },
    chip: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 100,
        marginRight: 10,
    },
    chipText: {
        fontWeight: '600',
        fontSize: 14,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
    },
    seeAll: {
        fontWeight: '600',
        fontSize: 14,
    },
    courseList: {
        gap: 16,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 40,
    },
    emptyText: {
        marginTop: 12,
        fontSize: 16,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        height: height * 0.8,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        overflow: 'hidden',
    },
    modalHeader: {
        padding: 20,
        borderBottomWidth: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    modalSubtitle: {
        fontSize: 14,
    },
    closeButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
    notificationItem: {
        flexDirection: 'row',
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    notificationIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    notificationText: {
        flex: 1,
    },
    notificationTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    notificationTitle: {
        fontSize: 16,
    },
    notificationTime: {
        fontSize: 12,
    },
    notificationDesc: {
        fontSize: 14,
        lineHeight: 20,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        position: 'absolute',
        top: 16,
        right: 16,
    },
});
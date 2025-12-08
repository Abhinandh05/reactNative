import FontAwesome from '@expo/vector-icons/FontAwesome';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { CourseCard } from '../../components/CourseCard';
import { useColorScheme } from '../../components/useColorScheme';
import { Colors } from '../../constants/Colors';
import api from '../../utils/api';

interface Course {
    id: string;
    course_title: string;
    course_thumbnail: string;
    creator: {
        name: string;
    };
    course_price: number;
    course_type: string;
    category: string;
}

export default function CoursesScreen() {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];

    const [allCourses, setAllCourses] = useState<Course[]>([]);
    const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState<'all' | 'free' | 'paid'>('all');

    useEffect(() => {
        fetchAllCourses();
    }, []);

    useEffect(() => {
        filterCourses();
    }, [searchQuery, activeFilter, allCourses]);

    const fetchAllCourses = async () => {
        try {
            setLoading(true);
            const res = await api.get('/api/v1/course/published-course');
            const courses = res.data?.courses || [];
            setAllCourses(Array.isArray(courses) ? courses : []);
        } catch (error: any) {
            console.error('Error fetching courses:', error.response?.data || error.message);
            
            if (error.response?.status === 404) {
                setAllCourses([]);
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: 'Failed to load courses',
                });
            }
        } finally {
            setLoading(false);
        }
    };

    const filterCourses = () => {
        let filtered = allCourses;

        // Filter by search query
        if (searchQuery.trim()) {
            filtered = filtered.filter((course) =>
                course.course_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                course.creator?.name?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Filter by course type
        if (activeFilter !== 'all') {
            filtered = filtered.filter((course) => course.course_type === activeFilter);
        }

        setFilteredCourses(filtered);
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={styles.header}>
                <Text style={[styles.headerTitle, { color: theme.primary }]}>Explore Courses</Text>
            </View>

            {/* Search Bar */}
            <View style={[styles.searchContainer, { backgroundColor: theme.card }]}>
                <FontAwesome name="search" size={18} color={theme.icon} />
                <TextInput
                    style={[styles.searchInput, { color: theme.text }]}
                    placeholder="Search courses..."
                    placeholderTextColor={theme.icon}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>

            {/* Filters */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterContainer}>
                {[
                    { label: 'All', value: 'all' as const },
                    { label: 'Free', value: 'free' as const },
                    { label: 'Paid', value: 'paid' as const },
                ].map((filter) => (
                    <TouchableOpacity
                        key={filter.value}
                        style={[
                            styles.filterButton,
                            activeFilter === filter.value
                                ? { backgroundColor: theme.primary }
                                : { backgroundColor: theme.card, borderColor: theme.primary, borderWidth: 1 },
                        ]}
                        onPress={() => setActiveFilter(filter.value)}
                    >
                        <Text
                            style={[
                                styles.filterText,
                                {
                                    color: activeFilter === filter.value ? 'white' : theme.primary,
                                },
                            ]}
                        >
                            {filter.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Courses List */}
            {loading ? (
                <View style={[styles.centered, { flex: 1 }]}>
                    <ActivityIndicator size="large" color={theme.primary} />
                </View>
            ) : filteredCourses.length > 0 ? (
                <FlatList
                    data={filteredCourses}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <CourseCard
                            id={item.id}
                            title={item.course_title}
                            author={item.creator?.name || 'Unknown'}
                            image={{ uri: item.course_thumbnail }}
                            style={{ marginHorizontal: 16 }}
                        />
                    )}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <FontAwesome name="inbox" size={48} color={theme.icon} />
                            <Text style={[styles.emptyText, { color: theme.text }]}>
                                No courses found
                            </Text>
                        </View>
                    }
                />
            ) : (
                <View style={styles.emptyContainer}>
                    <FontAwesome name="inbox" size={48} color={theme.icon} />
                    <Text style={[styles.emptyText, { color: theme.text }]}>
                        {searchQuery ? 'No courses match your search' : 'No courses available yet'}
                    </Text>
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
        paddingHorizontal: 16,
        paddingVertical: 12,
        marginBottom: 8,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 16,
        marginBottom: 12,
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 12,
    },
    searchInput: {
        flex: 1,
        marginLeft: 8,
        fontSize: 16,
    },
    filterContainer: {
        paddingHorizontal: 16,
        marginBottom: 12,
    },
    filterButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 8,
    },
    filterText: {
        fontWeight: '600',
        fontSize: 14,
    },
    listContent: {
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
        marginTop: 12,
        textAlign: 'center',
    },
});

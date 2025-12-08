import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { useColorScheme } from '../../components/useColorScheme';
import { Colors } from '../../constants/Colors';
import api from '../../utils/api';

export default function AdminDashboard() {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];
    const router = useRouter();

    const [user, setUser] = useState<any>(null);
    const [stats, setStats] = useState({ courses: 0, students: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAdminData = async () => {
            try {
                setLoading(true);
                
                // Fetch user profile
                const userRes = await api.get('/api/v1/user/profile');
                const userData = userRes.data?.user || userRes.data;
                setUser(userData);

                // Verify admin role
                if (userData?.role !== 'admin' && userData?.role !== 'superadmin') {
                    router.replace('/(tabs)/dashboard');
                    return;
                }

                // Fetch admin's courses
                try {
                    const coursesRes = await api.get('/api/v1/course/creator');
                    const coursesData = coursesRes.data?.courses || [];
                    const totalCourses = Array.isArray(coursesData) ? coursesData.length : 0;
                    setStats({
                        courses: totalCourses,
                        students: 0,
                    });
                } catch (courseError: any) {
                    console.error('Error fetching courses:', courseError.response?.data || courseError.message);
                    if (courseError.response?.status === 404) {
                        setStats({ courses: 0, students: 0 });
                    }
                }
            } catch (error: any) {
                console.error('Error loading admin data:', error.response?.data || error.message);
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: 'Failed to load admin data',
                });
            } finally {
                setLoading(false);
            }
        };

        fetchAdminData();
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
                    <Text style={[styles.title, { color: theme.primary }]}>Admin Panel</Text>
                    <Text style={[styles.subtitle, { color: theme.text }]}>Welcome, {user?.name}</Text>
                </View>

                {/* Stats Cards */}
                <View style={styles.statsContainer}>
                    <View style={[styles.statCard, { backgroundColor: theme.card }]}>
                        <FontAwesome name="book" size={28} color={theme.primary} />
                        <Text style={[styles.statNumber, { color: theme.text }]}>{stats.courses}</Text>
                        <Text style={[styles.statLabel, { color: theme.icon }]}>Courses</Text>
                    </View>
                </View>

                {/* Quick Actions */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>Quick Actions</Text>

                    <TouchableOpacity
                        style={[styles.actionButton, { backgroundColor: theme.primary }]}
                        onPress={() => router.push('/admin/create-course')}
                    >
                        <FontAwesome name="plus" size={20} color="white" />
                        <Text style={styles.actionButtonText}>Create Course</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.actionButton, { backgroundColor: theme.secondary }]}
                        onPress={() => router.push('/admin/manage-courses')}
                    >
                        <FontAwesome name="list" size={20} color={theme.primary} />
                        <Text style={[styles.actionButtonText, { color: theme.primary }]}>Manage Courses</Text>
                    </TouchableOpacity>
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
        marginBottom: 32,
    },
    title: {
        fontSize: 36,
        fontWeight: '800',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        opacity: 0.7,
    },
    statsContainer: {
        marginBottom: 32,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    statCard: {
        flex: 1,
        padding: 20,
        borderRadius: 16,
        alignItems: 'center',
        marginRight: 12,
    },
    statNumber: {
        fontSize: 32,
        fontWeight: 'bold',
        marginVertical: 8,
    },
    statLabel: {
        fontSize: 14,
    },
    section: {
        marginBottom: 32,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 16,
    },
    actionButton: {
        padding: 16,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    actionButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 12,
    },
});

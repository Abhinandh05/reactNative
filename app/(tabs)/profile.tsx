import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from '../../components/useColorScheme';
import { Colors } from '../../constants/Colors';
import api from '../../utils/api';

export default function ProfileScreen() {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];
    const router = useRouter();
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { data } = await api.get('/api/v1/user/profile');
                setUser(data.user || data);
            } catch (error) {
                console.log("Error fetching profile", error);
            }
        };
        fetchProfile();
    }, []);

    const handleLogout = async () => {
        try {
            // Optional: Call logout endpoint if exists (it does in swagger: /api/v1/user/logout)
            await api.get('/api/v1/user/logout');
        } catch (e) {
            // Ignore error on logout
            console.log("Logout api error", e);
        } finally {
            await SecureStore.deleteItemAsync('authToken');
            router.replace('/auth/login');
        }
    };

    const Option = ({ icon, label, color, isDestructive, rightElement }: any) => (
        <TouchableOpacity style={[styles.option, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <View style={styles.optionLeft}>
                <View style={[styles.iconContainer, { backgroundColor: isDestructive ? '#FDD' : theme.secondary }]}>
                    <FontAwesome name={icon} size={20} color={isDestructive ? 'red' : theme.primary} />
                </View>
                <Text style={[styles.optionLabel, { color: isDestructive ? 'red' : theme.text }]}>{label}</Text>
            </View>
            {rightElement || <FontAwesome name="angle-right" size={20} color={theme.icon} />}
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <View style={[styles.avatar, { borderColor: theme.primary }]}>
                        <Text style={styles.avatarText}>
                            {user?.name?.charAt(0).toUpperCase() || 'U'}
                        </Text>
                    </View>
                    <Text style={[styles.name, { color: theme.text }]}>{user?.name || 'User'}</Text>
                    <Text style={[styles.email, { color: theme.icon }]}>{user?.email || 'email@example.com'}</Text>
                </View>

                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>Settings</Text>
                    <Option icon="moon-o" label="Dark Mode" rightElement={<Text style={{ color: theme.icon }}>System</Text>} />
                    <Option icon="bell-o" label="Notifications" />
                    <Option icon="lock" label="Privacy & Security" />
                </View>

                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>Support</Text>
                    <Option icon="question-circle-o" label="Help Center" />
                    <Option icon="info-circle" label="About LMS" />
                </View>

                <TouchableOpacity
                    style={[styles.logoutButton, { backgroundColor: '#FFEDED' }]}
                    onPress={handleLogout}
                >
                    <Text style={styles.logoutText}>Log Out</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        padding: 24,
    },
    header: {
        alignItems: 'center',
        marginBottom: 40,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 4,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#E1E9FF',
        marginBottom: 16,
    },
    avatarText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#0066FF',
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    email: {
        fontSize: 16,
        opacity: 0.7,
    },
    section: {
        marginBottom: 32,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 16,
        marginLeft: 4,
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        marginBottom: 12,
    },
    optionLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    optionLabel: {
        fontSize: 16,
        fontWeight: '500',
    },
    logoutButton: {
        padding: 20,
        borderRadius: 16,
        alignItems: 'center',
        marginTop: 16,
        marginBottom: 80,
    },
    logoutText: {
        color: 'red',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

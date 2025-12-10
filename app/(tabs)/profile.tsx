import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';
import { useTheme } from '../../context/ThemeContext';
import api from '../../utils/api';

export default function ProfileScreen() {
    const { theme, toggleTheme, isDark } = useTheme();
    const colors = Colors[theme];
    const router = useRouter();
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            // ... existing data fetching
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
            await api.get('/api/v1/user/logout');
        } catch (e) {
            console.log("Logout api error", e);
        } finally {
            await SecureStore.deleteItemAsync('authToken');
            router.replace('/auth/login');
        }
    };

    const Option = ({ icon, label, rightElement, onPress }: any) => (
        <TouchableOpacity
            style={[styles.option, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={onPress}
            activeOpacity={onPress ? 0.7 : 1}
        >
            <View style={styles.optionLeft}>
                <View style={[styles.iconContainer, { backgroundColor: colors.secondary }]}>
                    <FontAwesome name={icon} size={20} color={colors.primary} />
                </View>
                <Text style={[styles.optionLabel, { color: colors.text }]}>{label}</Text>
            </View>
            {rightElement || <FontAwesome name="angle-right" size={20} color={colors.icon} />}
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <View style={[styles.avatar, { borderColor: colors.primary }]}>
                        <Text style={styles.avatarText}>
                            {user?.name?.charAt(0).toUpperCase() || 'U'}
                        </Text>
                    </View>
                    <Text style={[styles.name, { color: colors.text }]}>{user?.name || 'User'}</Text>
                    <Text style={[styles.email, { color: colors.icon }]}>{user?.email || 'email@example.com'}</Text>
                </View>

                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Settings</Text>
                    <Option
                        icon={isDark ? "moon-o" : "sun-o"}
                        label={isDark ? "Dark Mode" : "Light Mode"}
                        rightElement={
                            <Switch
                                value={isDark}
                                onValueChange={toggleTheme}
                                trackColor={{ false: '#767577', true: colors.primary }}
                                thumbColor={isDark ? '#fff' : '#f4f3f4'}
                            />
                        }
                    />
                    <Option icon="bell-o" label="Notifications" />
                    <Option icon="lock" label="Privacy & Security" />
                </View>

                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Support</Text>
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

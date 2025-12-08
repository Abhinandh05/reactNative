import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Dimensions, KeyboardAvoidingView, Platform, StyleSheet, Text, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { useColorScheme } from '../../components/useColorScheme';
import { Colors } from '../../constants/Colors';
import api from '../../utils/api';

const { width } = Dimensions.get('window');

export default function LoginScreen() {
    const router = useRouter();
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        const trimmedEmail = email.trim().toLowerCase();
        const pwd = password;

        if (!trimmedEmail || !pwd) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Please fill in all fields',
            });
            return;
        }

        setLoading(true);
        try {
            const { data } = await api.post('/api/v1/user/login', {
                email: trimmedEmail,
                password: pwd,
            });

            // Backend sets an httpOnly cookie named `token` and returns the user object.
            // We enabled `withCredentials` on the API client so the cookie will be stored/sent.
            if (data && data.success) {
                Toast.show({
                    type: 'success',
                    text1: 'Welcome back! 👋',
                    text2: data.message || 'You have logged in successfully.',
                });
                // Route based on user role from login response
                const userRole = data.user?.role;
                if (userRole === 'admin' || userRole === 'superadmin') {
                    router.replace('/admin');
                } else {
                    router.replace('/(tabs)/dashboard');
                }
            } else {
                // Handle specific backend denial types (rate limit, bot detected)
                const errType = data?.type;
                if (errType === 'RATE_LIMIT') {
                    Toast.show({ type: 'error', text1: 'Rate Limited', text2: data?.message || 'Too many attempts' });
                } else if (errType === 'BOT_DETECTED') {
                    Toast.show({ type: 'error', text1: 'Blocked', text2: data?.message || 'Automated requests are not allowed' });
                } else {
                    throw new Error(data?.message || 'Login failed');
                }
            }

        } catch (error: any) {
            console.log('Login Error:', error.response?.data || error.message);
            Toast.show({
                type: 'error',
                text1: 'Login Failed',
                text2: error.response?.data?.message || 'Please check your credentials',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
            <LinearGradient
                colors={
                    colorScheme === 'dark'
                        ? [theme.background, '#1A2A4D']
                        : ['#FFFFFF', '#E1E9FF']
                }
                style={StyleSheet.absoluteFill}
            />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.content}
            >
                <View style={styles.header}>
                    <Text style={[styles.title, { color: theme.primary }]}>LMS App</Text>
                    <Text style={[styles.subtitle, { color: theme.text }]}>Welcome back!</Text>
                </View>

                <View style={styles.form}>
                    <Input
                        placeholder="Email"
                        value={email}
                        onChangeText={setEmail}
                        glass
                        style={styles.input}
                        autoCapitalize="none"
                    />
                    <Input
                        placeholder="Password"
                        value={password}
                        onChangeText={setPassword}
                        glass
                        secureTextEntry
                        style={styles.input}
                    />

                    <Button
                        title={loading ? "Signing In..." : "Sign In"}
                        onPress={handleLogin}
                        variant="primary"
                        style={styles.button}
                        disabled={loading}
                    />

                    <Button
                        title="Create Account"
                        onPress={() => router.push('/auth/register')}
                        variant="glass"
                        style={styles.secondaryButton}
                        textStyle={{ color: theme.primary }}
                        disabled={loading}
                    />
                </View>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        padding: 24,
        justifyContent: 'center',
    },
    header: {
        marginBottom: 48,
        alignItems: 'center',
    },
    title: {
        fontSize: 42,
        fontWeight: '800',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 18,
        opacity: 0.7,
    },
    form: {
        width: '100%',
    },
    input: {
        marginBottom: 16,
    },
    button: {
        marginTop: 8,
    },
    secondaryButton: {
        marginTop: 16,
        backgroundColor: 'rgba(255,255,255,0.5)',
    },
});

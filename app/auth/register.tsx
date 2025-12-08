import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { useColorScheme } from '../../components/useColorScheme';
import { Colors } from '../../constants/Colors';
import api from '../../utils/api';

export default function RegisterScreen() {
    const router = useRouter();
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        const trimmedName = name.trim();
        const trimmedEmail = email.trim().toLowerCase();
        const trimmedPhone = phone.trim();
        const pwd = password;

        if (!trimmedName || !trimmedEmail || !trimmedPhone || !pwd) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Please fill in all fields',
            });
            return;
        }

        // Validate phone and password to match backend rules
        const phoneRegex = /^[0-9]{10}$/;
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

        if (!phoneRegex.test(trimmedPhone)) {
            Toast.show({ type: 'error', text1: 'Invalid Phone', text2: 'Phone must be exactly 10 digits' });
            return;
        }

        if (!passwordRegex.test(pwd)) {
            Toast.show({
                type: 'error',
                text1: 'Weak Password',
                text2: 'Password must be 8+ chars, include upper, lower, number and special char',
            });
            return;
        }

        setLoading(true);
        try {
            // Register endpoint
            const res = await api.post('/api/v1/user/register', {
                name: trimmedName,
                email: trimmedEmail,
                phone: trimmedPhone,
                password: pwd,
            });

            if (!res || !res.data || !res.data.success) {
                throw new Error(res?.data?.message || 'Registration failed');
            }

            // Attempt to login automatically to set cookie/session
            try {
                const loginRes = await api.post('/api/v1/user/login', {
                    email: trimmedEmail,
                    password: pwd,
                });

                if (loginRes?.data?.success) {
                    Toast.show({ type: 'success', text1: 'Welcome! 🎉', text2: 'Account created and logged in.' });
                    router.replace('/(tabs)/dashboard');
                    return;
                }
            } catch (loginErr) {
                // ignore auto-login errors and fall back to login screen
                console.log('Auto-login failed after register:', loginErr.response?.data || loginErr.message);
            }

            Toast.show({
                type: 'success',
                text1: 'Account Created! 🚀',
                text2: 'Please login with your new account.',
            });
            router.replace('/auth/login');

        } catch (error: any) {
            console.log('Register Error:', error.response?.data || error.message);
            const msg = error.response?.data?.message || error.message || 'Something went wrong';
            Toast.show({ type: 'error', text1: 'Registration Failed', text2: msg });
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
                    <Text style={[styles.title, { color: theme.primary }]}>Join Us</Text>
                    <Text style={[styles.subtitle, { color: theme.text }]}>Create your learning journey.</Text>
                </View>

                <View style={styles.form}>
                    <Input
                        placeholder="Full Name"
                        value={name}
                        onChangeText={setName}
                        glass
                        style={styles.input}
                    />
                    <Input
                        placeholder="Email"
                        value={email}
                        onChangeText={setEmail}
                        glass
                        style={styles.input}
                        autoCapitalize="none"
                    />
                    <Input
                        placeholder="Phone (10 digits)"
                        value={phone}
                        onChangeText={setPhone}
                        glass
                        style={styles.input}
                        keyboardType="phone-pad"
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
                        title={loading ? "Creating Account..." : "Sign Up"}
                        onPress={handleRegister}
                        variant="primary"
                        style={styles.button}
                        disabled={loading}
                    />

                    <Button
                        title="Already have an account? Login"
                        onPress={() => router.back()}
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

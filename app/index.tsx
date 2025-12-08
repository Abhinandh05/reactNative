import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native';
import { Button } from '../components/Button';
import { useColorScheme } from '../components/useColorScheme';
import { Colors } from '../constants/Colors';

const { width } = Dimensions.get('window');

export default function WelcomeScreen() {
    const router = useRouter();
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];

    useEffect(() => {
        // Optional: Show a toast on mount if needed, or just let the user explore
    }, []);

    return (
        <View style={styles.container}>
            <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
            <LinearGradient
                colors={
                    colorScheme === 'dark'
                        ? [theme.background, '#0A1525']
                        : ['#FFFFFF', '#E6EEFF']
                }
                style={StyleSheet.absoluteFill}
            />

            <View style={styles.content}>
                <View style={styles.logoContainer}>
                    <View style={styles.logoIcon}>
                        <Text style={styles.logoSymbol}>S</Text>
                    </View>
                    <Text style={[styles.appName, { color: theme.primary }]}>StackUp</Text>
                    <Text style={[styles.tagline, { color: theme.text }]}>Level up your skills today.</Text>
                </View>

                <Image
                    source={{ uri: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1000&auto=format&fit=crop' }}
                    style={styles.heroImage}
                    resizeMode="cover"
                />

                <View style={styles.actions}>
                    <Button
                        title="Get Started"
                        onPress={() => router.push('/auth/register')}
                        variant="primary"
                        style={styles.button}
                    />
                    <Button
                        title="Log In"
                        onPress={() => router.push('/auth/login')}
                        variant="glass"
                        style={styles.secondaryButton}
                        textStyle={{ color: theme.primary }}
                    />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        justifyContent: 'space-between',
        paddingVertical: 60,
    },
    logoContainer: {
        alignItems: 'center',
        marginTop: 40,
    },
    logoIcon: {
        width: 64,
        height: 64,
        borderRadius: 16,
        backgroundColor: '#0066FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        elevation: 4,
        shadowColor: '#0066FF',
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 4 },
    },
    logoSymbol: {
        color: 'white',
        fontSize: 32,
        fontWeight: 'bold',
    },
    appName: {
        fontSize: 36,
        fontWeight: '800',
        marginBottom: 8,
    },
    tagline: {
        fontSize: 16,
        opacity: 0.6,
    },
    heroImage: {
        width: width - 48,
        height: 250,
        borderRadius: 24,
        alignSelf: 'center',
        transform: [{ rotate: '-3deg' }],
        borderWidth: 4,
        borderColor: 'white',
    },
    actions: {
        paddingHorizontal: 24,
        marginTop: 40,
    },
    button: {
        marginBottom: 16,
    },
    secondaryButton: {
        backgroundColor: 'rgba(255,255,255,0.6)',
    },
});

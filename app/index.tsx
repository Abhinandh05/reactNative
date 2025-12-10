import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import Animated, {
    Easing,
    FadeInDown,
    FadeInUp,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withRepeat,
    withSequence,
    withTiming
} from 'react-native-reanimated';
import { Button } from '../components/Button';
import { useColorScheme } from '../components/useColorScheme';
import { Colors } from '../constants/Colors';

const { width, height } = Dimensions.get('window');

// Floating Blob Component
const Blob = ({ style, delay = 0 }) => {
    const translateY = useSharedValue(0);
    const scale = useSharedValue(1);

    useEffect(() => {
        translateY.value = withDelay(delay, withRepeat(
            withSequence(
                withTiming(-20, { duration: 4000, easing: Easing.inOut(Easing.ease) }),
                withTiming(0, { duration: 4000, easing: Easing.inOut(Easing.ease) })
            ),
            -1,
            true
        ));
        scale.value = withDelay(delay, withRepeat(
            withSequence(
                withTiming(1.1, { duration: 4000, easing: Easing.inOut(Easing.ease) }),
                withTiming(1, { duration: 4000, easing: Easing.inOut(Easing.ease) })
            ),
            -1,
            true
        ));
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }, { scale: scale.value }],
    }));

    return <Animated.View style={[style, animatedStyle]} />;
};

export default function WelcomeScreen() {
    const router = useRouter();
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];
    const [checkingAuth, setCheckingAuth] = useState(true);

    // Hero Image Float Animation
    const heroTranslateY = useSharedValue(0);

    useEffect(() => {
        checkSession();

        // Start Hero Animation
        heroTranslateY.value = withRepeat(
            withSequence(
                withTiming(-10, { duration: 2500, easing: Easing.inOut(Easing.quad) }),
                withTiming(0, { duration: 2500, easing: Easing.inOut(Easing.quad) })
            ),
            -1,
            true
        );
    }, []);

    const checkSession = async () => {
        try {
            const token = await SecureStore.getItemAsync('authToken');
            if (token) {
                // Optional: Validate token with backend here
                router.replace('/(tabs)/dashboard');
            }
        } catch (e) {
            console.log('Error checking session', e);
        } finally {
            setCheckingAuth(false);
        }
    };

    const heroAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: heroTranslateY.value }, { rotate: '-3deg' }],
    }));

    if (checkingAuth) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', backgroundColor: theme.background }]}>
                <ActivityIndicator size="large" color={theme.primary} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />

            {/* Background Gradient */}
            <LinearGradient
                colors={
                    colorScheme === 'dark'
                        ? [theme.background, '#0f172a']
                        : ['#eff6ff', '#F8FAFC']
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
            />

            {/* Floating Blobs Background */}
            <Blob
                style={[styles.blob, { backgroundColor: theme.primary, opacity: 0.08, top: -80, right: -80, width: 350, height: 350, borderRadius: 175 }]}
                delay={0}
            />
            <Blob
                style={[styles.blob, { backgroundColor: theme.accent, opacity: 0.08, bottom: 100, left: -100, width: 300, height: 300, borderRadius: 150 }]}
                delay={1000}
            />
            <Blob
                style={[styles.blob, { backgroundColor: theme.primaryLight, opacity: 0.05, top: '40%', right: '80%', width: 200, height: 200, borderRadius: 100 }]}
                delay={2000}
            />

            <SafeAreaView style={styles.content}>
                <Animated.View entering={FadeInDown.delay(200).duration(600).springify()} style={styles.header}>
                    <View style={styles.logoBadge}>
                        <LinearGradient
                            colors={Colors.gradient.primary}
                            style={styles.logoGradient}
                        >
                            <Text style={styles.logoSymbol}>S</Text>
                        </LinearGradient>
                    </View>
                    <Text style={[styles.appName, { color: theme.text }]}>StackUp</Text>
                </Animated.View>

                <View style={styles.heroContainer}>
                    <Animated.Image
                        entering={FadeInDown.delay(400).duration(600).springify()}
                        source={{ uri: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1000&auto=format&fit=crop' }}
                        style={[styles.heroImage, heroAnimatedStyle]}
                        resizeMode="cover"
                    />

                    {/* Floating Cards with distinct animations */}
                    <Animated.View
                        entering={FadeInUp.delay(800).springify().damping(12)}
                        style={[styles.floatingCard, { top: 40, right: -15, backgroundColor: theme.surface }]}
                    >
                        <View style={[styles.iconBox, { backgroundColor: '#FEF3C7' }]}>
                            <Text style={{ fontSize: 16 }}>🔥</Text>
                        </View>
                        <View>
                            <Text style={[styles.floatingLabel, { color: theme.textSecondary }]}>Trending</Text>
                            <Text style={[styles.floatingValue, { color: theme.text }]}>#1 Course</Text>
                        </View>
                    </Animated.View>

                    <Animated.View
                        entering={FadeInUp.delay(1000).springify().damping(12)}
                        style={[styles.floatingCard, { bottom: 60, left: -15, backgroundColor: theme.surface }]}
                    >
                        <View style={[styles.iconBox, { backgroundColor: '#DCFCE7' }]}>
                            <Text style={{ fontSize: 16 }}>🎓</Text>
                        </View>
                        <View>
                            <Text style={[styles.floatingLabel, { color: theme.textSecondary }]}>Tutors</Text>
                            <Text style={[styles.floatingValue, { color: theme.text }]}>Expert</Text>
                        </View>
                    </Animated.View>
                </View>

                <Animated.View style={styles.textContainer}>
                    <Animated.Text
                        entering={FadeInDown.delay(600).duration(600)}
                        style={[styles.headline, { color: theme.text }]}
                    >
                        Find your next <Text style={{ color: theme.primary }}>skill</Text> today
                    </Animated.Text>
                    <Animated.Text
                        entering={FadeInDown.delay(800).duration(600)}
                        style={[styles.subheadline, { color: theme.textSecondary }]}
                    >
                        Access 1000+ courses from world-class instructors. Learn at your own pace.
                    </Animated.Text>
                </Animated.View>

                <Animated.View entering={FadeInDown.delay(1000).duration(600)} style={styles.actions}>
                    <Button
                        title="Get Started"
                        onPress={() => router.push('/auth/register')}
                        variant="primary"
                        style={styles.mainButton}
                    />
                    <Button
                        title="I already have an account"
                        onPress={() => router.push('/auth/login')}
                        variant="secondary"
                        style={styles.secondaryButton}
                    />
                </Animated.View>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    blob: {
        position: 'absolute',
    },
    content: {
        flex: 1,
        justifyContent: 'space-between',
        paddingVertical: 20,
    },
    header: {
        alignItems: 'center',
        marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    logoBadge: {
        marginRight: 10,
        shadowColor: '#6366F1',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    logoGradient: {
        width: 40,
        height: 40,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoSymbol: {
        color: 'white',
        fontSize: 24,
        fontWeight: '800',
    },
    appName: {
        fontSize: 28,
        fontWeight: '800',
        letterSpacing: -0.5,
    },
    heroContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        height: height * 0.45, // Allocate specific height
    },
    heroImage: {
        width: width * 0.85,
        height: width * 0.95, // Portrait orientation
        borderRadius: 32,
        // Rotation is handled by Animated Style now
    },
    floatingCard: {
        position: 'absolute',
        padding: 12,
        paddingHorizontal: 16,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: 'rgba(0,0,0,0.1)',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 10,
        gap: 12,
        minWidth: 140,
    },
    iconBox: {
        width: 40,
        height: 40,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    floatingLabel: {
        fontSize: 12,
        fontWeight: '600',
    },
    floatingValue: {
        fontSize: 16,
        fontWeight: '800',
    },
    textContainer: {
        paddingHorizontal: 32,
        alignItems: 'center',
        marginBottom: 20,
    },
    headline: {
        fontSize: 36, // Larger
        fontWeight: '900',
        textAlign: 'center',
        lineHeight: 44,
        marginBottom: 16,
    },
    subheadline: {
        fontSize: 16,
        textAlign: 'center',
        lineHeight: 24,
    },
    actions: {
        paddingHorizontal: 24,
        paddingBottom: 20,
        gap: 16,
    },
    mainButton: {
        width: '100%',
        shadowColor: '#6366F1',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 15,
        elevation: 8,
    },
    secondaryButton: {
        width: '100%',
        backgroundColor: 'transparent',
    },
});

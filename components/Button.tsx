import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TextStyle, TouchableOpacity, ViewStyle } from 'react-native';
import { Colors } from '../constants/Colors';
import { useColorScheme } from './useColorScheme';

interface ButtonProps {
    title: string;
    onPress: () => void;
    style?: ViewStyle;
    textStyle?: TextStyle;
    variant?: 'primary' | 'secondary' | 'glass' | 'outline';
    disabled?: boolean;
    loading?: boolean;
    icon?: React.ReactNode;
}

export function Button({
    title,
    onPress,
    style,
    textStyle,
    variant = 'primary',
    disabled = false,
    loading = false,
    icon
}: ButtonProps) {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];
    const gradients = Colors.gradient;

    const isGlass = variant === 'glass';
    const isPrimary = variant === 'primary';
    const isOutline = variant === 'outline';

    if (isGlass) {
        return (
            <TouchableOpacity
                onPress={onPress}
                activeOpacity={0.7}
                style={[styles.container, style, disabled && { opacity: 0.5 }]}
                disabled={disabled || loading}
            >
                {/* Note: In a real "glass" implementation we might use BlurView, 
                    but a semi-transparent background works universally well for now. */}
                <LinearGradient
                    colors={['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.1)']}
                    style={styles.contentContainer}
                >
                    {loading ? <ActivityIndicator color={theme.text} /> : (
                        <Text style={[styles.text, { color: theme.text }, textStyle]}>{title}</Text>
                    )}
                </LinearGradient>
            </TouchableOpacity>
        );
    }

    if (isPrimary) {
        return (
            <TouchableOpacity
                onPress={onPress}
                activeOpacity={0.9}
                style={[styles.container, styles.shadow, style, disabled && { opacity: 0.7 }]}
                disabled={disabled || loading}
            >
                <LinearGradient
                    colors={gradients.primary}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.contentContainer}
                >
                    {loading ? <ActivityIndicator color="#FFF" /> : (
                        <>
                            {icon}
                            <Text style={[styles.text, { color: '#FFF' }, icon ? { marginLeft: 8 } : undefined, textStyle]}>{title}</Text>
                        </>
                    )}
                </LinearGradient>
            </TouchableOpacity>
        );
    }

    if (isOutline) {
        return (
            <TouchableOpacity
                onPress={onPress}
                activeOpacity={0.7}
                style={[
                    styles.container,
                    styles.contentContainer,
                    {
                        backgroundColor: 'transparent',
                        borderWidth: 1.5,
                        borderColor: theme.primary
                    },
                    style,
                    disabled && { opacity: 0.5 }
                ]}
                disabled={disabled || loading}
            >
                {loading ? <ActivityIndicator color={theme.primary} /> : (
                    <Text style={[styles.text, { color: theme.primary }, textStyle]}>{title}</Text>
                )}
            </TouchableOpacity>
        );
    }

    // Secondary / Default
    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.7}
            style={[
                styles.container,
                styles.contentContainer,
                { backgroundColor: theme.secondary },
                style,
                disabled && { opacity: 0.5 }
            ]}
            disabled={disabled || loading}
        >
            {loading ? <ActivityIndicator color={theme.text} /> : (
                <Text style={[styles.text, { color: theme.text }, textStyle]}>{title}</Text>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 16,
        overflow: 'hidden',
        width: '100%',
    },
    contentContainer: {
        paddingVertical: 18, // Increased from 16
        paddingHorizontal: 24,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        width: '100%',
    },
    shadow: {
        shadowColor: '#6366F1', // Use new primary
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25, // Softened from 0.3
        shadowRadius: 10, // Increased radius
        elevation: 4, // Reduced elevation
    },
    text: {
        fontSize: 16,
        fontWeight: '600',
        letterSpacing: 0.5,
    },
});

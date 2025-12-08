import { BlurView } from 'expo-blur';
import React from 'react';
import { StyleSheet, Text, TextStyle, TouchableOpacity, ViewStyle } from 'react-native';
import { Colors } from '../constants/Colors';
import { useColorScheme } from './useColorScheme';

interface ButtonProps {
    title: string;
    onPress: () => void;
    style?: ViewStyle;
    textStyle?: TextStyle;
    variant?: 'primary' | 'secondary' | 'glass';
    disabled?: boolean;
}

export function Button({ title, onPress, style, textStyle, variant = 'primary', disabled = false }: ButtonProps) {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];

    const isGlass = variant === 'glass';
    const isPrimary = variant === 'primary';

    if (isGlass) {
        return (
            <TouchableOpacity
                onPress={onPress}
                activeOpacity={0.8}
                style={[styles.container, style, disabled && { opacity: 0.5 }]}
                disabled={disabled}
            >
                <BlurView intensity={80} tint={colorScheme === 'dark' ? 'dark' : 'light'} style={styles.blurContainer}>
                    <Text style={[styles.text, { color: theme.text }, textStyle]}>{title}</Text>
                </BlurView>
            </TouchableOpacity>
        );
    }

    const backgroundColor = isPrimary ? theme.primary : theme.secondary;
    const textColor = isPrimary ? '#FFFFFF' : theme.text;

    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.8}
            style={[
                styles.button,
                { backgroundColor },
                style,
                disabled && { opacity: 0.5 }
            ]}
            disabled={disabled}
        >
            <Text style={[styles.text, { color: textColor }, textStyle]}>{title}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 12,
        overflow: 'hidden',
    },
    button: {
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    blurContainer: {
        paddingVertical: 16,
        paddingHorizontal: 24,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    text: {
        fontSize: 16,
        fontWeight: '600',
        letterSpacing: 0.5,
    },
});

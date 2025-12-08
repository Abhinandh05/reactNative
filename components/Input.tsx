import { BlurView } from 'expo-blur';
import React from 'react';
import { StyleSheet, TextInput, TextInputProps, View } from 'react-native';
import { Colors } from '../constants/Colors';
import { useColorScheme } from './useColorScheme';

interface InputProps extends TextInputProps {
    glass?: boolean;
}

export function Input({ style, glass, ...props }: InputProps) {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];

    const placeholderColor = colorScheme === 'dark' ? '#9BA1A6' : '#687076';

    if (glass) {
        return (
            <View style={[styles.container, style]}>
                <BlurView intensity={30} tint={colorScheme === 'dark' ? 'dark' : 'light'} style={styles.blurContainer}>
                    <TextInput
                        placeholderTextColor={placeholderColor}
                        style={[styles.input, { color: theme.text }]}
                        {...props}
                    />
                </BlurView>
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: colorScheme === 'dark' ? '#1E1E1E' : '#F0F2F5' }, style]}>
            <TextInput
                placeholderTextColor={placeholderColor}
                style={[styles.input, { color: theme.text }]}
                {...props}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 12,
        overflow: 'hidden',
        borderColor: 'transparent', // Can add border if needed
    },
    blurContainer: {
        padding: 16,
        width: '100%',
    },
    input: {
        fontSize: 16,
        paddingVertical: 12,
        paddingHorizontal: 16,
        width: '100%',
    },
});

import React, { useState } from 'react';
import { StyleSheet, TextInput, TextInputProps, TouchableOpacity, View, ViewStyle } from 'react-native';
import { Colors } from '../constants/Colors';
import { useColorScheme } from './useColorScheme';

interface InputProps extends TextInputProps {
    glass?: boolean;
    startIcon?: React.ReactNode;
    endIcon?: React.ReactNode;
    onEndIconPress?: () => void;
    containerStyle?: ViewStyle;
    error?: string;
}

export function Input({ style, glass, startIcon, endIcon, onEndIconPress, containerStyle, error, ...props }: InputProps) {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];
    const [isFocused, setIsFocused] = useState(false);

    const placeholderColor = theme.textSecondary;
    const backgroundColor = glass
        ? (colorScheme === 'dark' ? 'rgba(30, 41, 59, 0.7)' : 'rgba(255, 255, 255, 0.7)')
        : theme.surface;

    const borderColor = error
        ? theme.error
        : isFocused
            ? theme.primary
            : theme.border;

    return (
        <View style={[
            styles.container,
            {
                backgroundColor,
                borderColor,
                borderWidth: isFocused || error ? 1.5 : 1,
            },
            containerStyle
        ]}>
            {startIcon && <View style={styles.iconContainer}>{startIcon}</View>}

            <TextInput
                placeholderTextColor={placeholderColor}
                style={[
                    styles.input,
                    { color: theme.text },
                    startIcon ? { paddingLeft: 8 } : undefined,
                    endIcon ? { paddingRight: 8 } : undefined,
                    style
                ]}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                {...props}
            />

            {endIcon && (
                <TouchableOpacity
                    onPress={onEndIconPress}
                    disabled={!onEndIconPress}
                    style={styles.iconContainer}
                >
                    {endIcon}
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 14, // Slightly rounder
        paddingHorizontal: 16,
        paddingVertical: 6, // Increased from 4
        marginBottom: 16, // Increased bottom margin
    },
    iconContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 24,
    },
    input: {
        flex: 1,
        fontSize: 16,
        paddingVertical: 12,
        height: 50,
    },
});

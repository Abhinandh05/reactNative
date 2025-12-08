import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from '../components/useColorScheme';
import { Colors } from '../constants/Colors';

interface ErrorScreenProps {
    errorMessage?: string;
    details?: string;
    onRetry?: () => void;
}

export default function ErrorScreen({ errorMessage, details, onRetry }: ErrorScreenProps) {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];
    const router = useRouter();

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.errorContainer}>
                    <FontAwesome name="warning" size={64} color={theme.primary} />
                    <Text style={[styles.title, { color: theme.primary }]}>Oops!</Text>
                    <Text style={[styles.message, { color: theme.text }]}>
                        {errorMessage || 'Something went wrong'}
                    </Text>
                    {details && (
                        <View style={[styles.detailsBox, { backgroundColor: theme.card }]}>
                            <Text style={[styles.detailsText, { color: theme.icon }]}>
                                {details}
                            </Text>
                        </View>
                    )}
                </View>

                <View style={styles.buttonContainer}>
                    {onRetry && (
                        <TouchableOpacity
                            style={[styles.button, { backgroundColor: theme.primary }]}
                            onPress={onRetry}
                        >
                            <FontAwesome name="refresh" size={18} color="white" />
                            <Text style={styles.buttonText}>Try Again</Text>
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity
                        style={[styles.button, { backgroundColor: theme.secondary, marginTop: 12 }]}
                        onPress={() => router.back()}
                    >
                        <FontAwesome name="arrow-left" size={18} color={theme.primary} />
                        <Text style={[styles.buttonText, { color: theme.primary }]}>Go Back</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        padding: 24,
        justifyContent: 'space-between',
    },
    errorContainer: {
        alignItems: 'center',
        marginVertical: 40,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        marginTop: 16,
        marginBottom: 8,
    },
    message: {
        fontSize: 18,
        marginBottom: 16,
        textAlign: 'center',
    },
    detailsBox: {
        padding: 12,
        borderRadius: 8,
        marginTop: 12,
        maxWidth: '100%',
    },
    detailsText: {
        fontSize: 13,
        textAlign: 'center',
    },
    buttonContainer: {
        marginBottom: 40,
    },
    button: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 14,
        borderRadius: 8,
        gap: 8,
    },
    buttonText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 16,
    },
});

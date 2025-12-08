import { BlurView } from 'expo-blur';
import { Link } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import { Colors } from '../constants/Colors';
import { useColorScheme } from './useColorScheme';

interface CourseCardProps {
    id: string;
    title: string;
    author: string;
    image: any; // source
    progress?: number;
    rating?: number;
    style?: ViewStyle;
}

export function CourseCard({ id, title, author, image, progress, rating = 4.5, style }: CourseCardProps) {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];

    return (
        <Link href={`/course-detail?courseId=${id}`} asChild>
            <TouchableOpacity activeOpacity={0.8} style={[styles.container, style]}>
                <View style={styles.imageContainer}>
                    <Image source={image} style={styles.image} resizeMode="cover" />
                    {progress !== undefined && (
                        <View style={styles.badgeContainer}>
                            <BlurView intensity={60} tint="dark" style={styles.badge}>
                                <Text style={styles.badgeText}>{progress}% Complete</Text>
                            </BlurView>
                        </View>
                    )}
                </View>

                <View style={[styles.content, { backgroundColor: theme.card }]}>
                    <Text style={[styles.title, { color: theme.text }]} numberOfLines={2}>{title}</Text>
                    <Text style={[styles.author, { color: theme.icon }]}>{author}</Text>

                    {progress === undefined ? (
                        <View style={styles.metaRow}>
                            <Text style={[styles.rating, { color: '#E59819' }]}>{rating} ★★★★★</Text>
                            <Text style={[styles.reviews, { color: theme.icon }]}> (1,240)</Text>
                            <Text style={[styles.price, { color: theme.text }]}>$19.99</Text>
                        </View>
                    ) : (
                        <View style={styles.progressBarContainer}>
                            <View style={[styles.progressBar, { width: `${progress}%`, backgroundColor: theme.primary }]} />
                            <View style={[styles.progressBarTrack, { backgroundColor: theme.border }]} />
                        </View>
                    )}
                </View>
            </TouchableOpacity>
        </Link>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    imageContainer: {
        height: 160,
        width: '100%',
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    badgeContainer: {
        position: 'absolute',
        top: 12,
        right: 12,
    },
    badge: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 8,
        overflow: 'hidden',
    },
    badgeText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    content: {
        padding: 16,
    },
    title: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 4,
        lineHeight: 22,
    },
    author: {
        fontSize: 14,
        marginBottom: 12,
    },
    progressBarContainer: {
        height: 6,
        width: '100%',
        borderRadius: 3,
        position: 'relative',
    },
    progressBarTrack: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        borderRadius: 3,
        opacity: 0.3,
    },
    progressBar: {
        height: '100%',
        borderRadius: 3,
        zIndex: 1,
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    rating: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    reviews: {
        fontSize: 12,
        marginRight: 8,
    },
    price: {
        fontSize: 14,
        fontWeight: 'bold',
        marginLeft: 'auto',
    },
});

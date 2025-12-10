import { LinearGradient } from 'expo-linear-gradient';
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
    price?: number;
    reviews?: number;
    style?: ViewStyle;
}

export function CourseCard({
    id,
    title,
    author,
    image,
    progress,
    rating = 4.8,
    price = 49.99,
    reviews = 120,
    style
}: CourseCardProps) {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];
    const gradients = Colors.gradient;

    return (
        <Link href={`/course-detail?courseId=${id}`} asChild>
            <TouchableOpacity activeOpacity={0.9} style={[styles.container, styles.shadow, { backgroundColor: theme.card }, style]}>
                <View style={styles.imageWrapper}>
                    <Image source={image} style={styles.image} resizeMode="cover" />
                    <LinearGradient
                        colors={['transparent', 'rgba(0,0,0,0.6)']}
                        style={StyleSheet.absoluteFill}
                    />
                    {progress !== undefined && (
                        <View style={styles.badgeContainer}>
                            <View style={[styles.badge, { backgroundColor: theme.primary }]}>
                                <Text style={styles.badgeText}>{progress}% Completed</Text>
                            </View>
                        </View>
                    )}
                </View>

                <View style={styles.content}>
                    <Text style={[styles.category, { color: theme.primary }]}>Development</Text>
                    <Text style={[styles.title, { color: theme.text }]} numberOfLines={2}>{title}</Text>
                    <Text style={[styles.author, { color: theme.textSecondary }]}>By {author}</Text>

                    {progress === undefined ? (
                        <View style={styles.footer}>
                            <View style={styles.ratingContainer}>
                                <Text style={[styles.star, { color: theme.warning }]}>★</Text>
                                <Text style={[styles.rating, { color: theme.text }]}>{rating}</Text>
                                <Text style={[styles.reviews, { color: theme.textSecondary }]}>({reviews})</Text>
                            </View>
                            <Text style={[styles.price, { color: theme.primary }]}>${price}</Text>
                        </View>
                    ) : (
                        <View style={styles.progressContainer}>
                            <View style={[styles.progressBarTrack, { backgroundColor: theme.border }]}>
                                <View style={[styles.progressBarFill, { width: `${progress}%`, backgroundColor: theme.success }]} />
                            </View>
                            <Text style={[styles.progressText, { color: theme.textSecondary }]}>{progress}%</Text>
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
        marginBottom: 20,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.05)',
    },
    shadow: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05, // Much softer
        shadowRadius: 15, // More spread
        elevation: 3,
    },
    imageWrapper: {
        height: 180,
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
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 100,
    },
    badgeText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },
    content: {
        padding: 20, // Increased from 16
    },
    category: {
        fontSize: 12,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 10, // Increased spacing
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 10,
        lineHeight: 28, // Better line height
    },
    author: {
        fontSize: 14,
        marginBottom: 20, // More breathing room
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 'auto',
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    star: {
        fontSize: 16,
        marginRight: 4,
    },
    rating: {
        fontSize: 14,
        fontWeight: '700',
        marginRight: 4,
    },
    reviews: {
        fontSize: 14,
    },
    price: {
        fontSize: 18,
        fontWeight: '700',
    },
    progressContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    progressBarTrack: {
        flex: 1,
        height: 6,
        borderRadius: 3,
        overflow: 'hidden',
        marginRight: 12,
    },
    progressBarFill: {
        height: '100%',
        borderRadius: 3,
    },
    progressText: {
        fontSize: 12,
        fontWeight: '600',
    },
});

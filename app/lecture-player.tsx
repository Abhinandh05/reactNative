import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Audio } from 'expo-av'; // Import Audio
import { useLocalSearchParams, useRouter } from 'expo-router';
import { VideoView, useVideoPlayer } from 'expo-video';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { useColorScheme } from '../components/useColorScheme';
import { Colors } from '../constants/Colors';
import api from '../utils/api';

interface Lecture {
    id: string;
    lectureTitle: string;
    videoUrl?: string;
    publicId?: string;
    isPreviewFree?: boolean;
}

const { width } = Dimensions.get('window');
const videoHeight = (width * 9) / 16;

export default function LecturePlayerScreen() {
    const { lectureId, courseId, lectureTitle } = useLocalSearchParams();
    const router = useRouter();
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];

    const [lecture, setLecture] = useState<Lecture | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isCompleted, setIsCompleted] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    const player = useVideoPlayer(lecture?.videoUrl || '', (player) => {
        player.loop = false;
        player.volume = 1.0;
        player.muted = false;
        player.play(); // Auto-play when ready
    });

    useEffect(() => {
        // Enforce audio playback in silent mode
        const enableAudio = async () => {
            try {
                await Audio.setAudioModeAsync({
                    playsInSilentModeIOS: true,
                    staysActiveInBackground: false,
                    shouldDuckAndroid: true,
                });
                console.log('Audio mode set for video playback');
            } catch (e) {
                console.warn('Failed to set audio mode in player:', e);
            }
        };
        enableAudio();
    }, []);

    useEffect(() => {
        fetchLectureDetails();
    }, [lectureId]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (player && isPlaying) {
                setCurrentTime(player.currentTime);
                setDuration(player.duration);
            }
        }, 500);
        return () => clearInterval(interval);
    }, [player, isPlaying]);

    const fetchLectureDetails = async () => {
        try {
            setLoading(true);
            setError(null);

            if (!courseId || !lectureId) {
                throw new Error('Course ID or Lecture ID is missing');
            }

            console.log('Fetching lecture details for courseId:', courseId, 'lectureId:', lectureId);

            // Fetch lectures from course to get full details
            const lecturesRes = await api.get(`/api/v1/video/${courseId}/lecture`);
            console.log('Lectures response:', lecturesRes.data);

            const lecturesData = lecturesRes.data?.lectures || lecturesRes.data || [];

            const foundLecture = lecturesData.find((l: any) => l.id.toString() === lectureId);

            if (!foundLecture) {
                console.warn('Lecture not found in list. Available lectures:', lecturesData.map((l: any) => l.id));
                throw new Error(`Lecture ${lectureId} not found in course lectures`);
            }

            console.log('Lecture found:', foundLecture);
            setLecture(foundLecture);

            // Check if lecture is completed
            try {
                const progressRes = await api.get(
                    `/api/v1/course-progress/${courseId}/${lectureId}`
                );
                setIsCompleted(progressRes.data?.lectureProgress?.completed || false);
            } catch (progressError: any) {
                console.warn('Could not fetch progress:', progressError.message);
            }
        } catch (err: any) {
            console.error('Error fetching lecture details:', {
                message: err.message,
                response: err.response?.data,
                status: err.response?.status,
            });
            setError(err.response?.data?.message || 'Failed to load lecture');
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Could not load lecture',
            });
        } finally {
            setLoading(false);
        }
    };

    const handlePlayPause = () => {
        if (player) {
            if (isPlaying) {
                player.pause();
            } else {
                player.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleSeek = (time: number) => {
        if (player) {
            player.currentTime = time;
        }
    };

    const handleMarkComplete = async () => {
        try {
            await api.post(`/api/v1/course-progress/update`, {
                courseId,
                lectureId,
                completed: !isCompleted,
                progress: !isCompleted ? 100 : 0,
            });

            setIsCompleted(!isCompleted);
            Toast.show({
                type: 'success',
                text1: 'Success',
                text2: !isCompleted ? 'Lecture marked as completed' : 'Lecture marked as incomplete',
            });
        } catch (err: any) {
            console.error('Error updating progress:', err.message);
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Could not update progress',
            });
        }
    };

    const formatTime = (seconds: number): string => {
        if (isNaN(seconds)) return '0:00';
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);
        return hrs > 0
            ? `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
            : `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    if (loading) {
        return (
            <View style={[styles.container, styles.centered, { backgroundColor: theme.background }]}>
                <ActivityIndicator size="large" color={theme.primary} />
            </View>
        );
    }

    if (error || !lecture) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <FontAwesome name="arrow-left" size={24} color={theme.primary} />
                    </TouchableOpacity>
                    <Text style={[styles.headerTitle, { color: theme.text }]}>Lecture</Text>
                    <View style={{ width: 24 }} />
                </View>
                <View style={styles.errorContainer}>
                    <FontAwesome name="exclamation-circle" size={48} color={theme.primary} />
                    <Text style={[styles.errorText, { color: theme.text }]}>
                        {error || 'Lecture not found'}
                    </Text>
                    <TouchableOpacity
                        style={[styles.button, { backgroundColor: theme.primary }]}
                        onPress={() => router.back()}
                    >
                        <Text style={styles.buttonText}>Go Back</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Video Player Area */}
                <View style={styles.videoWrapper}>
                    {lecture.videoUrl ? (
                        <VideoView
                            style={styles.video}
                            player={player}
                            allowsFullscreen
                            allowsPictureInPicture
                            nativeControls={true}
                            contentFit="contain"
                        />
                    ) : (
                        <View style={[styles.videoPlaceholder, { backgroundColor: theme.card }]}>
                            <FontAwesome name="lock" size={48} color={theme.textSecondary} />
                            <Text style={[styles.videoText, { color: theme.text }]}>
                                Content Locked
                            </Text>
                            {!lecture.isPreviewFree && (
                                <Text style={[styles.previewText, { color: theme.textSecondary }]}>
                                    Enroll in this course to watch.
                                </Text>
                            )}
                        </View>
                    )}
                </View>

                {/* Content Section */}
                <View style={styles.content}>
                    <View style={styles.titleRow}>
                        <Text style={[styles.lectureTitle, { color: theme.text }]}>
                            {lecture.lectureTitle}
                        </Text>
                        {lecture.isPreviewFree && (
                            <View style={[styles.badge, { backgroundColor: theme.primary + '20' }]}>
                                <Text style={[styles.badgeText, { color: theme.primary }]}>Preview</Text>
                            </View>
                        )}
                    </View>

                    {/* Primary Action: Mark Complete */}
                    <TouchableOpacity
                        style={[
                            styles.completeButton,
                            {
                                backgroundColor: isCompleted ? theme.success : theme.primary,
                                shadowColor: isCompleted ? theme.success : theme.primary,
                            },
                        ]}
                        onPress={handleMarkComplete}
                        activeOpacity={0.8}
                    >
                        <FontAwesome
                            name={isCompleted ? 'check' : 'circle-o'}
                            size={20}
                            color="white"
                        />
                        <Text style={styles.completeButtonText}>
                            {isCompleted ? 'Completed' : 'Mark as Complete'}
                        </Text>
                    </TouchableOpacity>

                    {isCompleted && (
                        <Text style={[styles.congratsText, { color: theme.textSecondary }]}>
                            Great job! You've finished this lecture.
                        </Text>
                    )}

                    <View style={styles.divider} />

                    {/* Lecture Details / Description placeholder */}
                    <Text style={[styles.sectionHeader, { color: theme.text }]}>Description</Text>
                    <Text style={[styles.description, { color: theme.textSecondary }]}>
                        No additional notes for this lecture. Focus on the video content above.
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    centered: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 16,
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: '600',
        flex: 1,
        textAlign: 'center',
    },
    videoWrapper: {
        width: '100%',
        aspectRatio: 16 / 9,
        backgroundColor: '#000',
    },
    video: {
        width: '100%',
        height: '100%',
    },
    videoPlaceholder: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    videoText: {
        fontSize: 16,
        fontWeight: '600',
        marginTop: 16,
    },
    previewText: {
        fontSize: 14,
        marginTop: 8,
    },
    content: {
        padding: 24,
    },
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 24,
    },
    lectureTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        flex: 1,
        marginRight: 16,
        lineHeight: 32,
    },
    badge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 100,
    },
    badgeText: {
        fontSize: 12,
        fontWeight: '700',
        textTransform: 'uppercase',
    },
    completeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        borderRadius: 16,
        gap: 12,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
        marginBottom: 16,
    },
    completeButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '700',
    },
    congratsText: {
        textAlign: 'center',
        marginBottom: 24,
        fontSize: 14,
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(0,0,0,0.05)',
        marginVertical: 24,
    },
    sectionHeader: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 12,
    },
    description: {
        fontSize: 15,
        lineHeight: 24,
    },
    // Error states
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    errorText: {
        fontSize: 16,
        marginTop: 16,
        textAlign: 'center',
        marginBottom: 24,
    },
    button: {
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 12,
    },
    buttonText: {
        color: 'white',
        fontWeight: '600',
    },
});

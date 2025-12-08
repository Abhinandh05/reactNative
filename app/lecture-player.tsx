import FontAwesome from '@expo/vector-icons/FontAwesome';
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
        player.volume = 1;
    });

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
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <FontAwesome name="arrow-left" size={24} color={theme.primary} />
                    </TouchableOpacity>
                    <Text style={[styles.headerTitle, { color: theme.text }]} numberOfLines={1}>
                        Lecture
                    </Text>
                    <View style={{ width: 24 }} />
                </View>

                {/* Video Player */}
                {lecture.videoUrl ? (
                    <View style={styles.videoContainer}>
                        <VideoView
                            style={styles.video}
                            player={player}
                            allowsFullscreen
                            allowsPictureInPicture
                            nativeControls={true}
                        />

                        {/* Custom Controls */}
                        <View style={[styles.controlsContainer, { backgroundColor: theme.card }]}>
                            {/* Progress Bar */}
                            <View style={styles.progressBarContainer}>
                                <TouchableOpacity
                                    style={[
                                        styles.progressBar,
                                        { backgroundColor: `${theme.primary}33` },
                                    ]}
                                    onPress={(event) => {
                                        const { locationX } = event.nativeEvent;
                                        const percentage = locationX / (width - 32);
                                        const newTime = percentage * duration;
                                        handleSeek(newTime);
                                    }}
                                >
                                    <View
                                        style={[
                                            styles.progressFill,
                                            {
                                                width: `${(currentTime / duration) * 100 || 0}%`,
                                                backgroundColor: theme.primary,
                                            },
                                        ]}
                                    />
                                </TouchableOpacity>
                            </View>

                            {/* Play Controls */}
                            <View style={styles.playerControls}>
                                <TouchableOpacity
                                    style={[styles.controlButton, { backgroundColor: theme.primary }]}
                                    onPress={handlePlayPause}
                                >
                                    <FontAwesome
                                        name={isPlaying ? 'pause' : 'play'}
                                        size={24}
                                        color="white"
                                    />
                                </TouchableOpacity>

                                <View style={styles.timeDisplay}>
                                    <Text style={[styles.timeText, { color: theme.text }]}>
                                        {formatTime(currentTime)} / {formatTime(duration)}
                                    </Text>
                                </View>

                                <TouchableOpacity
                                    style={[
                                        styles.controlButton,
                                        {
                                            backgroundColor: isCompleted ? theme.primary : `${theme.primary}33`,
                                        },
                                    ]}
                                    onPress={handleMarkComplete}
                                >
                                    <FontAwesome
                                        name={isCompleted ? 'check' : 'circle-o'}
                                        size={24}
                                        color={isCompleted ? 'white' : theme.primary}
                                    />
                                </TouchableOpacity>
                            </View>

                            {/* Time Info */}
                            <View style={styles.timeInfo}>
                                <Text style={[styles.timeLabel, { color: theme.icon }]}>
                                    Duration: {formatTime(duration)}
                                </Text>
                            </View>
                        </View>
                    </View>
                ) : (
                    <View style={[styles.videoPlaceholder, { backgroundColor: theme.card }]}>
                        <FontAwesome name="lock" size={64} color={theme.icon} />
                        <Text style={[styles.videoText, { color: theme.text }]}>
                            Video Not Available
                        </Text>
                        {!lecture.isPreviewFree && (
                            <Text style={[styles.previewText, { color: theme.icon }]}>
                                Please enroll to access this lecture
                            </Text>
                        )}
                    </View>
                )}

                {/* Content Section */}
                <View style={styles.content}>
                    <Text style={[styles.lectureTitle, { color: theme.text }]}>
                        {lecture.lectureTitle}
                    </Text>

                    {/* Actions */}
                    <View style={styles.actionsContainer}>
                        <TouchableOpacity
                            style={[styles.actionButton, { backgroundColor: theme.primary }]}
                            onPress={handlePlayPause}
                        >
                            <FontAwesome name={isPlaying ? 'pause' : 'play'} size={18} color="white" />
                            <Text style={styles.actionButtonText}>
                                {isPlaying ? 'Pause' : 'Play'}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                styles.actionButton,
                                {
                                    backgroundColor: isCompleted ? theme.primary : theme.card,
                                    borderWidth: isCompleted ? 0 : 1,
                                    borderColor: theme.primary,
                                },
                            ]}
                            onPress={handleMarkComplete}
                        >
                            <FontAwesome
                                name={isCompleted ? 'check-circle' : 'circle-o'}
                                size={18}
                                color={isCompleted ? 'white' : theme.primary}
                            />
                            <Text
                                style={[
                                    styles.actionButtonText,
                                    { color: isCompleted ? 'white' : theme.primary },
                                ]}
                            >
                                {isCompleted ? 'Completed' : 'Mark Complete'}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Status Badges */}
                    {lecture.isPreviewFree && (
                        <View style={[styles.badge, { backgroundColor: 'rgba(76, 175, 80, 0.1)' }]}>
                            <FontAwesome name="eye" size={16} color="#4CAF50" />
                            <Text style={[styles.badgeText, { color: '#4CAF50' }]}>
                                Preview Available
                            </Text>
                        </View>
                    )}

                    {isCompleted && (
                        <View style={[styles.completedBanner, { backgroundColor: 'rgba(76, 175, 80, 0.1)' }]}>
                            <FontAwesome name="check" size={20} color="#4CAF50" />
                            <Text style={[styles.completedText, { color: '#4CAF50' }]}>
                                You've completed this lecture
                            </Text>
                        </View>
                    )}

                    {lecture.videoUrl && (
                        <View style={[styles.infoCard, { backgroundColor: theme.card }]}>
                            <FontAwesome name="video-camera" size={16} color={theme.primary} />
                            <View style={styles.infoContent}>
                                <Text style={[styles.infoLabel, { color: theme.icon }]}>Video Info</Text>
                                <Text style={[styles.infoValue, { color: theme.text }]}>
                                    Ready for streaming
                                </Text>
                            </View>
                        </View>
                    )}

                    {lecture.publicId && (
                        <View style={[styles.infoCard, { backgroundColor: theme.card }]}>
                            <FontAwesome name="cloud" size={16} color={theme.primary} />
                            <View style={styles.infoContent}>
                                <Text style={[styles.infoLabel, { color: theme.icon }]}>Media ID</Text>
                                <Text style={[styles.infoValue, { color: theme.text }]} numberOfLines={1}>
                                    {lecture.publicId}
                                </Text>
                            </View>
                        </View>
                    )}
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
        paddingVertical: 12,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        flex: 1,
        textAlign: 'center',
    },
    videoContainer: {
        marginHorizontal: 16,
        marginVertical: 16,
        borderRadius: 12,
        overflow: 'hidden',
    },
    video: {
        width: '100%',
        height: videoHeight,
    },
    controlsContainer: {
        padding: 16,
        borderRadius: 12,
        marginTop: 8,
    },
    progressBarContainer: {
        marginBottom: 16,
    },
    progressBar: {
        height: 4,
        borderRadius: 2,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        borderRadius: 2,
    },
    playerControls: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    controlButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    timeDisplay: {
        flex: 1,
        alignItems: 'center',
    },
    timeText: {
        fontSize: 14,
        fontWeight: '600',
    },
    timeInfo: {
        alignItems: 'center',
    },
    timeLabel: {
        fontSize: 12,
    },
    videoPlaceholder: {
        marginHorizontal: 16,
        marginVertical: 16,
        borderRadius: 12,
        height: 240,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    videoText: {
        fontSize: 14,
        fontWeight: '600',
        marginTop: 12,
        textAlign: 'center',
    },
    previewText: {
        fontSize: 12,
        marginTop: 8,
        textAlign: 'center',
    },
    content: {
        padding: 16,
    },
    lectureTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    actionsContainer: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 16,
    },
    actionButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 8,
        gap: 8,
    },
    actionButtonText: {
        fontWeight: '600',
        fontSize: 14,
        color: 'white',
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        marginBottom: 12,
        gap: 8,
        alignSelf: 'flex-start',
    },
    badgeText: {
        fontWeight: '600',
        fontSize: 13,
    },
    infoCard: {
        flexDirection: 'row',
        padding: 12,
        borderRadius: 8,
        marginBottom: 12,
        alignItems: 'center',
        gap: 12,
    },
    infoContent: {
        flex: 1,
    },
    infoLabel: {
        fontSize: 12,
        fontWeight: '600',
        marginBottom: 4,
    },
    infoValue: {
        fontSize: 13,
    },
    completedBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 8,
        marginTop: 12,
        gap: 12,
    },
    completedText: {
        fontWeight: '600',
        fontSize: 14,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    errorText: {
        fontSize: 16,
        marginVertical: 16,
        textAlign: 'center',
    },
    button: {
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
        marginTop: 16,
    },
    buttonText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 14,
    },
});
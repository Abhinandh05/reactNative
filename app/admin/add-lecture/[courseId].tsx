import * as DocumentPicker from 'expo-document-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { Button } from '../../../components/Button';
import { Input } from '../../../components/Input';
import { useColorScheme } from '../../../components/useColorScheme';
import { Colors } from '../../../constants/Colors';
import api from '../../../utils/api';

export default function AddLectureScreen() {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];
    const router = useRouter();
    const { courseId } = useLocalSearchParams();

    const [formData, setFormData] = useState({
        lectureTitle: '',
        description: '',
        videoFile: null as any,
    });
    const [loading, setLoading] = useState(false);
    const [selectedFileName, setSelectedFileName] = useState('');

    const pickVideoFile = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: 'video/*',
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                const file = result.assets[0];
                setFormData({ ...formData, videoFile: file });
                setSelectedFileName(file.name);
                Toast.show({
                    type: 'success',
                    text1: 'Video selected',
                    text2: file.name,
                });
            }
        } catch (error) {
            console.error('Error picking video:', error);
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Failed to select video',
            });
        }
    };

    const handleAddLecture = async () => {
        if (!formData.lectureTitle.trim() || !formData.videoFile) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Title and video file are required',
            });
            return;
        }

        setLoading(true);
        try {
            const formDataToSend = new FormData();
            formDataToSend.append('lectureTitle', formData.lectureTitle.trim());
            formDataToSend.append('isPreviewFree', 'true');
            // courseIds should be an array - the backend expects this
            formDataToSend.append('courseIds', JSON.stringify([courseId]));
            formDataToSend.append('videoFile', {
                uri: formData.videoFile.uri,
                name: formData.videoFile.name,
                type: formData.videoFile.mimeType || 'video/mp4',
            } as any);

            const res = await api.post(
                `/api/v1/lecture/lecture`,
                formDataToSend,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            if (res.data?.success) {
                Toast.show({
                    type: 'success',
                    text1: 'Success',
                    text2: 'Lecture added successfully',
                });
                router.back();
            } else {
                throw new Error(res.data?.message || 'Failed to add lecture');
            }
        } catch (error: any) {
            console.error('Add lecture error:', error);
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: error.response?.data?.message || 'Failed to add lecture',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.content}
            >
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Text style={{ color: theme.primary, fontSize: 16, fontWeight: '600', marginBottom: 16 }}>
                            ← Back
                        </Text>
                    </TouchableOpacity>

                    <Text style={[styles.title, { color: theme.text }]}>Add Lecture</Text>

                    <View style={styles.form}>
                        <Input
                            placeholder="Lecture Title"
                            value={formData.lectureTitle}
                            onChangeText={(text) => setFormData({ ...formData, lectureTitle: text })}
                            glass
                            style={styles.input}
                        />

                        <Input
                            placeholder="Description (optional)"
                            value={formData.description}
                            onChangeText={(text) => setFormData({ ...formData, description: text })}
                            glass
                            multiline
                            numberOfLines={4}
                            style={styles.input}
                        />

                        <TouchableOpacity
                            style={[styles.videoPicker, { borderColor: theme.primary }]}
                            onPress={pickVideoFile}
                        >
                            <Text style={{ color: theme.primary, fontWeight: '600', textAlign: 'center' }}>
                                {selectedFileName ? `Selected: ${selectedFileName}` : '📹 Select Video File'}
                            </Text>
                        </TouchableOpacity>

                        <Button
                            title={loading ? 'Uploading...' : 'Add Lecture'}
                            onPress={handleAddLecture}
                            variant="primary"
                            disabled={loading}
                            style={{ marginTop: 16 }}
                        />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
    },
    scrollContent: {
        padding: 24,
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
        marginBottom: 24,
    },
    form: {
        width: '100%',
    },
    input: {
        marginBottom: 16,
    },
    videoPicker: {
        borderWidth: 2,
        borderStyle: 'dashed',
        borderRadius: 12,
        paddingVertical: 24,
        marginBottom: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

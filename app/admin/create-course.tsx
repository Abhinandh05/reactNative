import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { useColorScheme } from '../../components/useColorScheme';
import { Colors } from '../../constants/Colors';
import api from '../../utils/api';

export default function CreateCourseScreen() {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];
    const router = useRouter();

    const [formData, setFormData] = useState({
        course_title: '',
        category: '',
        course_type: 'free', // free or paid
        course_price: '0',
    });
    const [loading, setLoading] = useState(false);

    const handleCreateCourse = async () => {
        if (!formData.course_title.trim() || !formData.category.trim()) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Title and category are required',
            });
            return;
        }

        if (formData.course_type === 'paid' && (!formData.course_price || parseFloat(formData.course_price) <= 0)) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Price is required for paid courses',
            });
            return;
        }

        setLoading(true);
        try {
            const res = await api.post('/api/v1/course/create', {
                course_title: formData.course_title.trim(),
                category: formData.category.trim(),
                course_type: formData.course_type,
                course_price: formData.course_type === 'paid' ? parseFloat(formData.course_price) : 0,
            });

            if (res.data?.success) {
                Toast.show({
                    type: 'success',
                    text1: 'Success',
                    text2: 'Course created successfully',
                });
                router.back();
            } else {
                throw new Error(res.data?.message || 'Failed to create course');
            }
        } catch (error: any) {
            console.error('Create course error:', error);
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: error.response?.data?.message || 'Failed to create course',
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
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Text style={{ color: theme.primary, fontSize: 16, fontWeight: '600' }}>← Back</Text>
                    </TouchableOpacity>

                    <Text style={[styles.title, { color: theme.text }]}>Create Course</Text>

                    <View style={styles.form}>
                        <Input
                            placeholder="Course Title"
                            value={formData.course_title}
                            onChangeText={(text) => setFormData({ ...formData, course_title: text })}
                            glass
                            style={styles.input}
                        />

                        <Input
                            placeholder="Category (e.g., Programming, Design)"
                            value={formData.category}
                            onChangeText={(text) => setFormData({ ...formData, category: text })}
                            glass
                            style={styles.input}
                        />

                        <View style={styles.typeSelector}>
                            <TouchableOpacity
                                style={[
                                    styles.typeButton,
                                    {
                                        backgroundColor: formData.course_type === 'free' ? theme.primary : theme.card,
                                        borderColor: theme.border,
                                    },
                                ]}
                                onPress={() => setFormData({ ...formData, course_type: 'free', course_price: '0' })}
                            >
                                <Text
                                    style={{
                                        color: formData.course_type === 'free' ? 'white' : theme.text,
                                        fontWeight: '600',
                                    }}
                                >
                                    Free
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[
                                    styles.typeButton,
                                    {
                                        backgroundColor: formData.course_type === 'paid' ? theme.primary : theme.card,
                                        borderColor: theme.border,
                                    },
                                ]}
                                onPress={() => setFormData({ ...formData, course_type: 'paid' })}
                            >
                                <Text
                                    style={{
                                        color: formData.course_type === 'paid' ? 'white' : theme.text,
                                        fontWeight: '600',
                                    }}
                                >
                                    Paid
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {formData.course_type === 'paid' && (
                            <Input
                                placeholder="Price"
                                value={formData.course_price}
                                onChangeText={(text) => setFormData({ ...formData, course_price: text })}
                                keyboardType="decimal-pad"
                                glass
                                style={styles.input}
                            />
                        )}

                        <Button
                            title={loading ? 'Creating...' : 'Create Course'}
                            onPress={handleCreateCourse}
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
    backButton: {
        marginBottom: 16,
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
    typeSelector: {
        flexDirection: 'row',
        marginBottom: 16,
    },
    typeButton: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginHorizontal: 6,
        borderWidth: 1,
    },
});

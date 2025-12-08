import FontAwesome from '@expo/vector-icons/FontAwesome';
import { BlurView } from 'expo-blur';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Button } from '../../components/Button';
import { useColorScheme } from '../../components/useColorScheme';
import { Colors } from '../../constants/Colors';

const { width } = Dimensions.get('window');

export default function CourseDetailsScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];
    const [activeTab, setActiveTab] = useState('Overview');

    // Mock Data (In real app, fetch by ID)
    const course = {
        title: 'React Native Masterclass',
        description: 'Learn to build native apps for Android and iOS using React and JavaScript. This course covers everything from the basics to advanced topics like animations, navigation, and state management.',
        author: 'John Doe',
        rating: 4.8,
        students: 1250,
        modules: [
            { title: 'Introduction', duration: '15 min' },
            { title: 'Setup & Installation', duration: '30 min' },
            { title: 'Components & Styling', duration: '1 hr' },
            { title: 'Navigation', duration: '45 min' },
            { title: 'State Management', duration: '1.5 hr' },
        ]
    };

    const Tab = ({ title }: { title: string }) => (
        <TouchableOpacity
            onPress={() => setActiveTab(title)}
            style={[
                styles.tab,
                activeTab === title && { borderBottomColor: theme.primary, borderBottomWidth: 2 }
            ]}
        >
            <Text style={[
                styles.tabText,
                { color: activeTab === title ? theme.primary : theme.icon }
            ]}>
                {title}
            </Text>
        </TouchableOpacity>
    );

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <Stack.Screen options={{
                headerShown: true,
                headerTransparent: true,
                headerTitle: '',
                headerLeft: () => (
                    <TouchableOpacity
                        onPress={() => router.back()}
                        style={styles.backButton}
                    >
                        <BlurView intensity={80} tint={colorScheme === 'dark' ? 'dark' : 'light'} style={styles.backButtonBlur}>
                            <FontAwesome name="arrow-left" size={20} color={theme.text} />
                        </BlurView>
                    </TouchableOpacity>
                )
            }} />

            <ScrollView>
                <Image
                    source={{ uri: 'https://via.placeholder.com/800x600/0066FF/FFFFFF?text=React+Native' }}
                    style={styles.heroImage}
                />

                <View style={[styles.contentContainer, { backgroundColor: theme.background }]}>
                    <Text style={[styles.title, { color: theme.text }]}>{course.title}</Text>
                    <View style={styles.metaRow}>
                        <Text style={[styles.metaText, { color: theme.icon }]}>⭐ {course.rating} • {course.students} Students</Text>
                    </View>

                    <Text style={[styles.author, { color: theme.text }]}>By <Text style={{ fontWeight: 'bold' }}>{course.author}</Text></Text>

                    <View style={[styles.tabs, { borderColor: theme.border }]}>
                        <Tab title="Overview" />
                        <Tab title="Curriculum" />
                        <Tab title="Reviews" />
                    </View>

                    <View style={styles.tabContent}>
                        {activeTab === 'Overview' && (
                            <Text style={[styles.description, { color: theme.text }]}>{course.description}</Text>
                        )}

                        {activeTab === 'Curriculum' && (
                            <View>
                                {course.modules.map((module, index) => (
                                    <View key={index} style={[styles.moduleRow, { borderBottomColor: theme.border }]}>
                                        <View style={styles.moduleLeft}>
                                            <Text style={[styles.moduleIndex, { color: theme.icon }]}>{index + 1}</Text>
                                            <Text style={[styles.moduleTitle, { color: theme.text }]}>{module.title}</Text>
                                        </View>
                                        <Text style={[styles.moduleDuration, { color: theme.icon }]}>{module.duration}</Text>
                                    </View>
                                ))}
                            </View>
                        )}

                        {activeTab === 'Reviews' && (
                            <Text style={{ color: theme.icon, textAlign: 'center', marginTop: 20 }}>No reviews yet.</Text>
                        )}
                    </View>
                </View>
            </ScrollView>

            <View style={[styles.footer, { backgroundColor: theme.card, borderColor: theme.border }]}>
                <View>
                    <Text style={[styles.priceLabel, { color: theme.icon }]}>Total Price</Text>
                    <Text style={[styles.price, { color: theme.text }]}>$49.99</Text>
                </View>
                <Button title="Enroll Now" onPress={() => { }} style={{ width: 160 }} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    heroImage: {
        width: '100%',
        height: 300,
    },
    backButton: {
        marginLeft: 16,
        marginTop: 8,
        borderRadius: 20,
        overflow: 'hidden',
    },
    backButtonBlur: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    contentContainer: {
        marginTop: -40,
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        padding: 24,
        minHeight: 500,
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
        marginBottom: 8,
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    metaText: {
        fontSize: 14,
    },
    author: {
        fontSize: 16,
        marginBottom: 24,
    },
    tabs: {
        flexDirection: 'row',
        marginBottom: 24,
        borderBottomWidth: 1,
    },
    tab: {
        marginRight: 24,
        paddingBottom: 12,
    },
    tabText: {
        fontSize: 16,
        fontWeight: '600',
    },
    tabContent: {
        minHeight: 200,
    },
    description: {
        fontSize: 16,
        lineHeight: 24,
        opacity: 0.8,
    },
    moduleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    moduleLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    moduleIndex: {
        width: 24,
        marginRight: 12,
        fontWeight: 'bold',
    },
    moduleTitle: {
        fontSize: 16,
        fontWeight: '500',
    },
    moduleDuration: {
        fontSize: 14,
    },
    footer: {
        padding: 24,
        paddingBottom: 32,
        borderTopWidth: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    priceLabel: {
        fontSize: 12,
    },
    price: {
        fontSize: 24,
        fontWeight: 'bold',
    },
});

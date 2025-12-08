import { Stack } from 'expo-router';

export default function AdminLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="create-course" options={{ headerShown: false }} />
      <Stack.Screen name="manage-courses" options={{ headerShown: false }} />
      <Stack.Screen name="add-lecture/[courseId]" options={{ headerShown: false }} />
    </Stack>
  );
}

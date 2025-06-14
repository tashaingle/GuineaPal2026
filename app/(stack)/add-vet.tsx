import { Stack } from 'expo-router/stack';

export default function AddVetRoute() {
  return (
    <Stack.Screen
      options={{
        headerShown: false,
        animation: 'slide_from_right',
        presentation: 'card',
      }}
    />
  );
}

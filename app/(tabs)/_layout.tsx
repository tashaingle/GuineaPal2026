import { MaterialIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router/tabs';

type TabBarIconProps = {
  color: string;
  size: number;
};

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8E8E93',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
        },
        headerStyle: {
          backgroundColor: '#FFFFFF',
        },
        headerTintColor: '#000000',
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          headerTitle: 'Home',
          tabBarIcon: ({ color, size }: TabBarIconProps) => (
            <MaterialIcons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="health"
        options={{
          headerTitle: 'Health',
          tabBarIcon: ({ color, size }: TabBarIconProps) => (
            <MaterialIcons name="favorite" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="care"
        options={{
          headerTitle: 'Care',
          tabBarIcon: ({ color, size }: TabBarIconProps) => (
            <MaterialIcons name="spa" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="diet"
        options={{
          headerTitle: 'Diet',
          tabBarIcon: ({ color, size }: TabBarIconProps) => (
            <MaterialIcons name="restaurant" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
} 
import { RootStackParamList } from '@/navigation/types';
import MoodTrackerScreen from '@/screens/health/MoodTrackerScreen';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';

export default function MoodTrackerRoute(): JSX.Element {
  const params = useLocalSearchParams();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'mood-tracker'>>();
  
  return (
    <MoodTrackerScreen 
      route={{ 
        key: 'mood-tracker',
        name: 'mood-tracker',
        params: { petId: params.petId as string }
      }}
      navigation={navigation}
    />
  );
} 
import { showInterstitialAd } from '@/utils/ads';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { addHealthCheck } from '../services/healthCheckService';
import { RootStackParamList } from '../types/navigation';

type HealthCheckScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'health-check'>;

export default function HealthCheckScreen() {
  const navigation = useNavigation<HealthCheckScreenNavigationProp>();
  const [isLoading, setIsLoading] = useState(false);
  const [weight, setWeight] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const healthCheckData = {
        weight: weight ? parseFloat(weight) : undefined,
        notes,
        symptoms: selectedSymptoms,
      };

      await addHealthCheck(healthCheckData);
      await showInterstitialAd(); // Show ad after saving health check
      navigation.goBack();
    } catch (error) {
      console.error('Failed to save health check:', error);
      Alert.alert('Error', 'Failed to save health check');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      const healthCheckData = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        weight: weight ? parseFloat(weight) : undefined,
        notes,
        symptoms: selectedSymptoms,
        createdAt: new Date().toISOString(),
      };

      await addHealthCheck(healthCheckData);
      await showInterstitialAd(); // Show ad after saving health check
      navigation.goBack();
    } catch (error) {
      console.error('Failed to save health check:', error);
      Alert.alert('Error', 'Failed to save health check');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Add your form components here */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
}); 
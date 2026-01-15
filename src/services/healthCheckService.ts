import AsyncStorage from '@react-native-async-storage/async-storage';

interface HealthCheckData {
  weight?: number;
  notes: string;
  symptoms: string[];
}

export const addHealthCheck = async (_data: HealthCheckData): Promise<void> => {
  try {
    // TODO: Implement the actual API call to save the health check data
    // For now, we'll just simulate a successful save
    await new Promise(resolve => setTimeout(resolve, 1000));
  } catch {
    throw new Error('Failed to save health check data');
  }
};

export const checkHealth = async (): Promise<boolean> => {
  try {
    await AsyncStorage.getItem('health_check');
    return true;
  } catch {
    return false;
  }
};

export const performHealthCheck = async (): Promise<void> => {
  try {
    await AsyncStorage.setItem('health_check', 'ok');
  } catch {
    console.error('Failed to perform health check');
  }
}; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';

export async function exportAsyncStorageToFile() {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const entries = await AsyncStorage.multiGet(keys);
    const data = Object.fromEntries(entries);
    const json = JSON.stringify(data, null, 2);
    const fileUri = FileSystem.documentDirectory + 'asyncstorage-export.json';
    await FileSystem.writeAsStringAsync(fileUri, json);
    console.log('AsyncStorage exported to:', fileUri);
    return fileUri;
  } catch (error) {
    console.error('Failed to export AsyncStorage:', error);
    throw error;
  }
}

// Usage (in your app):
// import { exportAsyncStorageToFile } from '../scripts/export-asyncstorage';
// exportAsyncStorageToFile(); 
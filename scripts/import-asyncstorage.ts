import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';

export async function importAsyncStorageFromFile(fileUri: string) {
  try {
    const json = await FileSystem.readAsStringAsync(fileUri);
    const data = JSON.parse(json);
    const entries = Object.entries(data);
    for (const [key, value] of entries) {
      await AsyncStorage.setItem(key, value as string);
    }
    console.log(`Imported ${entries.length} keys into AsyncStorage from ${fileUri}`);
    return entries.length;
  } catch (error) {
    console.error('Failed to import AsyncStorage:', error);
    throw error;
  }
}

// Usage (in your app):
// import { importAsyncStorageFromFile } from '../scripts/import-asyncstorage';
// importAsyncStorageFromFile('<file-uri>'); 
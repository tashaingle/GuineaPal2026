declare module 'expo-splash-screen' {
  export function preventAutoHideAsync(): Promise<void>;
  export function hideAsync(): Promise<void>;
  export function hideAsync(options?: { fade?: boolean }): Promise<void>;
  export function onDidHideAsync(): Promise<void>;
  export function onDidHideAsync(callback: () => void): void;
  export function onDidHideAsync(callback: () => void, errorCallback: (error: Error) => void): void;
  export function onDidHideAsync(callback: () => void, errorCallback: (error: Error) => void, successCallback: () => void): void;
  export function onDidHideAsync(callback: () => void, errorCallback: (error: Error) => void, successCallback: () => void, options?: { fade?: boolean }): void;
} 
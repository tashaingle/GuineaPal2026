declare module 'expo-image-picker' {
  export enum MediaTypeOptions {
    Images = 'Images',
    Videos = 'Videos',
    All = 'All',
  }

  export interface ImagePickerResult {
    canceled: boolean;
    assets?: Array<{
      uri: string;
      width: number;
      height: number;
      type?: string;
      fileName?: string;
      fileSize?: number;
    }>;
  }

  export interface ImagePickerOptions {
    mediaTypes?: MediaTypeOptions;
    allowsEditing?: boolean;
    aspect?: [number, number];
    quality?: number;
    allowsMultipleSelection?: boolean;
    presentationStyle?: 'fullScreen' | 'pageSheet' | 'formSheet' | 'overFullScreen';
  }

  export function launchImageLibraryAsync(options?: ImagePickerOptions): Promise<ImagePickerResult>;
  export function launchCameraAsync(options?: ImagePickerOptions): Promise<ImagePickerResult>;
  export function requestMediaLibraryPermissionsAsync(): Promise<{ status: 'granted' | 'denied' }>;
  export function requestCameraPermissionsAsync(): Promise<{ status: 'granted' | 'denied' }>;
} 
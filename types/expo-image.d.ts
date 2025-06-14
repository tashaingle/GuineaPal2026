declare module 'expo-image' {
  import { ComponentType } from 'react';
    import { ImageStyle, ImageProps as RNImageProps } from 'react-native';

  export interface ImageProps extends Omit<RNImageProps, 'source'> {
    source: string | { uri: string };
    style?: ImageStyle;
    contentFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
    transition?: number;
    cachePolicy?: 'none' | 'disk' | 'memory' | 'memory-disk';
    placeholder?: any;
  }

  export const Image: ComponentType<ImageProps>;
} 
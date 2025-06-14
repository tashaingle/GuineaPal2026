declare module 'expo-blur' {
  import { ComponentType } from 'react';
    import { StyleProp, ViewStyle } from 'react-native';

  export interface BlurViewProps {
    tint: 'light' | 'dark' | 'default' | 'systemChromeMaterial';
    intensity?: number;
    style?: StyleProp<ViewStyle>;
    children?: React.ReactNode;
  }

  export const BlurView: ComponentType<BlurViewProps>;
} 
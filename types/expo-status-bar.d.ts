declare module 'expo-status-bar' {
  import { ComponentType } from 'react';
    import { ViewProps } from 'react-native';

  export interface StatusBarProps extends ViewProps {
    style?: 'auto' | 'inverted' | 'light' | 'dark';
    hidden?: boolean;
    backgroundColor?: string;
    translucent?: boolean;
  }

  export const StatusBar: ComponentType<StatusBarProps>;
} 
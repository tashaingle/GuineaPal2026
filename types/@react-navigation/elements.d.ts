declare module '@react-navigation/elements' {
  import { ComponentType } from 'react';
    import { GestureResponderEvent, StyleProp, ViewStyle } from 'react-native';

  export interface PlatformPressableProps {
    onPress?: () => void;
    onPressIn?: (event: GestureResponderEvent) => void;
    onPressOut?: () => void;
    style?: StyleProp<ViewStyle>;
    children?: React.ReactNode;
    [key: string]: any;
  }

  export const PlatformPressable: ComponentType<PlatformPressableProps>;
} 
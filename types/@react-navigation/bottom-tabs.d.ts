declare module '@react-navigation/bottom-tabs' {
  import { ViewProps } from 'react-native';

  export interface BottomTabBarButtonProps extends ViewProps {
    onPress?: () => void;
    onPressIn?: () => void;
    onPressOut?: () => void;
    accessibilityRole?: string;
    accessibilityState?: {
      disabled?: boolean;
      selected?: boolean;
    };
  }

  export function useBottomTabBarHeight(): number;
} 
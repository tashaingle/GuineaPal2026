declare module '@react-navigation/native' {
  import { NavigationProp } from '@react-navigation/native-stack';
    import { ComponentType } from 'react';

  export type RouteProp<T extends { [key: string]: any }, K extends keyof T> = {
    key: string;
    name: K;
    params: T[K];
  };

  export interface NavigationProp<T> {
    navigate: (screen: keyof T, params?: any) => void;
    goBack: () => void;
    addListener: (event: string, callback: () => void) => () => void;
  }

  export function useNavigation<T = any>(): NavigationProp<T>;
  export function useRoute<T = any>(): RouteProp<T, keyof T>;
  export function useIsFocused(): boolean;

  export interface NavigationState {
    routes: Array<{
      key: string;
      name: string;
      params?: any;
    }>;
    index: number;
  }

  export interface NavigationContainerProps {
    children?: React.ReactNode;
    onStateChange?: (state: NavigationState) => void;
  }

  export const NavigationContainer: ComponentType<NavigationContainerProps>;
} 
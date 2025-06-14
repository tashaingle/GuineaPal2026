declare module '@react-navigation/native' {
  import { NavigationProp, RouteProp } from '@react-navigation/native';
    import { ComponentType } from 'react';

  export interface NavigationState {
    index: number;
    routes: Route[];
  }

  export interface Route {
    key: string;
    name: string;
    params?: object;
  }

  export interface NavigationContainerProps {
    children: React.ReactNode;
    onStateChange?: (state: NavigationState | undefined) => void;
  }

  export const NavigationContainer: ComponentType<NavigationContainerProps>;

  export function useNavigation<T = NavigationProp<any>>(): T;
  export function useRoute<T = RouteProp<any>>(): T;
  export function useFocusEffect(effect: () => void | (() => void)): void;
  export function useIsFocused(): boolean;
} 
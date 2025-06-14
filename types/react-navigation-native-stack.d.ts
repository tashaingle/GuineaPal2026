declare module '@react-navigation/native-stack' {
  import { NavigationProp, RouteProp } from '@react-navigation/native';
    import { ComponentType } from 'react';

  export interface NativeStackNavigationOptions {
    headerShown?: boolean;
    headerTitle?: string;
    headerTitleAlign?: 'left' | 'center';
    headerStyle?: {
      backgroundColor?: string;
    };
    headerTintColor?: string;
    headerBackTitle?: string;
    headerBackVisible?: boolean;
    contentStyle?: {
      backgroundColor?: string;
    };
    animation?: 'default' | 'fade' | 'none' | 'slide_from_right' | 'slide_from_left' | 'slide_from_bottom';
    animationTypeForReplace?: 'push' | 'pop';
    gestureEnabled?: boolean;
    gestureDirection?: 'horizontal' | 'vertical';
    animationDuration?: number;
    presentation?: 'card' | 'modal' | 'transparentModal';
    freezeOnBlur?: boolean;
  }

  export interface NativeStackScreenProps<
    ParamList extends Record<string, object | undefined>,
    RouteName extends keyof ParamList = string
  > {
    navigation: NativeStackNavigationProp<ParamList, RouteName>;
    route: RouteProp<ParamList, RouteName>;
  }

  export interface NativeStackNavigationProp<
    ParamList extends Record<string, object | undefined>,
    RouteName extends keyof ParamList = string
  > extends NavigationProp<ParamList, RouteName> {
    navigate<RouteName extends keyof ParamList>(
      name: RouteName,
      params?: ParamList[RouteName]
    ): void;
    push<RouteName extends keyof ParamList>(
      name: RouteName,
      params?: ParamList[RouteName]
    ): void;
    replace<RouteName extends keyof ParamList>(
      name: RouteName,
      params?: ParamList[RouteName]
    ): void;
    pop(count?: number): void;
    popToTop(): void;
    goBack(): void;
    addListener(event: string, callback: () => void): () => void;
  }

  export function createNativeStackNavigator<
    ParamList extends Record<string, object | undefined>
  >(): {
    Navigator: ComponentType<{
      children?: React.ReactNode;
      screenOptions?: NativeStackNavigationOptions;
      initialRouteName?: keyof ParamList;
    }>;
    Screen: ComponentType<{
      name: keyof ParamList;
      component: ComponentType<any>;
      options?: NativeStackNavigationOptions;
    }>;
  };
} 
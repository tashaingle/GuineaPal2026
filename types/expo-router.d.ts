declare module 'expo-router' {
  import { ComponentType } from 'react';
    import { ViewProps } from 'react-native';

  export type Href = string;

  export interface LinkProps extends ViewProps {
    href: Href;
    children?: React.ReactNode;
  }

  export const Link: ComponentType<LinkProps>;
  export const Slot: ComponentType<ViewProps>;

  export function useRouter(): {
    push: (href: Href | { pathname: string; params?: Record<string, any> }) => void;
    replace: (href: Href | { pathname: string; params?: Record<string, any> }) => void;
    back: () => void;
    setParams: (params: Record<string, any>) => void;
  };

  export function useLocalSearchParams(): Record<string, any>;
} 
import type { ReactElement } from 'react';

declare module 'expo-router' {
  import type { LinkProps as OriginalLinkProps } from '@react-navigation/native';

  export type LinkProps<T extends string> = Omit<
    OriginalLinkProps<T>,
    'to'
  > & {
    href: T;
  };

  export function Link<T extends string>(props: LinkProps<T>): ReactElement;
  export function useRouter(): {
    push: (href: string) => void;
    replace: (href: string) => void;
    back: () => void;
  };
  export function useLocalSearchParams<T extends Record<string, string>>(): T;
  export function Stack(): ReactElement;
  export function Slot(): ReactElement;
} 
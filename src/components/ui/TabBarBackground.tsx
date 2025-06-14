import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { BlurView } from 'expo-blur';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function useBottomTabOverflow() {
  const insets = useSafeAreaInsets();
  return insets.bottom;
}

type TabBarBackgroundProps = {
  children: React.ReactNode;
};

export function TabBarBackground({ children }: TabBarBackgroundProps) {
  const colorScheme = useColorScheme();
  const bottomInset = useBottomTabOverflow();

  return (
    <BlurView
      tint={colorScheme}
      intensity={80}
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 49 + bottomInset,
        backgroundColor: Colors[colorScheme].background,
      }}
    >
      {children}
    </BlurView>
  );
} 
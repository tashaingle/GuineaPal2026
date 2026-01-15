import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import React from 'react';
import { StyleSheet } from 'react-native';

interface TabBarBackgroundProps {
  // Add any required props here
}

export default function BlurTabBarBackground(): React.JSX.Element {
  return (
    <BlurView
      // System chrome material automatically adapts to the system's theme
      // and matches the native tab bar appearance on iOS.
      tint="systemChromeMaterial"
      intensity={100}
      style={StyleSheet.absoluteFill}
    />
  );
}

export function useBottomTabOverflow(): number {
  return useBottomTabBarHeight();
}

export function TabBarBackground(_props: TabBarBackgroundProps): React.JSX.Element {
  return <BlurView tint="systemChromeMaterial" intensity={100} style={StyleSheet.absoluteFill} />;
}

export function TabBarBackgroundComponent(_props: TabBarBackgroundProps): React.JSX.Element {
  return <BlurView tint="systemChromeMaterial" intensity={100} style={StyleSheet.absoluteFill} />;
}

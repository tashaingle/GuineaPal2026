import { getColor } from '@/theme/colors';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function useBottomTabOverflow(): number {
  const insets = useSafeAreaInsets();
  return insets.bottom;
}

const TabBarBackground = (): JSX.Element => {
  return (
    <View style={styles.container}>
      <View style={styles.border} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: getColor.background(),
  },
  border: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 0.5,
    backgroundColor: getColor.border(),
  },
});

export default TabBarBackground; 
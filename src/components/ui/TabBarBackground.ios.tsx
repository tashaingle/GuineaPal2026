
import { BlurView } from 'expo-blur';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { getColor } from '../../theme/colors';

const TabBarBackground = (): React.ReactElement => {
  return (
    <BlurView intensity={80} tint="light" style={styles.container}>
      <View style={styles.border} />
    </BlurView>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
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
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

type ActionButtonProps = {
  onPress: () => void;
  title: string;
  style?: any;
};

export function ActionButton({ onPress, title, style }: ActionButtonProps) {
  const colorScheme = useColorScheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.container, style]}
    >
      <ThemedView
        style={[
          styles.button,
          { backgroundColor: Colors[colorScheme].tint },
        ]}
      >
        <ThemedText style={styles.text}>{title}</ThemedText>
      </ThemedView>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  button: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
});

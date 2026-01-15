import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

import React from 'react';
import { StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { getColor } from '../theme/colors';

type PetCardProps = {
  name: string;
  species: string;
  onPress: () => void;
  style?: ViewStyle;
};

export function PetCard({ name, species, onPress, style }: PetCardProps): React.ReactElement {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.container, style]}
    >
      <ThemedView
        style={[
          styles.card,
          { backgroundColor: getColor.background() },
        ]}
      >
        <ThemedText style={styles.name}>{name}</ThemedText>
        <ThemedText style={styles.species}>{species}</ThemedText>
      </ThemedView>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  card: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: getColor.border(),
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  species: {
    fontSize: 14,
    opacity: 0.7,
  },
});

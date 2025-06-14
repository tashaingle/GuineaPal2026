import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

type PetCardProps = {
  name: string;
  species: string;
  onPress: () => void;
  style?: any;
};

export function PetCard({ name, species, onPress, style }: PetCardProps) {
  const colorScheme = useColorScheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.container, style]}
    >
      <ThemedView
        style={[
          styles.card,
          { backgroundColor: Colors[colorScheme].background },
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
    borderColor: '#ccc',
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

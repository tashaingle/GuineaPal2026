import colors from '@/theme/colors';
import { GuineaPig } from '@/types/guineaPig';
import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface PetFeatureMenuProps {
  pet: GuineaPig;
  onFeaturePress: (feature: string) => void;
}

const PetFeatureMenu: React.FC<PetFeatureMenuProps> = ({ pet, onFeaturePress }) => {
  const features = [
    { id: 'weight-tracker', label: 'Weight Tracker', icon: 'monitor-weight' },
    { id: 'medical-records', label: 'Medical Records', icon: 'medical-services' },
    { id: 'mood-tracker', label: 'Mood Tracker', icon: 'sentiment-satisfied' },
    { id: 'diet-manager', label: 'Diet Manager', icon: 'restaurant' },
    { id: 'waste-log', label: 'Waste Log', icon: 'sanitizer' },
    { id: 'family-tree', label: 'Family Tree', icon: 'family-restroom' }
  ];

  return (
    <View style={styles.container}>
      {features.map((feature) => (
        <TouchableOpacity
          key={feature.id}
          style={styles.featureButton}
          onPress={() => onFeaturePress(feature.id)}
        >
          <MaterialIcons name={feature.icon as any} size={24} color={colors.primary.DEFAULT} />
          <Text style={styles.featureText}>{feature.label}</Text>
          <MaterialIcons name="chevron-right" size={24} color={colors.text.light} />
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
  },
  featureButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  featureText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: colors.text.primary,
  },
});

export default PetFeatureMenu; 
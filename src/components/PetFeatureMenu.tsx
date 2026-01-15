
import { GuineaPig } from '@/types/guineaPig';
import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getColor } from '../theme/colors';

interface PetFeatureMenuProps {
  onFeaturePress: (feature: string) => void;
  _pet: GuineaPig;
}

type Feature = {
  id: string;
  label: string;
  icon: keyof typeof MaterialIcons.glyphMap;
};

const PetFeatureMenu: React.FC<PetFeatureMenuProps> = ({ onFeaturePress, _pet }) => {
  const features: Feature[] = [
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
          <MaterialIcons name={feature.icon} size={24} color={getColor.primary()} />
          <Text style={styles.featureText}>{feature.label}</Text>
          <MaterialIcons name="chevron-right" size={24} color={getColor.textLight()} />
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: getColor.background(),
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
  },
  featureButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: getColor.borderLight(),
  },
  featureText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: getColor.text(),
  },
});

export default PetFeatureMenu; 
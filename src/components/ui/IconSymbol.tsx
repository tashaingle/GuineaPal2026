import { getColor } from '@/theme/colors';
import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

interface IconSymbolProps {
  name: keyof typeof MaterialIcons.glyphMap;
  size?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
}

const IconSymbol = ({ name, size = 24, color = getColor.text(), style }: IconSymbolProps): JSX.Element => {
  return (
    <View style={[styles.container, style]}>
      <MaterialIcons name={name} size={size} color={color} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default IconSymbol; 
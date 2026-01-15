
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { getColor } from '../theme/colors';

interface CustomSplashProps {
  error?: string | null;
}

const CustomSplash: React.FC<CustomSplashProps> = ({ error }) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={getColor.primary()} style={styles.loader} />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: getColor.background(),
    justifyContent: 'center',
    alignItems: 'center',
  },
  loader: {
    marginTop: 20,
  },
  errorText: {
    color: getColor.error(),
    marginTop: 10,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});

export default CustomSplash; 
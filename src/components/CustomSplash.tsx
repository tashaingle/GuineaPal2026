import colors from '@/theme/colors';
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

interface CustomSplashProps {
  error?: string | null;
}

const CustomSplash: React.FC<CustomSplashProps> = ({ error }) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.primary.DEFAULT} style={styles.loader} />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.DEFAULT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loader: {
    marginTop: 20,
  },
  errorText: {
    color: '#FF0000',
    marginTop: 10,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});

export default CustomSplash; 
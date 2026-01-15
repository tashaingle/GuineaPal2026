import React from 'react';
import { StyleSheet, View } from 'react-native';

export default function HealthCheckScreen(): JSX.Element {
  // Remove unused navigation variable
  // const navigation = useNavigation<HealthCheckScreenNavigationProp>();

  return (
    <View style={styles.container}>
      {/* Add your form components here */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
}); 
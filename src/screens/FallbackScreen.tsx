import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const FallbackScreen: React.FC = () => (
  <View style={styles.container}>
    <Text>Screen failed to load</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default FallbackScreen;
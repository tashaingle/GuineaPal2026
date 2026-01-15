import { getColor } from '@/theme/colors';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const CareScheduleScreen: React.FC = () => {
  const params = useLocalSearchParams();
  const { petId } = params;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Care Schedule</Text>
        <Text>Pet ID: {petId}</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: getColor.background(),
  },
  content: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: getColor.text(),
    marginBottom: 16,
  },
});

export default CareScheduleScreen; 
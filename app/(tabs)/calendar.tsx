import ErrorBoundary from '@/components/ErrorBoundary';
import { ThemedView } from '@/components/ThemedView';
import { getColor } from '@/theme/colors';
import { StyleSheet, Text } from 'react-native';

export default function CalendarScreen(): React.JSX.Element {
  return (
    <ErrorBoundary>
      <ThemedView style={[styles.container, { backgroundColor: getColor.backgroundLight() }]}>
        <Text style={styles.title}>Calendar</Text>
        <Text style={styles.subtitle}>Coming soon!</Text>
      </ThemedView>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
  },
}); 
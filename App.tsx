import { useFonts } from '@/hooks/useFonts';
import colors from '@/theme/colors';
import { ActivityIndicator, Platform, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.DEFAULT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background.DEFAULT,
  },
  loadingText: {
    fontSize: 18,
    marginBottom: 20,
    color: colors.text.primary,
  },
  welcomeText: {
    fontSize: 24,
    color: colors.text.primary,
    fontFamily: Platform.select({
      ios: 'System',
      android: 'SpaceMono',
      default: 'System',
    }),
  }
});

export default function App() {
  const { fontsLoaded, error } = useFonts();

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
        <ActivityIndicator size="large" color={colors.primary.DEFAULT} />
      </View>
    );
  }

  if (error) {
    console.warn('Font loading error:', error);
  }

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <Text style={styles.welcomeText}>Welcome to GuineaPal!</Text>
      </View>
    </SafeAreaProvider>
  );
}
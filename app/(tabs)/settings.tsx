import { ActionButton } from '@/components/ActionButton';
import ErrorBoundary from '@/components/ErrorBoundary';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';

export default function SettingsScreen() {
  const handlePremiumUpgrade = () => {
    // TODO: Implement premium upgrade
  };

  const handleRestorePurchases = () => {
    // TODO: Implement restore purchases
  };

  return (
    <ErrorBoundary>
      <ScrollView style={styles.container}>
        <ThemedView style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Account</ThemedText>
          <ActionButton
            title="Upgrade to Premium"
            onPress={handlePremiumUpgrade}
            style={styles.button}
          />
          <ActionButton
            title="Restore Purchases"
            onPress={handleRestorePurchases}
            style={styles.button}
          />
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText style={styles.sectionTitle}>About</ThemedText>
          <ThemedText style={styles.version}>Version 1.0.0</ThemedText>
        </ThemedView>
      </ScrollView>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  button: {
    marginBottom: 12,
  },
  version: {
    fontSize: 14,
    color: '#666',
  },
}); 
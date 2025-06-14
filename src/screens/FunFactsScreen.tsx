import AppHeader from '@/components/AppHeader';
import { funFacts } from '@/data/funFacts';
import colors from '@/theme/colors';
import { showInterstitialAd } from '@/utils/ads';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function FunFactsScreen() {
  const insets = useSafeAreaInsets();
  const [currentFact, setCurrentFact] = useState(() => getRandomFact());
  const [fadeAnim] = useState(new Animated.Value(1));
  const [factCount, setFactCount] = useState(0);

  function getRandomFact() {
    const randomIndex = Math.floor(Math.random() * funFacts.length);
    return funFacts[randomIndex];
  }

  const handleNewFact = async () => {
    // Fade out
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      // Update fact
      setCurrentFact(getRandomFact());
      setFactCount(prev => prev + 1);
      
      // Fade in
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    });

    // Show ad every 3 facts
    if (factCount > 0 && factCount % 3 === 0) {
      try {
        await showInterstitialAd();
      } catch (error) {
        console.warn('Failed to show ad:', error);
      }
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <AppHeader title="Fun Facts" />
      
      <View style={styles.content}>
        <Animated.View style={[styles.factCard, { opacity: fadeAnim }]}>
          <Text style={styles.factText}>{currentFact.fact}</Text>
        </Animated.View>

        <TouchableOpacity 
          style={[styles.newFactButton, { marginBottom: insets.bottom + 16 }]} 
          onPress={handleNewFact}
        >
          <Ionicons name="refresh" size={24} color="#fff" />
          <Text style={styles.newFactButtonText}>New Fact</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.DEFAULT,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  factCard: {
    backgroundColor: colors.background.card,
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  factText: {
    fontSize: 18,
    lineHeight: 26,
    color: colors.text.primary,
    textAlign: 'center',
  },
  newFactButton: {
    backgroundColor: colors.primary.DEFAULT,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  newFactButtonText: {
    color: colors.text.light,
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
}); 
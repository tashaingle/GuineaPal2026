import AppHeader from '@/components/AppHeader';
import { funFacts } from '@/data/funFacts';
import { getColor } from '@/theme/colors';
import { showInterstitialAd } from '@/utils/ads';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Animated, StyleSheet, Text, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface Styles {
  container: ViewStyle;
  content: ViewStyle;
  factCard: ViewStyle;
  factText: TextStyle;
  newFactButton: ViewStyle;
  newFactButtonText: TextStyle;
}

const styles = StyleSheet.create<Styles>({
  container: {
    flex: 1,
    backgroundColor: getColor.backgroundLight(),
  },
  content: {
    flex: 1,
    padding: 12,
  },
  factCard: {
    backgroundColor: getColor.white(),
    borderRadius: 12,
    padding: 24,
    marginBottom: 24,
    shadowColor: getColor.shadow(),
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  factText: {
    fontSize: 18,
    lineHeight: 26,
    color: getColor.text(),
    textAlign: 'center',
  },
  newFactButton: {
    backgroundColor: getColor.white(),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    shadowColor: getColor.shadow(),
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  newFactButtonText: {
    color: getColor.text(),
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
});

interface FunFact {
  fact: string;
}

const FunFactsScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const [currentFact, setCurrentFact] = useState<FunFact>(() => getRandomFact());
  const [fadeAnim] = useState(new Animated.Value(1));
  const [factCount, setFactCount] = useState(0);

  function getRandomFact(): FunFact {
    const randomIndex = Math.floor(Math.random() * funFacts.length);
    return funFacts[randomIndex];
  }

  const handleNewFact = async (): Promise<void> => {
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

    // Show ad every 3 facts (check after incrementing)
    const newFactCount = factCount + 1;
    if (newFactCount > 0 && newFactCount % 3 === 0) {
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
          <Ionicons name="refresh" size={24} color={getColor.text()} />
          <Text style={styles.newFactButtonText}>New Fact</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default FunFactsScreen; 
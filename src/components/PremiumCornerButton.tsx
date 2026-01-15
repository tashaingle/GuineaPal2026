import { usePremium } from '@/contexts/PremiumContext';
import { getColor } from '@/theme/colors';
import { MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface PremiumCornerButtonProps {
  onPress?: () => void;
  style?: object;
}

const PremiumCornerButton: React.FC<PremiumCornerButtonProps> = ({ onPress: _onPress, style }) => {
  const { isPremium, purchasePremium, restorePurchases } = usePremium();
  const [isLoading, setIsLoading] = useState(false);

  const handlePress = async (): Promise<void> => {
    if (isPremium) {
      Alert.alert('Premium Active', 'You already have premium access!');
      return;
    }

    Alert.alert(
      'Remove Ads',
      'Purchase premium access for £1.99 to remove all ads from the app?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Purchase',
          onPress: async () => {
            setIsLoading(true);
            try {
              await purchasePremium();
            } catch {
              Alert.alert('Purchase Failed', 'Unable to complete purchase. Please try again.');
            } finally {
              setIsLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleLongPress = async (): Promise<void> => {
    try {
      await restorePurchases();
      Alert.alert('Restore Complete', 'Your purchases have been restored.');
    } catch {
      Alert.alert('Restore Failed', 'Unable to restore purchases. Please try again.');
    }
  };

  // Don't show the button if user is already premium
  if (isPremium) {
    return null;
  }

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={handlePress}
      onLongPress={handleLongPress}
      disabled={isLoading}
    >
      <View style={styles.content}>
        <View style={styles.textContainer}>
          <Text style={styles.text}>£1.99</Text>
          <Text style={styles.subText}>Remove Ads</Text>
        </View>
        {isLoading && (
          <MaterialIcons 
            name="hourglass-empty" 
            size={12} 
            color={getColor.textLight()} 
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    right: 24,
    backgroundColor: getColor.white(),
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    elevation: 4,
    shadowColor: getColor.shadow(),
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: getColor.primary(),
    zIndex: 1000,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  textContainer: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
    color: getColor.primary(),
  },
  subText: {
    fontSize: 10,
    fontWeight: '400',
    color: getColor.textLight(),
  },
});

export default PremiumCornerButton; 
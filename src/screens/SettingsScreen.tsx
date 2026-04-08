import { useAuth } from '@/contexts/AuthContext';
import { usePremium } from '@/contexts/PremiumContext';
import { RootStackParamList } from '@/navigation/types';
import colors from '@/theme/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { Alert, Linking, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = NativeStackScreenProps<RootStackParamList, 'Settings'>;

const SettingsScreen = ({ navigation }: Props) => {
  const { logout } = useAuth();
  const insets = useSafeAreaInsets();
  const { isPremium, purchasePremium, restorePurchases } = usePremium();

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
            } catch (error) {
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          }
        }
      ]
    );
  };

  const handleUpgradeToPremium = async () => {
    try {
      await purchasePremium();
      Alert.alert('Success', 'Thank you for upgrading to Premium!');
    } catch (error) {
      Alert.alert('Error', 'Failed to complete purchase. Please try again.');
    }
  };

  const handleRestorePurchases = async () => {
    try {
      await restorePurchases();
      Alert.alert('Success', 'Purchases restored successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to restore purchases. Please try again.');
    }
  };

  const handleContactSupport = () => {
    Linking.openURL('mailto:natasha.card@outlook.com?subject=GuineaPal Support');
  };

  const handlePrivacyPolicy = () => {
    Linking.openURL('https://tashaingle.github.io/GuineaPal-Support/privacy-policy');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>

      <ScrollView style={styles.content}>
        {!isPremium && (
          <TouchableOpacity
            style={[styles.premiumCard, styles.card]}
            onPress={handleUpgradeToPremium}
          >
            <View style={styles.premiumHeader}>
              <MaterialIcons name="star" size={24} color={colors.buttons.gold} />
              <Text style={styles.premiumTitle}>Upgrade to Premium</Text>
            </View>
            <Text style={styles.premiumPrice}>£1.99</Text>
            <Text style={styles.premiumDescription}>
              Remove ads and support GuineaPal's development
            </Text>
          </TouchableOpacity>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App</Text>
          <TouchableOpacity style={styles.option} onPress={handlePrivacyPolicy}>
            <MaterialIcons name="privacy-tip" size={24} color={colors.text.primary} />
            <Text style={styles.optionText}>Privacy Policy</Text>
            <MaterialIcons name="chevron-right" size={24} color={colors.text.light} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.option} onPress={handleContactSupport}>
            <MaterialIcons name="help-outline" size={24} color={colors.text.primary} />
            <Text style={styles.optionText}>Contact Support</Text>
            <MaterialIcons name="chevron-right" size={24} color={colors.text.light} />
          </TouchableOpacity>

          {Platform.OS === 'ios' && (
            <TouchableOpacity style={styles.option} onPress={handleRestorePurchases}>
              <MaterialIcons name="restore" size={24} color={colors.text.primary} />
              <Text style={styles.optionText}>Restore Purchases</Text>
              <MaterialIcons name="chevron-right" size={24} color={colors.text.light} />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <View style={styles.option}>
            <MaterialIcons name="info-outline" size={24} color={colors.text.primary} />
            <Text style={styles.optionText}>Version</Text>
            <Text style={styles.versionText}>1.0.1</Text>
          </View>
          {isPremium && (
            <View style={styles.option}>
              <MaterialIcons name="star" size={24} color={colors.buttons.gold} />
              <Text style={styles.optionText}>Premium Status</Text>
              <Text style={styles.premiumStatusText}>Active</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.DEFAULT,
  },
  header: {
    padding: 16,
    backgroundColor: colors.background.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  content: {
    flex: 1,
  },
  card: {
    backgroundColor: colors.background.card,
    borderRadius: 12,
    padding: 16,
    margin: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  premiumCard: {
    backgroundColor: colors.background.card,
  },
  premiumHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  premiumTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginLeft: 8,
  },
  premiumPrice: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.buttons.green,
    marginVertical: 8,
  },
  premiumDescription: {
    fontSize: 16,
    color: colors.text.secondary,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.secondary,
    marginBottom: 8,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    color: colors.text.primary,
    marginLeft: 12,
  },
  versionText: {
    fontSize: 16,
    color: colors.text.light,
  },
  premiumStatusText: {
    fontSize: 16,
    color: colors.buttons.gold,
    fontWeight: '600',
  },
});

export default SettingsScreen; 
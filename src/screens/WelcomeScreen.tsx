import BannerAdComponent from '@/components/ads/BannerAdComponent';
import PremiumCornerButton from '@/components/PremiumCornerButton';
import { useAuth } from '@/contexts/AuthContext';
import colors, { getColor } from '@/theme/colors';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, Platform, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const WelcomeScreen = (): JSX.Element => {
  const router = useRouter();
  const { logout } = useAuth();

  const insets = useSafeAreaInsets();

  const handleSignOut = async (): Promise<void> => {
    try {
      await logout();
      router.replace('/(auth)/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor={getColor.background()} />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Image
            source={require('../../assets/images/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <View style={styles.headerContent}>
            <Text style={styles.welcomeText}>Welcome to GuineaPal</Text>
          </View>
        </View>

        {/* Premium Corner Button */}
        <PremiumCornerButton />

        <View style={styles.navigationGrid}>
          <TouchableOpacity 
            style={styles.featuredButton}
            onPress={() => router.push('/(stack)/pet-list')}
          >
            <MaterialCommunityIcons name="paw" size={40} color={colors.brown} />
            <Text style={styles.featuredButtonText}>My Guinea Pigs</Text>
          </TouchableOpacity>

          <View style={styles.row}>
            <TouchableOpacity 
              style={styles.mainButton}
              onPress={() => router.push('/(stack)/bonding-timer')}
            >
              <MaterialCommunityIcons name="timer" size={32} color={colors.brown} />
              <Text style={styles.buttonText}>Bonding Timer</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.mainButton}
              onPress={() => router.push('/(stack)/care-guide')}
            >
              <MaterialCommunityIcons name="book-open-page-variant" size={32} color={colors.brown} />
              <Text style={styles.buttonText}>Care Guide</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.row}>
            <TouchableOpacity
              style={styles.mainButton}
              onPress={() => router.push('/(stack)/checklist')}
            >
              <MaterialCommunityIcons name="format-list-checks" size={32} color={colors.brown} />
              <Text style={styles.buttonText}>Care Checklist</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.mainButton}
              onPress={() => router.push('/(stack)/symptom-checker')}
            >
              <MaterialCommunityIcons name="medical-bag" size={32} color={colors.brown} />
              <Text style={styles.buttonText}>Symptom Tracker</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.row}>
            <TouchableOpacity
              style={styles.gridItem}
              onPress={() => router.push('/guinea-gram')}
            >
              <MaterialIcons name="photo-camera" size={32} color={colors.brown} />
              <Text style={styles.gridItemText}>GuineaGram</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.gridItem}
              onPress={() => router.push('/emergency-contacts')}
            >
              <MaterialIcons name="emergency" size={32} color={colors.brown} />
              <Text style={styles.gridItemText}>Emergency Contacts</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.row}>
            <TouchableOpacity
              style={styles.gridItem}
              onPress={() => router.push('/floor-time')}
            >
              <MaterialIcons name="grass" size={32} color={colors.brown} />
              <Text style={styles.gridItemText}>Playtime & Exercise</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.gridItem}
              onPress={() => router.push('/fun-facts')}
            >
              <MaterialIcons name="lightbulb" size={32} color={colors.brown} />
              <Text style={styles.gridItemText}>Fun Facts</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.logoutRow}>
          <TouchableOpacity 
            style={styles.logoutButton}
            onPress={handleSignOut}
          >
            <MaterialCommunityIcons name="logout" size={24} color={getColor.error()} />
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>

        {/* Banner Ad */}
        <BannerAdComponent style={styles.bannerAd} />
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: getColor.backgroundLight(),
  },
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: getColor.white(),
    borderBottomWidth: 1,
    borderBottomColor: getColor.border(),
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 12,
    elevation: 2,
    shadowColor: getColor.shadow(),
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 12
  },
  headerContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: '600',
    color: getColor.text(),
    textAlign: 'center'
  },
  navigationGrid: {
    flex: 1,
    padding: 12,
    gap: 12,
  },
  featuredButton: {
    backgroundColor: getColor.white(),
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    elevation: 3,
    shadowColor: getColor.shadow(),
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    marginBottom: 8,
  },
  featuredButtonText: {
    fontSize: 20,
    fontWeight: '700',
    color: getColor.text(),
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    flex: 1,
  },
  mainButton: {
    flex: 1,
    backgroundColor: getColor.white(),
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    elevation: 2,
    shadowColor: getColor.shadow(),
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
    color: getColor.text(),
    textAlign: 'center',
  },
  logoutRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    paddingHorizontal: 12,
  },
  logoutButton: {
    backgroundColor: getColor.white(),
    paddingHorizontal: 48,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 8,
    marginHorizontal: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    elevation: 2,
    shadowColor: getColor.shadow(),
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    flex: 1,
  },
  logoutButtonText: {
    color: getColor.error(),
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  gridItem: {
    flex: 1,
    backgroundColor: getColor.white(),
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    elevation: 2,
    shadowColor: getColor.shadow(),
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  gridItemText: {
    fontSize: 14,
    fontWeight: '600',
    color: getColor.text(),
    textAlign: 'center',
  },
  bannerAd: {
    // Add appropriate styles for the banner ad
  },
});

export default WelcomeScreen; 
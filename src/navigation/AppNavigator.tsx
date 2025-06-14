import ErrorBoundary from '@/components/ErrorBoundary';
import { useAuth } from '@/contexts/AuthContext';
import { RootStackParamList } from '@/navigation/types';
import AchievementsScreen from '@/screens/AchievementsScreen';
import AddEditPetScreen from '@/screens/AddEditPetScreen';
import ForgotPasswordScreen from '@/screens/auth/ForgotPasswordScreen';
import LoginScreen from '@/screens/auth/LoginScreen';
import RegisterScreen from '@/screens/auth/RegisterScreen';
import BondingGuideScreen from '@/screens/BondingGuideScreen';
import BondingTimerScreen from '@/screens/BondingTimerScreen';
import BondingTrackerScreen from '@/screens/BondingTrackerScreen';
import BreedSelectionScreen from '@/screens/BreedSelectionScreen';
import CareScheduleScreen from '@/screens/care/CareScheduleScreen';
import CareGuideSectionScreen from '@/screens/CareGuideSection';
import ChecklistScreen from '@/screens/ChecklistScreen';
import DietManagerScreen from '@/screens/diet/DietManagerScreen';
import FamilyTreeScreen from '@/screens/FamilyTreeScreen';
import GuineaGramScreen from '@/screens/GuineaGramScreen';
import CareGuideScreen from '@/screens/GuineaPigLibraryScreen';
import AddWasteLogScreen from '@/screens/health/AddWasteLogScreen';
import MedicalRecordsScreen from '@/screens/health/MedicalRecordsScreen';
import MoodTrackerScreen from '@/screens/health/MoodTrackerScreen';
import WasteLogScreen from '@/screens/health/WasteLogScreen';
import WeightTrackerScreen from '@/screens/health/WeightTrackerScreen';
import NewOwnerChecklistScreen from '@/screens/NewOwnerChecklistScreen';
import PetListScreen from '@/screens/PetListScreen';
import ProfileScreen from '@/screens/ProfileScreen';
import SafeFoodsScreen from '@/screens/SafeFoodsScreen';
import SettingsScreen from '@/screens/SettingsScreen';
import SymptomCheckerScreen from '@/screens/SymptomCheckerScreen';
import WelcomeScreen from '@/screens/WelcomeScreen';
import colors from '@/theme/colors';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Image } from 'expo-image';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AuthStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      animation: 'slide_from_right',
      contentStyle: { backgroundColor: colors.background.DEFAULT },
      animationDuration: 200,
      gestureEnabled: true,
      gestureDirection: 'horizontal',
    }}
  >
    <Stack.Screen name="login" component={LoginScreen} />
    <Stack.Screen name="register" component={RegisterScreen} />
    <Stack.Screen name="forgot-password" component={ForgotPasswordScreen} />
  </Stack.Navigator>
);

const MainStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      animation: 'slide_from_right',
      contentStyle: { backgroundColor: colors.background.DEFAULT },
      animationDuration: 200,
      gestureEnabled: true,
      gestureDirection: 'horizontal',
    }}
  >
    <Stack.Screen name="welcome" component={WelcomeScreen} />
    <Stack.Screen name="pet-list" component={PetListScreen} />
    <Stack.Screen name="profile" component={ProfileScreen} />
    <Stack.Screen name="add-edit-pet" component={AddEditPetScreen} />
    <Stack.Screen name="breed-selection" component={BreedSelectionScreen} />
    <Stack.Screen name="checklist" component={ChecklistScreen} />
    <Stack.Screen name="guinea-gram" component={GuineaGramScreen} />
    <Stack.Screen name="care-guide" component={CareGuideScreen} />
    <Stack.Screen name="care-guide-section" component={CareGuideSectionScreen} />
    <Stack.Screen name="safe-foods" component={SafeFoodsScreen} />
    <Stack.Screen name="new-owner-checklist" component={NewOwnerChecklistScreen} />
    <Stack.Screen name="medical-records" component={MedicalRecordsScreen} />
    <Stack.Screen name="weight-tracker" component={WeightTrackerScreen} />
    <Stack.Screen name="mood-tracker" component={MoodTrackerScreen} />
    <Stack.Screen name="care-schedule" component={CareScheduleScreen} />
    <Stack.Screen name="diet-manager" component={DietManagerScreen} />
    <Stack.Screen name="achievements" component={AchievementsScreen} />
    <Stack.Screen name="bonding-tracker" component={BondingTrackerScreen} />
    <Stack.Screen name="bonding-timer" component={BondingTimerScreen} />
    <Stack.Screen name="bonding-guide" component={BondingGuideScreen} />
    <Stack.Screen name="symptom-checker" component={SymptomCheckerScreen} />
    <Stack.Screen name="family-tree" component={FamilyTreeScreen} />
    <Stack.Screen name="waste-log" component={WasteLogScreen} />
    <Stack.Screen name="add-waste-log" component={AddWasteLogScreen} />
    <Stack.Screen name="settings" component={SettingsScreen} />
  </Stack.Navigator>
);

const AppNavigator = () => {
  const { isLoading, user } = useAuth();

  if (isLoading && user !== undefined) {
    return (
      <View style={styles.loadingContainer}>
        <Image
          source={require('../../assets/icon.png')}
          style={styles.logo}
          contentFit="contain"
        />
        <ActivityIndicator size="large" color={colors.primary.DEFAULT} style={styles.loader} />
      </View>
    );
  }

  return (
    <ErrorBoundary>
      <NavigationContainer>
        <StatusBar style="dark" />
        {user ? <MainStack /> : <AuthStack />}
      </NavigationContainer>
    </ErrorBoundary>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background.DEFAULT,
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  loader: {
    marginTop: 20,
  },
});

export default AppNavigator; 
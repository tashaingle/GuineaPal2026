import { RootStackParamList } from '@/navigation/types';
import AchievementsScreen from '@/screens/AchievementsScreen';
import AddEditPetScreen from '@/screens/AddEditPetScreen';
import BondingGuideScreen from '@/screens/BondingGuideScreen';
import BondingTimerScreen from '@/screens/BondingTimerScreen';
import BondingTrackerScreen from '@/screens/BondingTrackerScreen';
import BreedSelectionScreen from '@/screens/BreedSelectionScreen';
import CareScheduleScreen from '@/screens/care/CareScheduleScreen';
import ChecklistScreen from '@/screens/ChecklistScreen';
import GuineaGramScreen from '@/screens/GuineaGramScreen';
import CareGuideScreen from '@/screens/GuineaPigLibraryScreen';
import AddWasteLogScreen from '@/screens/health/AddWasteLogScreen';
import DietManagerScreen from '@/screens/health/DietManagerScreen';
import MedicalRecordsScreen from '@/screens/health/MedicalRecordsScreen';
import MoodTrackerScreen from '@/screens/health/MoodTrackerScreen';
import WasteLogScreen from '@/screens/health/WasteLogScreen';
import WeightTrackerScreen from '@/screens/health/WeightTrackerScreen';
import PetListScreen from '@/screens/PetListScreen';
import ProfileScreen from '@/screens/ProfileScreen';
import WelcomeScreen from '@/screens/WelcomeScreen';
import colors from '@/theme/colors';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackNavigationOptions } from '@react-navigation/native-stack';
import * as React from 'react';

const Stack = createNativeStackNavigator<RootStackParamList>();

// Define screen options outside of the component to prevent recreation
const screenOptions: NativeStackNavigationOptions = {
  headerShown: false,
  contentStyle: { backgroundColor: colors.background.DEFAULT },
  animation: 'none',
  animationTypeForReplace: 'pop',
  gestureEnabled: false,
  presentation: 'card',
  freezeOnBlur: true
};

const RootStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="welcome"
      screenOptions={screenOptions}
    >
      <Stack.Screen 
        name="welcome" 
        component={WelcomeScreen}
      />
      <Stack.Screen 
        name="pet-list" 
        component={PetListScreen}
      />
      <Stack.Screen 
        name="profile" 
        component={ProfileScreen}
      />
      <Stack.Screen 
        name="add-edit-pet" 
        component={AddEditPetScreen}
        options={{
          presentation: 'modal',
          animation: 'slide_from_bottom'
        }}
      />
      <Stack.Screen 
        name="breed-selection" 
        component={BreedSelectionScreen}
      />
      <Stack.Screen 
        name="checklist" 
        component={ChecklistScreen}
      />
      <Stack.Screen 
        name="guinea-gram" 
        component={GuineaGramScreen}
      />
      <Stack.Screen 
        name="care-guide" 
        component={CareGuideScreen}
      />
      
      {/* Health & Care Screens */}
      <Stack.Screen 
        name="medical-records" 
        component={MedicalRecordsScreen}
      />
      <Stack.Screen 
        name="weight-tracker" 
        component={WeightTrackerScreen}
      />
      <Stack.Screen 
        name="mood-tracker" 
        component={MoodTrackerScreen}
      />
      <Stack.Screen 
        name="care-schedule" 
        component={CareScheduleScreen}
      />
      <Stack.Screen 
        name="diet-manager" 
        component={DietManagerScreen}
      />
      <Stack.Screen 
        name="achievements" 
        component={AchievementsScreen}
      />
      <Stack.Screen 
        name="bonding-tracker" 
        component={BondingTrackerScreen}
      />
      <Stack.Screen 
        name="bonding-timer" 
        component={BondingTimerScreen}
      />
      <Stack.Screen 
        name="bonding-guide" 
        component={BondingGuideScreen}
      />
      <Stack.Screen 
        name="waste-log" 
        component={WasteLogScreen}
      />
      <Stack.Screen 
        name="add-waste-log" 
        component={AddWasteLogScreen}
      />
    </Stack.Navigator>
  );
};

const RootNavigator = () => {
  return (
    <NavigationContainer>
      <RootStack />
    </NavigationContainer>
  );
};

export default RootNavigator; 
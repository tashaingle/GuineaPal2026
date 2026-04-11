import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { PetProvider } from '@/contexts/PetContext';
import { PremiumProvider } from '@/contexts/PremiumContext';
import RootNavigator from '@/navigation/RootNavigator';
import LoginScreen from '@/screens/auth/LoginScreen';
import { ActivityIndicator, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

function AppContent() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!user) {
    return <LoginScreen navigation={undefined as any} route={undefined as any} />;
  }

  return <RootNavigator />;
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <PetProvider>
          <PremiumProvider>
            <AppContent />
          </PremiumProvider>
        </PetProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
import { useAuth } from '@/contexts/AuthContext';
import WelcomeScreen from '@/screens/WelcomeScreen';
import { useRouter } from 'expo-router';

export default function Home() {
  const router = useRouter();
  const { user } = useAuth();

  return <WelcomeScreen />;
} 
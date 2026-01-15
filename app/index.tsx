import React from 'react';
import { useAuth } from '../src/contexts/AuthContext';
import WelcomeScreen from '../src/screens/WelcomeScreen';

export function Index(): React.JSX.Element | null {
  const { user } = useAuth();
  
  if (!user) {
    return null;
  }
  
  return <WelcomeScreen />;
}

export default Index; 
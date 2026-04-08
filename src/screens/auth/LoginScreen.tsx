import { useAuth } from '@/contexts/AuthContext';
import { RootStackParamList } from '@/navigation/types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Image } from 'expo-image';
import React, { useState } from 'react';
import {
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { Button, TextInput } from 'react-native-paper';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

const LoginScreen = ({ navigation }: Props) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    try {
      setIsLoading(true);
      await login({ email, password });
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestAccountLogin = async () => {
    try {
      setIsLoading(true);
      await login({
        email: 'test@guineapal.com',
        password: 'password123'
      });
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <Image
            source={require('../../../assets/icon.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            mode="outlined"
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            style={styles.input}
            mode="outlined"
            secureTextEntry
          />
          <Button
            mode="contained"
            onPress={handleLogin}
            style={styles.button}
            loading={isLoading}
            disabled={isLoading}
          >
            Login
          </Button>
          <Button
            mode="outlined"
            onPress={handleTestAccountLogin}
            style={[styles.button, styles.testAccountButton]}
            loading={isLoading}
            disabled={isLoading}
          >
            Use Test Account
          </Button>
          <View style={styles.registerPrompt}>
            <Text style={styles.registerPromptText}>New to GuineaPal? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.registerLink}>Create Account</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8E1',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 24,
    width: '100%',
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 24,
  },
  input: {
    marginBottom: 16,
    backgroundColor: 'white',
    width: '100%',
  },
  button: {
    marginTop: 16,
    backgroundColor: '#5D4037',
    width: '100%',
  },
  testAccountButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#5D4037',
    borderRadius: 8,
  },
  registerPrompt: {
    flexDirection: 'row',
    marginTop: 24,
    alignItems: 'center',
  },
  registerPromptText: {
    color: '#5D4037',
    fontSize: 16,
  },
  registerLink: {
    color: '#5D4037',
    fontSize: 16,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});

export default LoginScreen; 
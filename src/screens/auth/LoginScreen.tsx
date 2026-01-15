import { useAuth } from '@/contexts/AuthContext';
import { getColor } from '@/theme/colors';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
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

interface Props {
  router: ReturnType<typeof useRouter>;
}

const LoginScreen: React.FC<Props> = ({ router }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (): Promise<void> => {
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

  const handleTestAccountLogin = async (): Promise<void> => {
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
            source={require('../../../assets/images/icon.png')}
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
            <Text>Login</Text>
          </Button>
          <Button
            mode="outlined"
            onPress={handleTestAccountLogin}
            style={[styles.button, styles.testAccountButton]}
            loading={isLoading}
            disabled={isLoading}
          >
            <Text>Use Test Account</Text>
          </Button>
          <View style={styles.registerPrompt}>
            <Text style={styles.registerPromptText}>New to GuineaPal? </Text>
            <TouchableOpacity onPress={() => router.push('/register')}>
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
    backgroundColor: getColor.background(),
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
    backgroundColor: getColor.background(),
    width: '100%',
  },
  button: {
    marginTop: 16,
    backgroundColor: getColor.primary(),
    width: '100%',
  },
  testAccountButton: {
    backgroundColor: getColor.transparent(),
    borderWidth: 2,
    borderColor: getColor.primary(),
    borderRadius: 8,
  },
  registerPrompt: {
    flexDirection: 'row',
    marginTop: 24,
    alignItems: 'center',
  },
  registerPromptText: {
    color: getColor.text(),
    fontSize: 16,
  },
  registerLink: {
    color: getColor.text(),
    fontSize: 16,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});

export default LoginScreen; 
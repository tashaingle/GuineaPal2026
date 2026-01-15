
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getColor } from '../../theme/colors';

interface Props {
  router: ReturnType<typeof useRouter>;
}

const ForgotPasswordScreen = ({ router }: Props): JSX.Element => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const insets = useSafeAreaInsets();

  const handleResetPassword = async (): Promise<void> => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    try {
      setIsLoading(true);
      // TODO: Implement password reset functionality in auth service
      Alert.alert(
        'Success',
        'If an account exists with this email, you will receive password reset instructions.',
        [{ text: 'OK', onPress: (): void => router.back() }]
      );
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to send reset instructions');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { paddingTop: insets.top }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <MaterialIcons name="arrow-back" size={24} color={getColor.secondary()} />
        </TouchableOpacity>
        <Text style={styles.title}>Reset Password</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.description}>
          Enter your email address and we'll send you instructions to reset your password.
        </Text>

        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          style={styles.input}
          mode="outlined"
          left={<TextInput.Icon icon="email" color={getColor.secondary()} />}
        />

        <Button
          mode="contained"
          onPress={handleResetPassword}
          loading={isLoading}
          disabled={isLoading}
          style={styles.resetButton}
          contentStyle={styles.resetButtonContent}
        >
          <Text>Send Reset Instructions</Text>
        </Button>

        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => router.push('/login')}
        >
          <Text style={styles.loginButtonText}>Back to Sign In</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: getColor.backgroundLight(),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  backButton: {
    marginRight: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: getColor.secondary(),
  },
  content: {
    padding: 24,
  },
  description: {
    fontSize: 16,
    color: getColor.secondary(),
    marginBottom: 24,
    lineHeight: 24,
  },
  input: {
    marginBottom: 24,
    backgroundColor: getColor.background(),
  },
  resetButton: {
    backgroundColor: getColor.secondary(),
  },
  resetButtonContent: {
    paddingVertical: 8,
  },
  loginButton: {
    alignItems: 'center',
    marginTop: 24,
  },
  loginButtonText: {
    color: getColor.secondary(),
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ForgotPasswordScreen; 
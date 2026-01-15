import colors, { getColor } from '@/theme/colors';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { TextInput } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const AddVetScreen: React.FC = (): JSX.Element => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [name, setName] = useState('');
  const [clinic, setClinic] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [emergency, setEmergency] = useState(false);

  const handleSave = async (): Promise<void> => {
    if (!name.trim() || !clinic.trim() || !phone.trim() || !address.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      const savedVets = await AsyncStorage.getItem('vet_details');
      const vets = savedVets ? JSON.parse(savedVets) : [];

      const newVet = {
        id: Date.now().toString(),
        name: name.trim(),
        clinic: clinic.trim(),
        phone: phone.trim(),
        address: address.trim(),
        emergency,
      };

      const updatedVets = [...vets, newVet];
      await AsyncStorage.setItem('vet_details', JSON.stringify(updatedVets));
      router.back();
    } catch (err) {
      console.error('Failed to save vet details:', err);
      Alert.alert('Error', 'Failed to save vet details. Please try again.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { paddingTop: insets.top }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={[styles.header, styles.headerContainer]}>
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <MaterialIcons name="arrow-back" size={24} color={getColor.buttonBrown()} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Add Veterinarian</Text>
        </View>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.form}>
          <TextInput
            label="Vet Name"
            value={name}
            onChangeText={setName}
            style={styles.input}
            mode="outlined"
          />
          <TextInput
            label="Clinic Name"
            value={clinic}
            onChangeText={setClinic}
            style={styles.input}
            mode="outlined"
          />
          <TextInput
            label="Phone Number"
            value={phone}
            onChangeText={setPhone}
            style={styles.input}
            mode="outlined"
            keyboardType="phone-pad"
          />
          <TextInput
            label="Address"
            value={address}
            onChangeText={setAddress}
            style={styles.input}
            mode="outlined"
            multiline
            numberOfLines={3}
          />
          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>24/7 Emergency Service</Text>
            <Switch
              value={emergency}
              onValueChange={setEmergency}
              trackColor={{ false: colors.grey, true: getColor.primary() }}
              thumbColor={emergency ? getColor.primary() : getColor.backgroundLight()}
            />
          </View>
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom }]}>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
        >
          <Text style={styles.saveButtonText}>Save Veterinarian</Text>
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
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: getColor.text(),
  },
  scrollView: {
    flex: 1,
  },
  form: {
    padding: 16,
  },
  input: {
    marginBottom: 16,
    backgroundColor: getColor.backgroundLight(),
    color: getColor.text(),
    fontSize: 16,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  switchLabel: {
    fontSize: 16,
    color: getColor.text(),
  },
  footer: {
    padding: 16,
    backgroundColor: getColor.backgroundLight(),
    borderTopWidth: 1,
    borderTopColor: getColor.border(),
  },
  saveButton: {
    backgroundColor: getColor.primary(),
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: getColor.background(),
    fontSize: 16,
    fontWeight: '600',
  },
  headerContainer: {
    marginTop: 8,
    backgroundColor: getColor.backgroundLight(),
    elevation: 2,
    shadowColor: getColor.shadow(),
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginHorizontal: 16,
    borderRadius: 12,
  },
});

export default AddVetScreen; 
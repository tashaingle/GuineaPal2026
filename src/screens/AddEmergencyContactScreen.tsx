import AppHeader from '@/components/AppHeader';
import colors from '@/theme/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface Contact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
}

export default function AddEmergencyContactScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const isEditing = !!params.contact;

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [relationship, setRelationship] = useState('');

  useEffect(() => {
    if (isEditing && params.contact) {
      const contact = JSON.parse(params.contact as string) as Contact;
      setName(contact.name);
      setPhone(contact.phone);
      setRelationship(contact.relationship);
    }
  }, [isEditing, params.contact]);

  const handleSave = async () => {
    if (!name.trim() || !phone.trim() || !relationship.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      // Get existing contacts
      const existingContactsJson = await AsyncStorage.getItem('emergencyContacts');
      const existingContacts = existingContactsJson ? JSON.parse(existingContactsJson) : [];

      if (isEditing && params.contact) {
        // Update existing contact
        const existingContact = JSON.parse(params.contact as string) as Contact;
        const updatedContacts = existingContacts.map((contact: Contact) =>
          contact.id === existingContact.id
            ? { ...contact, name: name.trim(), phone: phone.trim(), relationship: relationship.trim() }
            : contact
        );
        await AsyncStorage.setItem('emergencyContacts', JSON.stringify(updatedContacts));
      } else {
        // Add new contact
        const newContact = {
          id: Date.now().toString(),
          name: name.trim(),
          phone: phone.trim(),
          relationship: relationship.trim()
        };
        const updatedContacts = [...existingContacts, newContact];
        await AsyncStorage.setItem('emergencyContacts', JSON.stringify(updatedContacts));
      }

      // Show success message
      Alert.alert(
        'Success',
        `Emergency contact ${isEditing ? 'updated' : 'added'} successfully`,
        [
          {
            text: 'OK',
            onPress: () => {
              router.back();
            }
          }
        ]
      );
    } catch (error) {
      console.error('Error saving contact:', error);
      Alert.alert('Error', 'Failed to save emergency contact');
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <AppHeader
        title={isEditing ? "Edit Emergency Contact" : "Add Emergency Contact"}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Name</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Enter name"
                placeholderTextColor={colors.text.secondary}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Phone Number</Text>
              <TextInput
                style={styles.input}
                value={phone}
                onChangeText={setPhone}
                placeholder="Enter phone number"
                placeholderTextColor={colors.text.secondary}
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Relationship</Text>
              <TextInput
                style={styles.input}
                value={relationship}
                onChangeText={setRelationship}
                placeholder="Enter relationship (e.g., Primary Vet)"
                placeholderTextColor={colors.text.secondary}
              />
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSave}
          >
            <Text style={styles.saveButtonText}>
              {isEditing ? "Update Contact" : "Save Contact"}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.DEFAULT,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  formContainer: {
    backgroundColor: colors.background.card,
    borderRadius: 12,
    padding: 16,
    shadowColor: colors.shadow.DEFAULT,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text.secondary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.background.DEFAULT,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: colors.text.primary,
    borderWidth: 1,
    borderColor: colors.border.DEFAULT,
  },
  footer: {
    backgroundColor: colors.background.DEFAULT,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border.DEFAULT,
  },
  saveButton: {
    backgroundColor: colors.primary.DEFAULT,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    shadowColor: colors.shadow.DEFAULT,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  saveButtonText: {
    color: colors.background.card,
    fontSize: 16,
    fontWeight: '600',
  },
}); 
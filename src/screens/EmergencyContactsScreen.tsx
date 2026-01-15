import AppHeader from '@/components/AppHeader';
import { getColor } from '@/theme/colors';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface Contact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
}

interface FirstAidInstruction {
  id: string;
  title: string;
  steps: string[];
  emergency: boolean;
}

export default function EmergencyContactsScreen(): JSX.Element {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [isEditing, setIsEditing] = useState(false);
  const [emergencyContacts, setEmergencyContacts] = useState<Contact[]>([]);
  const [firstAidInstructions] = useState<FirstAidInstruction[]>([
    {
      id: '1',
      title: 'Heat Stroke',
      emergency: true,
      steps: [
        'Move to a cool area immediately',
        'Apply cool (not cold) water to the body',
        'Use a fan to help with cooling',
        'Offer small amounts of cool water to drink',
        'Contact vet immediately'
      ]
    },
    {
      id: '2',
      title: 'Respiratory Distress',
      emergency: true,
      steps: [
        'Keep the guinea pig calm and quiet',
        'Ensure good ventilation',
        'Check for any blockages in nose/mouth',
        'Keep the head elevated',
        'Contact vet immediately'
      ]
    },
    {
      id: '3',
      title: 'Injury or Bleeding',
      emergency: true,
      steps: [
        'Apply gentle pressure to stop bleeding',
        'Clean the wound with saline solution',
        'Apply antiseptic if available',
        'Keep the guinea pig warm and calm',
        'Contact vet immediately'
      ]
    },
    {
      id: '4',
      title: 'Not Eating',
      emergency: false,
      steps: [
        'Check if food is fresh and accessible',
        'Offer favorite treats',
        'Monitor water intake',
        'Check for dental issues',
        'Contact vet if not eating for 12+ hours'
      ]
    },
    {
      id: '5',
      title: 'Diarrhea',
      emergency: false,
      steps: [
        'Remove fresh vegetables temporarily',
        'Ensure clean water is available',
        'Keep the cage clean and dry',
        'Monitor for dehydration',
        'Contact vet if persists for 24+ hours'
      ]
    }
  ]);

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async (): Promise<void> => {
    try {
      const savedContacts = await AsyncStorage.getItem('emergencyContacts');
      if (savedContacts) {
        setEmergencyContacts(JSON.parse(savedContacts));
      }
    } catch {
      // Error handling is silent as per design
    }
  };

  const handleEditContact = async (contact: Contact): Promise<void> => {
    router.push({
      pathname: '/(stack)/add-emergency-contact',
      params: { contact: JSON.stringify(contact) }
    });
  };

  const handleDeleteContact = async (id: string): Promise<void> => {
    try {
      const updatedContacts = emergencyContacts.filter(contact => contact.id !== id);
      setEmergencyContacts(updatedContacts);
      await AsyncStorage.setItem('emergencyContacts', JSON.stringify(updatedContacts));
    } catch {
      // Error handling is silent as per design
    }
  };

  const renderContacts = (): JSX.Element => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Vet Emergency Contacts</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => router.push('/(stack)/add-emergency-contact')}
          >
            <MaterialIcons 
              name="add" 
              size={24} 
              color={getColor.primary()} 
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => setIsEditing(!isEditing)}
          >
            <MaterialIcons 
              name="edit" 
              size={24} 
              color={getColor.primary()} 
            />
          </TouchableOpacity>
        </View>
      </View>
      {emergencyContacts.length === 0 ? (
        <Text style={styles.emptyText}>No vet emergency contacts added yet</Text>
      ) : (
        emergencyContacts.map((contact) => (
          <View key={contact.id} style={styles.contactCard}>
            <View style={styles.contactInfo}>
              <Text style={styles.contactName}>{contact.name}</Text>
              <Text style={styles.contactPhone}>{contact.phone}</Text>
              <Text style={styles.contactRelationship}>{contact.relationship}</Text>
            </View>
            {isEditing && (
              <View style={styles.actionButtons}>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => handleEditContact(contact)}
                >
                  <Text style={styles.editButtonText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDeleteContact(contact.id)}
                >
                  <Text style={styles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))
      )}
    </View>
  );

  const renderFirstAidInstructions = (): JSX.Element => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>First Aid Instructions</Text>
      {firstAidInstructions.map(instruction => (
        <View key={instruction.id} style={styles.firstAidCard}>
          <View style={styles.firstAidHeader}>
            <Text style={styles.firstAidTitle}>{instruction.title}</Text>
            {instruction.emergency && (
              <View style={styles.emergencyBadge}>
                <Text style={styles.emergencyText}>Emergency</Text>
              </View>
            )}
          </View>
          <View style={styles.stepsContainer}>
            {instruction.steps.map((step, index) => (
              <View key={`${instruction.id}-step-${step.substring(0, 20).replace(/\s+/g, '-')}`} style={styles.stepRow}>
                <Text style={styles.stepNumber}>{index + 1}</Text>
                <Text style={styles.stepText}>{step}</Text>
              </View>
            ))}
          </View>
        </View>
      ))}
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <AppHeader title="Emergency Contacts" />
      <ScrollView style={styles.content}>
        {renderContacts()}
        {renderFirstAidInstructions()}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: getColor.backgroundLight(),
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: getColor.text(),
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addButton: {
    padding: 8,
    marginRight: 8,
  },
  editButton: {
    padding: 8,
  },
  editButtonText: {
    color: getColor.primary(),
    fontSize: 14,
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: getColor.error(),
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    marginLeft: 8,
  },
  deleteButtonText: {
    color: getColor.white(),
    fontSize: 14,
    fontWeight: '600',
  },
  emptyText: {
    textAlign: 'center',
    color: getColor.textLight(),
    fontSize: 16,
    fontStyle: 'italic',
    marginTop: 20,
  },
  contactCard: {
    backgroundColor: getColor.cardBackground(),
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: getColor.shadow(),
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: getColor.text(),
    marginBottom: 4,
  },
  contactPhone: {
    fontSize: 16,
    color: getColor.text(),
    marginBottom: 2,
  },
  contactRelationship: {
    fontSize: 14,
    color: getColor.textLight(),
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
  },
  firstAidCard: {
    backgroundColor: getColor.cardBackground(),
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: getColor.shadow(),
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  firstAidHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  firstAidTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: getColor.text(),
  },
  emergencyBadge: {
    backgroundColor: getColor.error(),
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  emergencyText: {
    color: getColor.white(),
    fontSize: 12,
    fontWeight: 'bold',
  },
  stepsContainer: {
    marginTop: 8,
  },
  stepRow: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'flex-start',
  },
  stepNumber: {
    backgroundColor: getColor.primary(),
    color: getColor.white(),
    width: 24,
    height: 24,
    borderRadius: 12,
    textAlign: 'center',
    lineHeight: 24,
    fontSize: 12,
    fontWeight: 'bold',
    marginRight: 12,
    marginTop: 2,
  },
  stepText: {
    flex: 1,
    fontSize: 16,
    color: getColor.text(),
    lineHeight: 22,
  },
}); 
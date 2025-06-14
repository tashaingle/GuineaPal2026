import AppHeader from '@/components/AppHeader';
import colors from '@/theme/colors';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
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

const EmergencyContactsScreen = () => {
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

  const loadContacts = async () => {
    try {
      const savedContacts = await AsyncStorage.getItem('emergencyContacts');
      if (savedContacts) {
        setEmergencyContacts(JSON.parse(savedContacts));
      }
    } catch (error) {
      console.error('Error loading contacts:', error);
    }
  };

  useEffect(() => {
    loadContacts();
  }, [loadContacts]);

  const handleDeleteContact = async (contactId: string) => {
    Alert.alert(
      'Delete Contact',
      'Are you sure you want to delete this contact?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const updatedContacts = emergencyContacts.filter(contact => contact.id !== contactId);
              await AsyncStorage.setItem('emergencyContacts', JSON.stringify(updatedContacts));
              setEmergencyContacts(updatedContacts);
            } catch (err) {
              console.error('Failed to delete contact:', err);
              Alert.alert('Error', 'Failed to delete contact');
            }
          },
        },
      ],
    );
  };

  const handleEditContact = (contact: Contact) => {
    router.push({
      pathname: '/add-emergency-contact',
      params: { contact: JSON.stringify(contact) }
    });
  };

  const renderContacts = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Vet Emergency Contacts</Text>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => setIsEditing(!isEditing)}
        >
          <MaterialIcons 
            name="edit" 
            size={24} 
            color={colors.primary.DEFAULT} 
          />
        </TouchableOpacity>
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
                  <MaterialIcons name="edit" size={24} color={colors.primary.DEFAULT} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDeleteContact(contact.id)}
                >
                  <MaterialIcons name="delete" size={24} color={colors.status.error} />
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))
      )}
    </View>
  );

  const renderFirstAidInstructions = () => (
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
              <View key={index} style={styles.stepRow}>
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
      <AppHeader
        title="Emergency Contacts"
      />

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.contentContainer}>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => router.push('/add-emergency-contact')}
          >
            <MaterialIcons name="add" size={24} color={colors.background.card} />
            <Text style={styles.addButtonText}>Add Vet Emergency Contact</Text>
          </TouchableOpacity>

          {renderContacts()}
          {renderFirstAidInstructions()}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.DEFAULT,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  contentContainer: {
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
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 4,
  },
  contactPhone: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 4,
  },
  contactRelationship: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  contactCard: {
    backgroundColor: colors.background.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: colors.shadow.DEFAULT,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  editButton: {
    padding: 8,
  },
  deleteButton: {
    padding: 8,
  },
  emptyText: {
    fontSize: 14,
    color: colors.text.secondary,
    fontStyle: 'italic',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary.DEFAULT,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: colors.shadow.DEFAULT,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  addButtonText: {
    color: colors.background.card,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  editButtonText: {
    color: colors.text.light,
    fontSize: 14,
    fontWeight: '500',
  },
  firstAidCard: {
    backgroundColor: colors.background.card,
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  firstAidHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  firstAidTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  stepsContainer: {
    marginTop: 8,
  },
  stepRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary.DEFAULT,
    color: colors.background.DEFAULT,
    textAlign: 'center',
    lineHeight: 24,
    marginRight: 8,
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    color: colors.text.primary,
    lineHeight: 24,
  },
  emergencyBadge: {
    backgroundColor: colors.status.error,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  emergencyText: {
    color: colors.background.DEFAULT,
    fontSize: 12,
    fontWeight: '600',
  },
});

export default EmergencyContactsScreen; 
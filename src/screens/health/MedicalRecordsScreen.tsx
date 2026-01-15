import AppHeader from '@/components/AppHeader';
import { getColor } from '@/theme/colors';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    FlatList,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface MedicalRecord {
  id: string;
  date: string;
  type: string;
  description: string;
  vet?: string;
  cost?: number;
  followUp?: string;
}

type TabType = 'all' | 'checkups' | 'treatments';

const MedicalRecordsScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [selectedTab, setSelectedTab] = useState<TabType>('all');
  const [isAddingRecord, setIsAddingRecord] = useState(false);
  const [showTypeModal, setShowTypeModal] = useState(false);
  const [newRecord, setNewRecord] = useState<Partial<MedicalRecord>>({
    date: new Date().toISOString().split('T')[0],
    type: '',
    description: '',
    vet: '',
    cost: 0,
    followUp: ''
  });

  const typeOptions = [
    { key: 'checkup', label: 'Checkup' },
    { key: 'treatment', label: 'Treatment' }
  ];

  const handleAddRecord = (): void => {
    if (newRecord.type && newRecord.description) {
      const record: MedicalRecord = {
        id: Date.now().toString(),
        date: newRecord.date || new Date().toISOString().split('T')[0],
        type: newRecord.type,
        description: newRecord.description,
        vet: newRecord.vet,
        cost: newRecord.cost,
        followUp: newRecord.followUp
      };
      const updatedRecords = [...records, record];
      setRecords(updatedRecords);
      
      // Save to AsyncStorage
      AsyncStorage.setItem('medicalRecords', JSON.stringify(updatedRecords))
        .catch(_error => {
          // Handle error silently
        });
      
      setNewRecord({
        date: new Date().toISOString().split('T')[0],
        type: '',
        description: '',
        vet: '',
        cost: 0,
        followUp: ''
      });
      setIsAddingRecord(false);
    } else {
      Alert.alert('Error', 'Please fill in all required fields');
    }
  };

  // Load records from AsyncStorage on component mount
  useEffect(() => {
    const loadRecords = async (): Promise<void> => {
      try {
        const savedRecords = await AsyncStorage.getItem('medicalRecords');
        if (savedRecords) {
          setRecords(JSON.parse(savedRecords));
        }
      } catch {
        // Handle error silently
      }
    };
    
    loadRecords();
  }, []);

  const filteredRecords = records.filter(record => {
    if (selectedTab === 'all') return true;
    return record.type.toLowerCase() === selectedTab.slice(0, -1); // Remove 's' from 'checkups'/'treatments'
  });

  const renderRecord = ({ item }: { item: MedicalRecord }): JSX.Element => (
    <View style={styles.recordCard}>
      <View style={styles.recordHeader}>
        <Text style={styles.recordDate}>{new Date(item.date).toLocaleDateString()}</Text>
        <Text style={styles.recordType}>{item.type}</Text>
      </View>
      <Text style={styles.recordDescription}>{item.description}</Text>
      {item.vet && (
        <Text style={styles.recordVet}>Vet: {item.vet}</Text>
      )}
      {item.cost && item.cost > 0 && (
        <Text style={styles.recordCost}>Cost: ${item.cost}</Text>
      )}
      {item.followUp && (
        <Text style={styles.recordFollowUp}>Follow-up: {item.followUp}</Text>
      )}
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <AppHeader title="Medical Records" />
      
      <View style={styles.content}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Medical History</Text>
          <Text style={styles.subtitle}>Track your pet's medical appointments and treatments</Text>
          
          <View style={styles.segmentedControl}>
            {[
              { key: 'all', label: 'All' },
              { key: 'checkups', label: 'Checkups' },
              { key: 'treatments', label: 'Treatments' }
            ].map((tab) => (
              <TouchableOpacity
                key={tab.key}
                style={[
                  styles.segment,
                  selectedTab === tab.key && styles.activeSegment
                ]}
                onPress={() => setSelectedTab(tab.key as TabType)}
              >
                <Text style={[
                  styles.segmentText,
                  selectedTab === tab.key && styles.activeSegmentText
                ]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <FlatList
          data={filteredRecords}
          renderItem={renderRecord}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <MaterialIcons name="medical-services" size={48} color={getColor.textSecondary()} />
              <Text style={styles.emptyText}>No medical records yet</Text>
              <Text style={styles.emptySubtext}>
                Tap the + button to add a medical record
              </Text>
            </View>
          }
        />

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setIsAddingRecord(true)}
        >
          <MaterialIcons name="add" size={24} color={getColor.white()} />
        </TouchableOpacity>

        <Modal
          visible={isAddingRecord}
          transparent
          animationType="fade"
          onRequestClose={() => setIsAddingRecord(false)}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.modalOverlay}
          >
            <View style={[styles.modalOverlay, { paddingTop: insets.top }]}>
              <ScrollView 
                style={styles.modalContainer}
                contentContainerStyle={styles.modalContentContainer}
                keyboardShouldPersistTaps="handled"
              >
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Add Medical Record</Text>
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => setIsAddingRecord(false)}
                  >
                    <MaterialIcons name="close" size={24} color={getColor.text()} />
                  </TouchableOpacity>
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.inputLabel}>Date</Text>
                  <TextInput
                    style={styles.input}
                    value={newRecord.date}
                    onChangeText={(text) => setNewRecord({ ...newRecord, date: text })}
                    placeholder="YYYY-MM-DD"
                  />
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.inputLabel}>Type *</Text>
                  <TouchableOpacity
                    style={styles.typeSelector}
                    onPress={() => setShowTypeModal(true)}
                  >
                    <Text style={styles.typeSelectorText}>
                      {newRecord.type || 'Select type'}
                    </Text>
                    <MaterialIcons name="arrow-drop-down" size={24} color={getColor.textSecondary()} />
                  </TouchableOpacity>
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.inputLabel}>Description *</Text>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    value={newRecord.description}
                    onChangeText={(text) => setNewRecord({ ...newRecord, description: text })}
                    placeholder="Describe the medical procedure or checkup"
                    multiline
                    numberOfLines={4}
                  />
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.inputLabel}>Vet (Optional)</Text>
                  <TextInput
                    style={styles.input}
                    value={newRecord.vet}
                    onChangeText={(text) => setNewRecord({ ...newRecord, vet: text })}
                    placeholder="Vet name or clinic"
                  />
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.inputLabel}>Cost (Optional)</Text>
                  <TextInput
                    style={styles.input}
                    value={newRecord.cost?.toString() || ''}
                    onChangeText={(text) => setNewRecord({ ...newRecord, cost: parseFloat(text) || 0 })}
                    placeholder="0.00"
                    keyboardType="numeric"
                  />
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.inputLabel}>Follow-up (Optional)</Text>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    value={newRecord.followUp}
                    onChangeText={(text) => setNewRecord({ ...newRecord, followUp: text })}
                    placeholder="Any follow-up instructions or notes"
                    multiline
                    numberOfLines={3}
                  />
                </View>

                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.cancelButton]}
                    onPress={() => setIsAddingRecord(false)}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.saveButton]}
                    onPress={handleAddRecord}
                  >
                    <Text style={styles.saveButtonText}>Save</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </KeyboardAvoidingView>
        </Modal>

        {/* Type Selection Modal */}
        <Modal
          visible={showTypeModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowTypeModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.typeModalContent}>
              <Text style={styles.modalTitle}>Select Type</Text>
              {typeOptions.map((type) => (
                <TouchableOpacity
                  key={type.key}
                  style={styles.typeOption}
                  onPress={() => {
                    setNewRecord({ ...newRecord, type: type.label });
                    setShowTypeModal(false);
                  }}
                >
                  <Text style={styles.typeOptionText}>{type.label}</Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                style={styles.cancelTypeButton}
                onPress={() => setShowTypeModal(false)}
              >
                <Text style={styles.cancelTypeButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: getColor.backgroundLight(),
  },
  content: {
    flex: 1,
    padding: 12,
  },
  headerContainer: {
    padding: 16,
    backgroundColor: getColor.white(),
    marginBottom: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: getColor.shadow(),
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: getColor.text(),
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: getColor.textSecondary(),
    marginBottom: 16,
  },
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: getColor.backgroundLight(),
    borderRadius: 8,
    padding: 4,
  },
  segment: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
  },
  activeSegment: {
    backgroundColor: getColor.white(),
    elevation: 1,
    shadowColor: getColor.shadow(),
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  segmentText: {
    fontSize: 14,
    color: getColor.textSecondary(),
  },
  activeSegmentText: {
    color: getColor.primary(),
    fontWeight: '600',
  },
  listContent: {
    padding: 12,
  },
  recordCard: {
    backgroundColor: getColor.white(),
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: getColor.shadow(),
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  recordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  recordDate: {
    fontSize: 14,
    color: getColor.textSecondary(),
  },
  recordType: {
    fontSize: 16,
    fontWeight: '600',
    color: getColor.primary(),
  },
  recordDescription: {
    fontSize: 16,
    color: getColor.text(),
    marginBottom: 8,
    lineHeight: 22,
  },
  recordVet: {
    fontSize: 14,
    color: getColor.textSecondary(),
    marginBottom: 4,
  },
  recordCost: {
    fontSize: 14,
    color: getColor.textSecondary(),
    marginBottom: 4,
  },
  recordFollowUp: {
    fontSize: 14,
    color: getColor.textSecondary(),
    fontStyle: 'italic',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    gap: 8,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: getColor.text(),
  },
  emptySubtext: {
    fontSize: 14,
    color: getColor.textSecondary(),
    textAlign: 'center',
  },
  addButton: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    backgroundColor: getColor.primary(),
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: getColor.shadow(),
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: getColor.backgroundLight(),
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: getColor.white(),
    margin: 20,
    borderRadius: 12,
    elevation: 3,
    shadowColor: getColor.shadow(),
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    maxHeight: '90%',
  },
  modalContentContainer: {
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: getColor.border(),
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: getColor.text(),
  },
  closeButton: {
    padding: 4,
  },
  formGroup: {
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  inputLabel: {
    fontSize: 16,
    color: getColor.text(),
    marginBottom: 8,
  },
  input: {
    backgroundColor: getColor.white(),
    borderWidth: 1,
    borderColor: getColor.border(),
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: getColor.text(),
    elevation: 1,
    shadowColor: getColor.shadow(),
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 16,
    gap: 12,
  },
  modalButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    elevation: 2,
    shadowColor: getColor.shadow(),
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cancelButton: {
    backgroundColor: getColor.white(),
    borderWidth: 1,
    borderColor: getColor.border(),
  },
  saveButton: {
    backgroundColor: getColor.primary(),
  },
  cancelButtonText: {
    color: getColor.text(),
    fontSize: 16,
    fontWeight: '600',
  },
  saveButtonText: {
    color: getColor.white(),
    fontSize: 16,
    fontWeight: '600',
  },
  typeSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: getColor.white(),
    borderWidth: 1,
    borderColor: getColor.border(),
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: getColor.text(),
    elevation: 1,
    shadowColor: getColor.shadow(),
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  typeSelectorText: {
    fontSize: 16,
    color: getColor.text(),
  },
  typeModalContent: {
    backgroundColor: getColor.white(),
    padding: 20,
    borderRadius: 12,
    elevation: 3,
    shadowColor: getColor.shadow(),
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    maxHeight: '90%',
  },
  typeOption: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: getColor.border(),
    backgroundColor: getColor.white(),
  },
  typeOptionText: {
    fontSize: 16,
    color: getColor.text(),
  },
  cancelTypeButton: {
    padding: 16,
    alignItems: 'center',
  },
  cancelTypeButtonText: {
    color: getColor.text(),
    fontSize: 16,
    fontWeight: '600',
  },
});

export default MedicalRecordsScreen; 
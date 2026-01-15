import AppHeader from '@/components/AppHeader';
import { WeightRecord } from '@/navigation/types';
import { getColor } from '@/theme/colors';
import { deleteWeightRecord, loadWeightRecords, saveWeightRecord, updateWeightRecord } from '@/utils/petStorage';
import { MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Dimensions,
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
import { LineChart } from 'react-native-chart-kit';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const WeightTrackerScreen: React.FC = (): JSX.Element => {
  const params = useLocalSearchParams();
  const petId = params.petId as string;
  const [records, setRecords] = useState<WeightRecord[]>([]);
  const [newRecord, setNewRecord] = useState<Partial<WeightRecord>>({
    weight: 0,
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });
  const [isAddingRecord, setIsAddingRecord] = useState<boolean>(false);
  const [isEditingRecord, setIsEditingRecord] = useState<boolean>(false);
  const [editingRecord, setEditingRecord] = useState<WeightRecord | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showEditDatePicker, setShowEditDatePicker] = useState(false);

  const insets = useSafeAreaInsets();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async (): Promise<void> => {
    try {
      const records = await loadWeightRecords(petId);
      setRecords(records);
    } catch {
      Alert.alert('Error', 'Failed to load weight records. Please try again.');
    }
  };

  const handleAddRecord = async (): Promise<void> => {
    if (newRecord.weight && newRecord.date) {
      const record: WeightRecord = {
        id: Date.now().toString(),
        weight: newRecord.weight,
        date: newRecord.date,
        notes: newRecord.notes || ''
      };
      try {
        await saveWeightRecord(petId, record);
        await loadData();
        setNewRecord({ weight: 0, date: new Date().toISOString().split('T')[0], notes: '' });
        setIsAddingRecord(false);
      } catch {
        Alert.alert('Error', 'Failed to save weight record. Please try again.');
      }
    }
  };

  const handleEditRecord = (record: WeightRecord): void => {
    setEditingRecord(record);
    setIsEditingRecord(true);
  };

  const handleSaveEdit = async (): Promise<void> => {
    if (editingRecord && editingRecord.weight && editingRecord.date) {
      try {
        await updateWeightRecord(petId, editingRecord);
        await loadData();
        setEditingRecord(null);
        setIsEditingRecord(false);
      } catch {
        Alert.alert('Error', 'Failed to update weight record. Please try again.');
      }
    }
  };

  const handleDeleteRecord = (recordId: string): void => {
    Alert.alert(
      'Delete Record',
      'Are you sure you want to delete this weight record?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteWeightRecord(petId, recordId);
              await loadData();
            } catch {
              Alert.alert('Error', 'Failed to delete weight record. Please try again.');
            }
          }
        }
      ]
    );
  };

  const handleDateChange = (event: unknown, selectedDate?: Date): void => {
    setShowDatePicker(false);
    if (selectedDate) {
      setNewRecord({ ...newRecord, date: selectedDate.toISOString().split('T')[0] });
    }
  };

  const handleEditDateChange = (event: unknown, selectedDate?: Date): void => {
    setShowEditDatePicker(false);
    if (selectedDate && editingRecord) {
      setEditingRecord({ ...editingRecord, date: selectedDate.toISOString().split('T')[0] });
    }
  };

  const chartData = {
    labels: records.map(record => 
      new Date(record.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    ),
    datasets: [{
      data: records.map(record => parseFloat(record.weight.toString()))
    }]
  };

  const chartConfig = {
    backgroundColor: getColor.white(),
    backgroundGradientFrom: getColor.white(),
    backgroundGradientTo: getColor.white(),
    decimalPlaces: 1,
    color: (opacity = 1): string => `rgba(93, 64, 55, ${opacity})`,
    labelColor: (opacity = 1): string => `rgba(93, 64, 55, ${opacity})`,
    style: {
      borderRadius: 12
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: getColor.primary()
    }
  };

  const renderWeightRecord = ({ item }: { item: WeightRecord }): JSX.Element => (
    <View style={styles.recordItem}>
      <View style={styles.recordHeader}>
        <View style={styles.recordInfo}>
          <Text style={styles.recordDate}>
            {new Date(item.date).toLocaleDateString()}
          </Text>
          <Text style={styles.recordWeight}>{item.weight} kg</Text>
        </View>
        <View style={styles.recordActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleEditRecord(item)}
          >
            <MaterialIcons name="edit" size={20} color={getColor.primary()} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleDeleteRecord(item.id)}
          >
            <MaterialIcons name="delete" size={20} color={getColor.error()} />
          </TouchableOpacity>
        </View>
      </View>
      {item.notes && (
        <Text style={styles.recordNotes}>{item.notes}</Text>
      )}
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <AppHeader 
        title="Weight Tracker"
      />
      <View style={styles.content}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setIsAddingRecord(true)}
        >
          <MaterialIcons name="add" size={24} color={getColor.white()} />
          <Text style={styles.addButtonText}>Add Weight Record</Text>
        </TouchableOpacity>

        {records.length > 0 ? (
          <View style={styles.chartContainer}>
            <Text style={styles.chartTitle}>Weight Trend</Text>
            <LineChart
              data={chartData}
              width={Dimensions.get('window').width - 64}
              height={220}
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
            />
          </View>
        ) : (
          <View style={styles.chartContainer}>
            <View style={styles.emptyChart}>
              <Text style={styles.emptyChartText}>No weight records yet</Text>
            </View>
          </View>
        )}

        <FlatList
          data={records}
          renderItem={renderWeightRecord}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <MaterialIcons name="monitor-weight" size={48} color={getColor.textSecondary()} />
              <Text style={styles.emptyText}>No weight records yet</Text>
              <Text style={styles.emptySubtext}>
                Add your first weight record to start tracking
              </Text>
            </View>
          }
        />

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
            <ScrollView contentContainerStyle={styles.modalScrollContent}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Add Weight Record</Text>
                
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Weight (kg)</Text>
                  <TextInput
                    style={styles.input}
                    value={newRecord.weight?.toString() || ''}
                    onChangeText={(text) => setNewRecord({ ...newRecord, weight: parseFloat(text) || 0 })}
                    placeholder="0.0"
                    keyboardType="numeric"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Date</Text>
                  <TouchableOpacity
                    style={styles.dateInput}
                    onPress={() => setShowDatePicker(true)}
                  >
                    <Text style={styles.dateInputText}>
                      {newRecord.date || 'Select date'}
                    </Text>
                  </TouchableOpacity>
                  {showDatePicker && (
                    <DateTimePicker
                      value={new Date(newRecord.date || Date.now())}
                      mode="date"
                      display="default"
                      onChange={handleDateChange}
                    />
                  )}
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Notes (Optional)</Text>
                  <TextInput
                    style={[styles.input, styles.notesInput]}
                    value={newRecord.notes}
                    onChangeText={(text) => setNewRecord({ ...newRecord, notes: text })}
                    placeholder="Any additional notes"
                    multiline
                  />
                </View>

                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.cancelButton]}
                    onPress={() => setIsAddingRecord(false)}
                  >
                    <Text style={styles.buttonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.saveButton]}
                    onPress={handleAddRecord}
                  >
                    <Text style={[styles.buttonText, styles.saveButtonText]}>Save</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </Modal>

        <Modal
          visible={isEditingRecord}
          transparent
          animationType="fade"
          onRequestClose={() => setIsEditingRecord(false)}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.modalOverlay}
          >
            <ScrollView contentContainerStyle={styles.modalScrollContent}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Edit Weight Record</Text>
                
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Weight (kg)</Text>
                  <TextInput
                    style={styles.input}
                    value={editingRecord?.weight?.toString() || ''}
                    onChangeText={(text) => editingRecord && setEditingRecord({ ...editingRecord, weight: parseFloat(text) || 0 })}
                    placeholder="0.0"
                    keyboardType="numeric"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Date</Text>
                  <TouchableOpacity
                    style={styles.dateInput}
                    onPress={() => setShowEditDatePicker(true)}
                  >
                    <Text style={styles.dateInputText}>
                      {editingRecord?.date || 'Select date'}
                    </Text>
                  </TouchableOpacity>
                  {showEditDatePicker && (
                    <DateTimePicker
                      value={new Date(editingRecord?.date || Date.now())}
                      mode="date"
                      display="default"
                      onChange={handleEditDateChange}
                    />
                  )}
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Notes (Optional)</Text>
                  <TextInput
                    style={[styles.input, styles.notesInput]}
                    value={editingRecord?.notes}
                    onChangeText={(text) => editingRecord && setEditingRecord({ ...editingRecord, notes: text })}
                    placeholder="Any additional notes"
                    multiline
                  />
                </View>

                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.cancelButton]}
                    onPress={() => setIsEditingRecord(false)}
                  >
                    <Text style={styles.buttonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.saveButton]}
                    onPress={handleSaveEdit}
                  >
                    <Text style={[styles.buttonText, styles.saveButtonText]}>Save</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
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
    padding: 16,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: getColor.primary(),
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: getColor.shadow(),
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  addButtonText: {
    color: getColor.white(),
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  chartContainer: {
    backgroundColor: getColor.white(),
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: getColor.shadow(),
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: getColor.text(),
    marginBottom: 16,
  },
  chart: {
    borderRadius: 12,
  },
  emptyChart: {
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyChartText: {
    color: getColor.textSecondary(),
    fontSize: 16,
  },
  listContent: {
    flexGrow: 1,
  },
  recordItem: {
    backgroundColor: getColor.white(),
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: getColor.shadow(),
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  recordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  recordInfo: {
    flex: 1,
  },
  recordActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: getColor.background(),
  },
  recordDate: {
    fontSize: 16,
    fontWeight: '600',
    color: getColor.text(),
    marginBottom: 4,
  },
  recordWeight: {
    fontSize: 18,
    fontWeight: '700',
    color: getColor.primary(),
  },
  recordNotes: {
    fontSize: 14,
    color: getColor.textSecondary(),
    fontStyle: 'italic',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: getColor.text(),
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: getColor.textSecondary(),
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: getColor.modalOverlay(),
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalScrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: getColor.white(),
    borderRadius: 16,
    padding: 24,
    shadowColor: getColor.shadow(),
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: getColor.text(),
    marginBottom: 24,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: getColor.text(),
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: getColor.border(),
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: getColor.text(),
    backgroundColor: getColor.white(),
  },
  dateInput: {
    borderWidth: 1,
    borderColor: getColor.border(),
    borderRadius: 8,
    padding: 12,
    backgroundColor: getColor.white(),
  },
  dateInputText: {
    fontSize: 16,
    color: getColor.text(),
  },
  notesInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  cancelButton: {
    backgroundColor: getColor.background(),
    borderWidth: 1,
    borderColor: getColor.border(),
    flex: 1.2,
  },
  saveButton: {
    backgroundColor: getColor.primary(),
    flex: 0.8,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '600',
    color: getColor.text(),
    textAlign: 'center',
  },
  saveButtonText: {
    color: getColor.white(),
  },
});

export default WeightTrackerScreen; 